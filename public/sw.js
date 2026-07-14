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

function isStaticAsset(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".webp")
  );
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_VERSION);
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);
  // `network` is a promise; it must be awaited before the `||` chain, otherwise
  // a cache-miss returns the pending promise and the offline fallback is skipped
  // when the network request ultimately fails.
  return cached || (await network) || caches.match("/offline.html");
}

async function navigationFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put("/index.html", response.clone());
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

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.destination === "script" || request.destination === "style") {
    event.respondWith(staleWhileRevalidate(request));
  }
});
