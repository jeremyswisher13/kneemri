import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verify = process.argv.includes("--verify");
const evidencePath = join(root, "ios", "AppleFirebaseAuthEvidence.json");
const submissionGatePath = join(root, "ios", "AppStoreSubmissionGate.json");
const entitlementsPath = join(root, "ios", "UCLASportsMRI", "UCLASportsMRI.entitlements");
const authSourcePath = join(root, "src", "lib", "auth.ts");
const loginPagePath = join(root, "src", "pages", "LoginPage.tsx");
const evidenceText = readFileSync(evidencePath, "utf8");
const evidence = JSON.parse(evidenceText);
const submissionGate = JSON.parse(readFileSync(submissionGatePath, "utf8"));
const entitlements = readFileSync(entitlementsPath, "utf8");
const authSource = readFileSync(authSourcePath, "utf8");
const loginPage = readFileSync(loginPagePath, "utf8");

const expected = {
  bundleId: "com.jeremyswisher.uclasportsmri",
  firebaseProjectId: "ucla-knee-mri",
  primaryReturnUrl: "https://ucla-knee-mri.firebaseapp.com/__/auth/handler",
  secondaryAuthHandler: "https://ucla-knee-mri.web.app/__/auth/handler",
  authorizedDomains: ["ucla-knee-mri.firebaseapp.com", "ucla-knee-mri.web.app"],
};

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function includesAll(actual, required) {
  return Array.isArray(actual) && required.every((value) => actual.includes(value));
}

