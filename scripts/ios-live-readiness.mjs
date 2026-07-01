const baseUrl = (process.env.LIVE_APP_BASE_URL || "https://ucla-knee-mri.firebaseapp.com").replace(/\/$/, "");

const checks = [];

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
  const assetPaths = new Set();
  for (const match of html.matchAll(/(?:src|href)="([^"]+\.js[^"]*)"/g)) {
    assetPaths.add(match[1]);
  }

  if (assetPaths.size === 0) {
    fail("Live JS bundle references found", "No .js assets in index.html");
    return "";
  }
  pass("Live JS bundle references found", `${assetPaths.size} JS asset(s)`);

  const chunks = [];
  for (const assetPath of assetPaths) {
    const assetUrl = new URL(assetPath, baseUrl).toString();
    const result = await fetchText(assetUrl);
    chunks.push(result.text);
  }
  return chunks.join("\n");
}

function assertBodyIncludes(label, body, needle) {
  if (body.includes(needle)) {
    pass(label, needle);
  } else {
    fail(label, `Missing ${needle}`);
  }
}

async function main() {
  console.log(`Checking live iOS App Store readiness at ${baseUrl}\n`);

  const home = await fetchText("/");
  assertBodyIncludes("Live app has Vite root", home.text, "root");
  const bundleText = await fetchBundleText(home.text);

  const privacy = await fetchText("/privacy");
  assertBodyIncludes("Live privacy route serves app shell", privacy.text, "root");

  const support = await fetchText("/support");
  assertBodyIncludes("Live support route serves app shell", support.text, "root");

  const login = await fetchText("/login?source=ios-app&reviewerDemo=1");
  assertBodyIncludes("Live login route serves app shell", login.text, "root");
  assertBodyIncludes("Live bundle includes Sign in with Apple", bundleText, "Sign in with Apple");
  assertBodyIncludes("Live bundle includes App Review demo", bundleText, "Continue in App Review demo");
  assertBodyIncludes("Live bundle includes medical disclaimer", bundleText, "Educational training only");

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
