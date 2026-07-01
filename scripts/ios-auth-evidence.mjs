import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verify = process.argv.includes("--verify");
const evidencePath = join(root, "ios", "AppleFirebaseAuthEvidence.json");
const evidenceText = readFileSync(evidencePath, "utf8");
const evidence = JSON.parse(evidenceText);

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
  return /-----BEGIN [A-Z ]*PRIVATE KEY-----|\.p8\b|private[_-]?key\s*[:=]\s*["']?[A-Za-z0-9+/=]{20,}/i.test(raw);
}

const secretLeak = hasSecretLeak(evidenceText);
const apple = evidence.appleDeveloper ?? {};
const firebase = evidence.firebaseAuth ?? {};

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
    ready: firebase.appleProviderConfigured === true && text(firebase.confirmedAt) && text(firebase.confirmedBy),
    next: "Enable the Apple provider in Firebase Authentication and record Firebase confirmation evidence.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.appleServiceIdCreated",
    value: firebase.appleServiceIdCreated,
    ready:
      firebase.appleServiceIdCreated === true &&
      firebase.primaryReturnUrl === expected.primaryReturnUrl &&
      text(firebase.confirmedAt) &&
      text(firebase.confirmedBy),
    next: "Create the Apple Service ID and verify its Return URL is https://ucla-knee-mri.firebaseapp.com/__/auth/handler.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.applePrivateKeyConfigured",
    value: firebase.applePrivateKeyConfigured,
    ready: firebase.applePrivateKeyConfigured === true && text(firebase.confirmedAt) && text(firebase.confirmedBy),
    next: "Enter Team ID, Key ID, Service ID, and private key in Firebase Console only. Do not commit secrets.",
  },
  {
    group: "Firebase Auth",
    key: "firebaseAuth.redirectUrlVerifiedInAppleAndFirebase",
    value: firebase.redirectUrlVerifiedInAppleAndFirebase,
    ready:
      firebase.redirectUrlVerifiedInAppleAndFirebase === true &&
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
      includesAll(firebase.authorizedDomains, expected.authorizedDomains) &&
      text(firebase.confirmedAt) &&
      text(firebase.confirmedBy),
    next: "Confirm Firebase authorized domains include ucla-knee-mri.firebaseapp.com and ucla-knee-mri.web.app.",
  },
];

console.log("# iOS Apple/Firebase Auth Evidence Report\n");
console.log("Evidence file: ios/AppleFirebaseAuthEvidence.json");
console.log(`Last updated: ${evidence.lastUpdated ?? "unknown"}`);
console.log(`Secret scan: ${secretLeak ? "FAIL" : "PASS"}`);
if (secretLeak) {
  console.log("Next: remove private keys, .p8 contents, API keys, or Firebase secrets before committing.");
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

const readyCount = items.filter((item) => item.ready).length;
console.log(`Ready Apple/Firebase auth gates: ${secretLeak ? 0 : readyCount}/${items.length}`);
for (const item of items) {
  console.log(`- ${item.ready && !secretLeak ? "PASS" : "TODO"} ${item.key}`);
}
console.log("");

if (!secretLeak && readyCount === items.length) {
  console.log("All Apple/Firebase auth evidence is ready. You may set the matching appleDeveloper and firebaseAuth gates to true in ios/AppStoreSubmissionGate.json.");
} else {
  console.log("Do not set Apple/Firebase auth gates to true yet. Run npm run auth:ios:evidence:verify after Apple Developer and Firebase Console setup is complete.");
}

if (verify && (secretLeak || readyCount !== items.length)) {
  console.error("\nApple/Firebase auth evidence verification failed.");
  process.exit(1);
}
