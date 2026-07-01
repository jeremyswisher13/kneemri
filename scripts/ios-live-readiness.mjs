const baseUrl = (process.env.LIVE_APP_BASE_URL || "https://ucla-knee-mri.firebaseapp.com").replace(/\/$/, "");
const authHandlerUrls = [
  "https://ucla-knee-mri.firebaseapp.com/__/auth/handler",
  "https://ucla-knee-mri.web.app/__/auth/handler",
];

const checks = [];
const maxBundleAssets = Number(process.env.LIVE_BUNDLE_ASSET_LIMIT || 120);

function pass(label, detail = "") {
  checks.push({ ok: true, label, detail });
}

function fail(label, detail = "") {
  checks.push({ ok: false, label, detail });
}

async function fetchText(pathname) {
  const url = pathname.startsWith("http") ? pathname : `${baseUrl}${pathname}`;
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "UCLASportsMRI-AppStoreReadiness/1.0",
    },
  });
  const text = await response.text();
  if (response.ok) {
    pass(`GET ${pathname}`, `${response.status} ${url}`);
  } else {
    fail(`GET ${pathname}`, `${response.status} ${url}`);
  }
  return { response, text, url };
}

async function fetchBundleText(html) {
  const initialAssetPaths = discoverHtmlJsAssets(html);
  if (initialAssetPaths.size === 0) {
    fail("Live JS bundle references found", "No .js assets in index.html");
    return "";
  }
  pass("Live JS bundle references found", `${initialAssetPaths.size} JS asset(s) in index.html`);

  const chunks = [];
  const pendingAssetUrls = Array.from(initialAssetPaths, (assetPath) => new URL(assetPath, baseUrl).toString());
  const fetchedAssetUrls = new Set();
  const allowedOrigin = new URL(baseUrl).origin;

  while (pendingAssetUrls.length > 0) {
    if (fetchedAssetUrls.size >= maxBundleAssets) {
      fail("Live JS bundle crawl stayed under limit", `Reached ${maxBundleAssets} JS assets`);
      break;
    }

    const assetUrl = pendingAssetUrls.shift();
    if (!assetUrl || fetchedAssetUrls.has(assetUrl)) continue;
    fetchedAssetUrls.add(assetUrl);

    const result = await fetchText(assetUrl);
    failIfJsAssetWasRewrittenToHtml(assetUrl, result.text);
    chunks.push(result.text);

    for (const assetPath of discoverReferencedJsAssets(result.text)) {
      const nextUrl = resolveAssetUrl(assetPath, result.url);
      if (new URL(nextUrl).origin !== allowedOrigin) continue;
      if (!fetchedAssetUrls.has(nextUrl) && !pendingAssetUrls.includes(nextUrl)) {
        pendingAssetUrls.push(nextUrl);
      }
    }
  }

  pass("Live JS bundle and lazy chunks fetched", `${fetchedAssetUrls.size} JS asset(s)`);
  return chunks.join("\n");
}

function failIfJsAssetWasRewrittenToHtml(assetUrl, text) {
  const normalized = text.trimStart().toLowerCase();
  if (normalized.startsWith("<!doctype html") || normalized.includes('<div id="root"')) {
    fail("Live JS asset did not rewrite to HTML shell", assetUrl);
  }
}

function resolveAssetUrl(assetPath, fromUrl) {
  if (assetPath.startsWith("assets/")) {
    return new URL(`/${assetPath}`, baseUrl).toString();
  }
  return new URL(assetPath, fromUrl).toString();
}

function discoverHtmlJsAssets(html) {
  const assetPaths = new Set();
  for (const match of html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)) {
    assetPaths.add(match[1]);
  }
  return assetPaths;
}

function discoverReferencedJsAssets(source) {
  const assetPaths = new Set();
  const patterns = [
    /["'`](\/assets\/[^"'`]+?\.js(?:\?[^"'`]*)?)["'`]/g,
    /["'`](assets\/[^"'`]+?\.js(?:\?[^"'`]*)?)["'`]/g,
    /["'`](\.\/[^"'`/]+?\.js(?:\?[^"'`]*)?)["'`]/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      assetPaths.add(match[1]);
    }
  }
  return assetPaths;
}