function hasSecretLeak(raw) {
  return /-----BEGIN [A-Z ]*PRIVATE KEY-----|\.p8\b|(?:private[_-]?key|client[_-]?secret|api[_-]?key|service[_-]?account)\s*[:=]\s*["']?[A-Za-z0-9+/=._-]{20,}|firebase-adminsdk/i.test(raw);
}

const secretLeak = hasSecretLeak(evidenceText);
const apple = evidence.appleDeveloper ?? {};
const firebase = evidence.firebaseAuth ?? {};
const nativeEntitlementReady = entitlements.includes("com.apple.developer.applesignin");
const webAppleProviderReady =
  authSource.includes('new OAuthProvider("apple.com")') &&
  authSource.includes('appleProvider.addScope("email")') &&
  authSource.includes('appleProvider.addScope("name")') &&
  authSource.includes("signInWithRedirect(auth, appleProvider)") &&
  loginPage.includes("Sign in with Apple");

const items = [
  {
    group: "Apple Developer",
    key: "appleDeveloper.signInWithAppleEnabledForBundleId",
    value: apple.signInWithAppleEnabledForBundleId,
    ready:
      apple.signInWithAppleEnabledForBundleId === true &&
      apple.bundleId === expected.bundleId &&
      text(apple.confirmedAt) &&
      text(apple.confirmedBy),
    next: "Enable Sign in with Apple on App ID com.jeremyswisher.uclasportsmri, then record confirmedAt and confirmedBy.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.appleProviderConfigured",
    value: firebase.appleProviderConfigured,
    ready:
      firebase.appleProviderConfigured === true &&
      firebase.firebaseProjectId === expected.firebaseProjectId &&
      text(firebase.confirmedAt) &&
      text(firebase.confirmedBy),
    next: "Enable the Apple provider in Firebase Authentication and record Firebase confirmation evidence.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.appleServiceIdCreated",
    value: firebase.appleServiceIdCreated,
    ready:
      firebase.appleServiceIdCreated === true &&
      firebase.firebaseProjectId === expected.firebaseProjectId &&
      firebase.primaryReturnUrl === expected.primaryReturnUrl &&
      text(firebase.confirmedAt) &&
      text(firebase.confirmedBy),
    next: "Create the Apple Service ID and verify its Return URL is https://ucla-knee-mri.firebaseapp.com/__/auth/handler.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.applePrivateKeyConfigured",
    value: firebase.applePrivateKeyConfigured,
    ready:
      firebase.applePrivateKeyConfigured === true &&
      firebase.firebaseProjectId === expected.firebaseProjectId &&
      text(firebase.confirmedAt) &&
      text(firebase.confirmedBy),
    next: "Enter Team ID, Key ID, Service ID, and private key in Firebase Console only. Do not commit secrets.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.redirectUrlVerifiedInAppleAndFirebase",
    value: firebase.redirectUrlVerifiedInAppleAndFirebase,
    ready:
      firebase.redirectUrlVerifiedInAppleAndFirebase === true &&
      firebase.firebaseProjectId === expected.firebaseProjectId &&
      firebase.primaryReturnUrl === expected.primaryReturnUrl &&
      firebase.secondaryAuthHandler === expected.secondaryAuthHandler &&
      text(firebase.confirmedAt) &&
      text(firebase.confirmedBy),
    next: "Confirm Apple and Firebase both use the Firebase Auth callback URL.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.authorizedDomainsIncludeFirebaseHosting",
    value: firebase.authorizedDomainsIncludeFirebaseHosting,
    ready:
      firebase.authorizedDomainsIncludeFirebaseHosting === true &&
      firebase.firebaseProjectId === expected.firebaseProjectId &&
      includesAll(firebase.authorizedDomains, expected.authorizedDomains) &&
      text(firebase.confirmedAt) &&
      text(firebase.confirmedBy),
    next: "Confirm Firebase authorized domains include ucla-knee-mri.firebaseapp.com and ucla-knee-mri.web.app.",
  },
];

const sourceChecks = [
  {
    label: "Native Sign in with Apple entitlement is wired",
    ok: nativeEntitlementReady,
    detail: "com.apple.developer.applesignin",
  },
  {
    label: "Web app exposes Firebase apple.com provider",
    ok: webAppleProviderReady,
    detail: 'OAuthProvider("apple.com") + redirect fallback + login button',
  },
  {
    label: "Firebase evidence targets the expected project",
    ok: firebase.firebaseProjectId === expected.firebaseProjectId,
    detail: firebase.firebaseProjectId ?? "missing",
  },
  {
    label: "Apple evidence targets the expected bundle ID",
    ok: apple.bundleId === expected.bundleId,
    detail: apple.bundleId ?? "missing",
  },
];

const gateValues = items.map((item) => {
  const gateValue = item.key.split(".").reduce((current, part) => {
    if (current && typeof current === "object" && part in current) return current[part];
    return undefined;
  }, submissionGate);
  return { key: item.key, gateValue };
});

console.log("# iOS Apple/Firebase Auth Evidence Report\n");
console.log("Evidence file: ios/AppleFirebaseAuthEvidence.json");
console.log(`Last updated: ${evidence.lastUpdated ?? "unknown"}`);
console.log(`Secret scan: ${secretLeak ? "FAIL" : "PASS"}`);
if (secretLeak) {
  console.log("Next: remove private keys, .p8 contents, API keys, or Firebase secrets before committing.");
}
console.log("");

console.log("## Source Checks");
for (const check of sourceChecks) {
  console.log(`- ${check.ok ? "PASS" : "TODO"} ${check.label} (${check.detail})`);
}
console.log("");

let currentGroup = "";
for (const item of items) {
  if (item.group !== currentGroup) {
    currentGroup = item.group;
    console.log(`## ${currentGroup}`);
  }
  console.log(`- ${item.ready && !secretLeak ? "PASS" : "TODO"} ${item.key}`);
  if (!item.ready) console.log(`  Next: ${item.next}`);
}
console.log("");

console.log("## Expected Values");
console.log(`Bundle ID: ${expected.bundleId}`);
console.log(`Firebase project: ${expected.firebaseProjectId}`);
console.log(`Primary Apple Service ID Return URL: ${expected.primaryReturnUrl}`);
console.log(`Secondary Firebase Auth handler: ${expected.secondaryAuthHandler}`);
console.log(`Authorized domains: ${expected.authorizedDomains.join(", ")}`);
console.log("");

console.log("## Submission Gate Alignment");
for (const { key, gateValue } of gateValues) {
  console.log(`- ${gateValue === true ? "PASS" : "TODO"} ${key} in ios/AppStoreSubmissionGate.json`);
}
console.log("");

const sourceReady = sourceChecks.every((check) => check.ok);
const readyCount = items.filter((item) => item.ready).length;
console.log(`Ready Apple/Firebase auth gates: ${secretLeak ? 0 : readyCount}/${items.length}`);
for (const item of items) {
  console.log(`- ${item.ready && !secretLeak ? "PASS" : "TODO"} ${item.key}`);
}
console.log("");

if (!secretLeak && sourceReady && readyCount === items.length) {
  console.log("All Apple/Firebase auth evidence is ready. You may set the matching appleDeveloper and firebaseAuth gates to true in ios/AppStoreSubmissionGate.json.");
} else {
  console.log("Do not set Apple/Firebase auth gates to true yet. Run npm run auth:ios:evidence:verify after Apple Developer and Firebase Console setup is complete.");
}

if (verify && (secretLeak || !sourceReady || readyCount !== items.length)) {
  console.error("\nApple/Firebase auth evidence verification failed.");
  process.exit(1);
}
