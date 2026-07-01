import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verify = process.argv.includes("--verify");
const evidencePath = join(root, "ios", "ReleaseVerificationEvidence.json");
const evidenceText = readFileSync(evidencePath, "utf8");
const evidence = JSON.parse(evidenceText);

const expected = {
  version: "1.0",
  build: "1",
  acceptedSources: ["TestFlight/native iOS app", "Real device Debug native iOS app"],
};

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasSecretOrPersonalData(raw) {
  return /-----BEGIN [A-Z ]*PRIVATE KEY-----|\.p8\b|GOOGLE_APPLICATION_CREDENTIALS\s*[:=]\s*["']?[^"',\s]{4,}|service[_-]?account\s*[:=]\s*["']?[^"',\s]{12,}|(?:api[_-]?key|password|private[_-]?key|client[_-]?secret)\s*[:=]\s*["']?[^"',\s]{12,}|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(
    raw,
  );
}

function environmentReady(env) {
  return (
    expected.acceptedSources.includes(env.source) &&
    env.version === expected.version &&
    env.build === expected.build &&
    text(env.device) &&
    text(env.iosVersion) &&
    text(env.testedAt) &&
    text(env.confirmedBy)
  );
}

const env = evidence.testEnvironment ?? {};
const realDeviceAuth = evidence.realDeviceAuth ?? {};
const accountDeletion = evidence.accountDeletion ?? {};
const secretOrPersonalData = hasSecretOrPersonalData(evidenceText);
const envReady = environmentReady(env);

const items = [
  {
    group: "Real Device / TestFlight Auth",
    key: "realDeviceAuth.googleSignInPassedInNativeShell",
    value: realDeviceAuth.googleSignInPassedInNativeShell,
    ready:
      envReady &&
      realDeviceAuth.googleSignInPassedInNativeShell === true &&
      text(realDeviceAuth.googleSignInNote) &&
      text(realDeviceAuth.confirmedAt) &&
      text(realDeviceAuth.confirmedBy),
    next: "Install the 1.0 (1) native build on a real iPhone or TestFlight, complete Google sign-in inside the app shell, and record a non-PII note.",
  },
  {
    group: "Real Device / TestFlight Auth",
    key: "realDeviceAuth.appleSignInPassedInNativeShell",
    value: realDeviceAuth.appleSignInPassedInNativeShell,
    ready:
      envReady &&
      realDeviceAuth.appleSignInPassedInNativeShell === true &&
      text(realDeviceAuth.appleSignInNote) &&
      text(realDeviceAuth.confirmedAt) &&
      text(realDeviceAuth.confirmedBy),
    next: "Complete Sign in with Apple inside the 1.0 (1) native shell and record a non-PII note.",
  },
  {
    group: "Real Device / TestFlight Auth",
    key: "realDeviceAuth.appReviewDemoPassedInNativeShell",
    value: realDeviceAuth.appReviewDemoPassedInNativeShell,
    ready:
      envReady &&
      realDeviceAuth.appReviewDemoPassedInNativeShell === true &&
      text(realDeviceAuth.appReviewDemoNote) &&
      text(realDeviceAuth.confirmedAt) &&
      text(realDeviceAuth.confirmedBy),
    next: "Verify Continue in App Review demo opens the curriculum in the native shell without a live fellow account.",
  },
  {
    group: "Account Deletion",
    key: "accountDeletion.requestFlowVerified",
    value: accountDeletion.requestFlowVerified,
    ready:
      envReady &&
      accountDeletion.requestFlowVerified === true &&
      accountDeletion.confirmationNoticeVerified === true &&
      accountDeletion.requestDocumentObserved === true &&
      accountDeletion.statusRequestedObserved === true &&
      accountDeletion.sourceInAppObserved === true &&
      text(accountDeletion.testUserReference) &&
      text(accountDeletion.requestedAt) &&
      text(accountDeletion.confirmedBy),
    next: "Submit /account > Request deletion from a signed-in test user, verify the login confirmation notice, and confirm the Firestore request has status=requested and source=in-app.",
  },
  {
    group: "Account Deletion",
    key: "accountDeletion.adminDeletionProcessReady",
    value: accountDeletion.adminDeletionProcessReady,
    ready:
      accountDeletion.adminDeletionProcessReady === true &&
      accountDeletion.adminDryRunCompleted === true &&
      accountDeletion.adminFulfillmentConfirmed === true &&
      accountDeletion.authUserDeletedConfirmed === true &&
      accountDeletion.firestoreUserTreeRemovedConfirmed === true &&
      accountDeletion.auditLogsDeidentifiedConfirmed === true &&
      accountDeletion.fulfilledRequestRecordScrubbed === true &&
      text(accountDeletion.testUserReference) &&
      text(accountDeletion.fulfilledAt) &&
      text(accountDeletion.confirmedBy),
    next: "Run npm run account:deletion -- --uid <test-uid> first as a dry run, then with --confirm, and verify auth deletion, user-tree removal, audit-log de-identification, and scrubbed fulfilled request evidence.",
  },
];

const readyCount = items.filter((item) => item.ready && !secretOrPersonalData).length;

console.log("# iOS Real Device and Account Deletion Evidence Report\n");
console.log("Evidence file: ios/ReleaseVerificationEvidence.json");
console.log(`Last updated: ${evidence.lastUpdated ?? "unknown"}`);
console.log(`Secret/PII scan: ${secretOrPersonalData ? "FAIL" : "PASS"}`);
if (secretOrPersonalData) {
  console.log("Next: remove credentials, service-account paths, test-user emails, full UIDs, PHI, or real learner data before committing.");
}
console.log("");

console.log("## Test Environment");
console.log(`Status: ${envReady ? "PASS" : "TODO"}`);
console.log(`Source: ${env.source || "missing"}`);
console.log(`Version/build: ${env.version || "missing"} (${env.build || "missing"})`);
console.log(`Device: ${env.device || "missing"}`);
console.log(`iOS version: ${env.iosVersion || "missing"}`);
console.log(`Tested at: ${env.testedAt || "missing"}`);
console.log(`Confirmed by: ${env.confirmedBy || "missing"}`);
if (!envReady) {
  console.log(`Next: record a ${expected.version} (${expected.build}) TestFlight/native or real-device Debug environment before setting release gates true.`);
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

console.log("## Required Non-PII Evidence");
console.log("- Real-device or TestFlight source, device model, iOS version, app version/build, timestamp, and reviewer initials/role.");
console.log("- Google sign-in result in the native shell without storing a real email address.");
console.log("- Sign in with Apple result in the native shell without storing Apple credentials or personal identifiers.");
console.log("- App Review demo result confirming course access without a live fellow account.");
console.log("- Account deletion request and fulfillment confirmations using a non-identifying test user reference.");
console.log("");

console.log(`Ready real-device/account-deletion gates: ${secretOrPersonalData ? 0 : readyCount}/${items.length}`);
for (const item of items) {
  console.log(`- ${item.ready && !secretOrPersonalData ? "PASS" : "TODO"} ${item.key}`);
}
console.log("");

if (!secretOrPersonalData && readyCount === items.length) {
  console.log("All real-device and account-deletion evidence is ready. You may set the matching realDeviceAuth and accountDeletion gates to true in ios/AppStoreSubmissionGate.json.");
} else {
  console.log("Do not set realDeviceAuth or accountDeletion gates to true yet. Run npm run release:ios:evidence:verify after real-device/TestFlight and account-deletion checks are complete.");
}

if (verify && (secretOrPersonalData || readyCount !== items.length)) {
  console.error("\nReal-device/account-deletion evidence verification failed.");
  process.exit(1);
}
