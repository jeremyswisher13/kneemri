const CACHE_VERSION = "ucla-sports-mri-v6";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/pwa-icon.svg",
  "/pwa-icon-192.png",
  "/pwa-icon-512.png",
  "/pwa-maskable-icon.svg",
  "/pwa-maskable-icon-512.png",
  "/apple-touch-icon.png",
  "/offline.html"
];

async function cacheResponse(cache, url, options) {
  try {
    const response = await fetch(url, options);
    if (response.ok) await cache.put(url, response.clone());
    return response.ok ? response : null;
  } catch {
    return null;
  }
}

async function precacheAppShell() {
  const cache = await caches.open(CACHE_VERSION);
  await Promise.all(APP_SHELL.map((url) => cacheResponse(cache, url)));

  // Vite fingerprints the production JS/CSS filenames. Parse the just-built
  // index and cache those exact files so the first fully closed home-screen
  // relaunch works offline, even if the worker did not control the first load.
  const indexResponse = await cacheResponse(cache, "/index.html", { cache: "no-store" });
  if (!indexResponse) return;
  const html = await indexResponse.text();
  const assetUrls = [
    ...new Set(
      [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  await Promise.all(assetUrls.map((url) => cacheResponse(cache, url)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    precacheAppShell().then(() => {
      // First install can activate immediately. Updates wait until the learner
      // accepts the in-app prompt, preventing an old page/new asset mismatch.
      if (!self.registration.active) return self.skipWaiting();
      return undefined;
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "GET_VERSION") {
    event.ports?.[0]?.postMessage({ cacheVersion: CACHE_VERSION });
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

/**
 * Build output under /assets/ is CONTENT-HASHED — a changed file gets a new
 * filename — so it is safe (and fastest) to serve cache-first and never
 * revalidate.
 */
function isImmutableAsset(request) {
  return new URL(request.url).pathname.startsWith("/assets/");
}

/**
 * Teaching images have STABLE filenames (e.g. /images/teaching/stacks/.../slice_09.jpg).
 * Cache-first would pin the old bytes forever on an installed device, because
 * CACHE_VERSION is hardcoded and a deploy does not bump it — so a CORRECTED MRI
 * image would never reach fellows who already have it cached. These must
 * revalidate in the background instead.
 */
function isRevalidatingImage(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".webp")
  );
}

/**
 * Cache-first for speed, but always refetch in the background so corrected
 * images land on the next view. Deliberately has NO offline.html fallback —
 * an <img> must never be handed an HTML document.
 */
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Complete the cache write before declaring background revalidation done.
      // A cache quota failure must not discard an otherwise valid response.
      await cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    return undefined;
  }
}

async function staleWhileRevalidateImage(request, event) {
  const cachePromise = caches.open(CACHE_VERSION);
  const network = cachePromise.then((cache) => fetchAndCache(request, cache));

  // Register this before the first await. Safari and other engines may reject
  // waitUntil() once dispatch has returned, even while respondWith() is pending.
  event.waitUntil(network.then(() => undefined));

  const cache = await cachePromise;
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  return (await network) || Response.error();
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_VERSION);
    await cache.put(request, response.clone()).catch(() => {});
  }
  return response;
}

async function staleWhileRevalidate(request, event) {
  const cachePromise = caches.open(CACHE_VERSION);
  const network = cachePromise.then((cache) => fetchAndCache(request, cache));
  event.waitUntil(network.then(() => undefined));

  const cache = await cachePromise;
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  return (await network) || caches.match("/offline.html");
}

async function navigationFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      await cache.put("/index.html", response.clone()).catch(() => {});
    }
    return response;
  } catch {
    return (await caches.match("/index.html")) || caches.match("/offline.html");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !isSameOrigin(request)) return;

  if (request.mode === "navigate") {
    event.respondWith(navigationFirst(request));
    return;
  }

  if (isImmutableAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isRevalidatingImage(request)) {
    event.respondWith(staleWhileRevalidateImage(request, event));
    return;
  }

  if (request.destination === "script" || request.destination === "style") {
    event.respondWith(staleWhileRevalidate(request, event));
  }
});
