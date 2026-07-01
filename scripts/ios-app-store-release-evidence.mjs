import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verify = process.argv.includes("--verify");
const evidencePath = join(root, "ios", "AppStoreReleaseEvidence.json");
const evidenceText = readFileSync(evidencePath, "utf8");
const evidence = JSON.parse(evidenceText);

const expected = {
  version: "1.0",
  build: "1",
};

const approvedStatuses = ["Approved", "Ready for Distribution", "Ready for Sale"];

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function appStoreUrl(value) {
  if (!text(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ["apps.apple.com", "itunes.apple.com"].includes(url.hostname);
  } catch {
    return false;
  }
}

function hasSecretOrPersonalData(raw) {
  return /-----BEGIN [A-Z ]*PRIVATE KEY-----|\.p8\b|(?:api[_-]?key|issuer[_-]?id|password|app[_-]?specific[_-]?password|client[_-]?secret)\s*[:=]\s*["']?[^"',\s]{12,}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(
    raw,
  );
}

const submission = evidence.submission ?? {};
const review = evidence.review ?? {};
const availability = evidence.availability ?? {};
const secretOrPersonalData = hasSecretOrPersonalData(evidenceText);

const items = [
  {
    group: "App Review Submission",
    key: "appStoreRelease.submittedForReview",
    ready:
      submission.submittedForReview === true &&
      submission.version === expected.version &&
      submission.build === expected.build &&
      text(submission.submittedAt) &&
      text(submission.confirmedBy),
    next: "Submit version 1.0 (1) for App Review in App Store Connect, then record submittedAt and confirmedBy without storing Apple credentials.",
  },
  {
    group: "App Review Decision",
    key: "appStoreRelease.approvedForRelease",
    ready:
      review.approvedForRelease === true &&
      approvedStatuses.includes(review.status) &&
      text(review.approvedAt) &&
      text(review.confirmedBy),
    next: "Wait for App Review approval or Ready for Distribution/Ready for Sale status, then record the status, approvedAt, and confirmedBy.",
  },
  {
    group: "Public App Store Availability",
    key: "appStoreRelease.publicStorePageVerified",
    ready:
      availability.releasedToAppStore === true &&
      availability.publicStorePageVerified === true &&
      appStoreUrl(availability.appStoreUrl) &&
      availability.version === expected.version &&
      text(availability.checkedAt) &&
      text(availability.confirmedBy),
    next: "After release, open the public apps.apple.com listing, confirm version 1.0 is visible, then record the public App Store URL, checkedAt, and confirmedBy.",
  },
];

const readyCount = items.filter((item) => item.ready && !secretOrPersonalData).length;

console.log("# iOS App Store Release Evidence Report\n");
console.log("Evidence file: ios/AppStoreReleaseEvidence.json");
console.log(`Last updated: ${evidence.lastUpdated ?? "unknown"}`);
console.log(`Secret/PII scan: ${secretOrPersonalData ? "FAIL" : "PASS"}`);
if (secretOrPersonalData) {
  console.log("Next: remove Apple credentials, API keys, reviewer personal data, email addresses, or real learner data before committing.");
}
console.log("");

let currentGroup = "";
for (const item of items) {
  if (item.group !== currentGroup) {
    currentGroup = item.group;
    console.log(`## ${currentGroup}`);
  }
  console.log(`- ${item.ready && !secretOrPersonalData ? "PASS" : "TODO"} ${item.key}`);
  if (!item.ready) console.log(`  Next: ${item.next}`);
}
console.log("");

console.log("## Expected Final Evidence");
console.log(`Version/build: ${expected.version} (${expected.build})`);
console.log("Public listing host: apps.apple.com or itunes.apple.com");
console.log("Approved statuses accepted: Approved, Ready for Distribution, Ready for Sale");
console.log("");

console.log(`Ready App Store release gates: ${secretOrPersonalData ? 0 : readyCount}/${items.length}`);
for (const item of items) {
  console.log(`- ${item.ready && !secretOrPersonalData ? "PASS" : "TODO"} ${item.key}`);
}
console.log("");

if (!secretOrPersonalData && readyCount === items.length) {
  console.log("All App Store release evidence is ready. The app is recorded as submitted, approved, and publicly available on the App Store.");
} else {
  console.log("Do not mark the overall App Store goal complete yet. Run npm run store:ios:evidence:verify only after App Review approval and public App Store availability are confirmed.");
}

if (verify && (secretOrPersonalData || readyCount !== items.length)) {
  console.error("\nApp Store release evidence verification failed.");
  process.exit(1);
}