function assertBodyIncludes(label, body, needle) {
  if (body.includes(needle)) {
    pass(label, needle);
  } else {
    fail(label, `Missing ${needle}`);
  }
}

function assertContentTypeIncludes(label, response, needle) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes(needle)) {
    pass(label, contentType);
  } else {
    fail(label, `Expected ${needle}; got ${contentType || "missing content-type"}`);
  }
}

async function main() {
  console.log(`Checking live iOS App Store readiness at ${baseUrl}\n`);

  const home = await fetchText("/");
  assertBodyIncludes("Live app has Vite root", home.text, "root");
  const bundleText = await fetchBundleText(home.text);

  const manifest = await fetchText("/manifest.webmanifest");
  assertContentTypeIncludes("Live web manifest content type", manifest.response, "application/manifest+json");
  assertBodyIncludes("Live web manifest names app", manifest.text, "UCLA Sports MRI");
  assertBodyIncludes("Live web manifest includes 512 icon", manifest.text, "/pwa-icon-512.png");

  const favicon = await fetchText("/favicon.svg");
  assertContentTypeIncludes("Live favicon content type", favicon.response, "image/svg+xml");
  assertBodyIncludes("Live favicon names app", favicon.text, "UCLA Sports MRI favicon");

  const appleTouchIcon = await fetchText("/apple-touch-icon.png");
  assertContentTypeIncludes("Live Apple touch icon content type", appleTouchIcon.response, "image/png");

  const pwaIcon = await fetchText("/pwa-icon-512.png");
  assertContentTypeIncludes("Live 512 PWA icon content type", pwaIcon.response, "image/png");

  const privacy = await fetchText("/privacy");
  assertBodyIncludes("Live privacy route serves app shell", privacy.text, "root");

  const support = await fetchText("/support");
  assertBodyIncludes("Live support route serves app shell", support.text, "root");

  const accessibility = await fetchText("/accessibility");
  assertBodyIncludes("Live accessibility route serves app shell", accessibility.text, "root");

  const account = await fetchText("/account");
  assertBodyIncludes("Live account route serves app shell", account.text, "root");

  const login = await fetchText("/login?source=ios-app&reviewerDemo=1");
  assertBodyIncludes("Live login route serves app shell", login.text, "root");
  assertBodyIncludes("Live bundle includes Sign in with Apple", bundleText, "Sign in with Apple");
  assertBodyIncludes("Live bundle includes App Review demo", bundleText, "Continue in App Review demo");
  assertBodyIncludes("Live bundle includes medical disclaimer", bundleText, "Educational training only");
  assertBodyIncludes("Live bundle includes native iOS shell marker", bundleText, "UCLASportsMRIiOS");
  assertBodyIncludes("Live bundle includes account deletion route", bundleText, "Request account deletion");
  assertBodyIncludes("Live bundle includes account deletion confirmation", bundleText, "Confirm deletion request");
  assertBodyIncludes("Live bundle includes account deletion notice", bundleText, "Your account deletion request has been recorded.");

  for (const authHandlerUrl of authHandlerUrls) {
    const handler = await fetchText(authHandlerUrl);
    assertBodyIncludes(`Firebase Auth handler is live at ${authHandlerUrl}`, handler.text, "firebase-auth-helper");
  }

  const failures = checks.filter((check) => !check.ok);
  for (const check of checks) {
    const icon = check.ok ? "PASS" : "FAIL";
    console.log(`${icon} ${check.label}${check.detail ? ` - ${check.detail}` : ""}`);
  }

  if (failures.length > 0) {
    console.error(
      `\n${failures.length} live readiness check(s) failed. If this is production, deploy the current build after Apple/Firebase auth setup is complete.`,
    );
    process.exit(1);
  }

  console.log(`\n${checks.length} live iOS App Store readiness checks passed.`);
}

main().catch((err) => {
  console.error(`Live readiness check could not run: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
