import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const gatePath = join(root, "ios", "AppStoreSubmissionGate.json");
const gate = JSON.parse(readFileSync(gatePath, "utf8"));

const evidenceChecks = [
  {
    label: "Archive/export signing",
    args: "scripts/ios-archive.mjs --signing".split(" "),
    requiredPattern: /^App Store export signing ready: yes$/m,
    failureMessage: "Archive/export signing evidence is not ready. Run npm run archive:ios:signing and npm run export:ios after installing the App Store distribution profile.",
  },
  {
    label: "Apple/Firebase auth evidence",
    args: "scripts/ios-auth-evidence.mjs --verify".split(" "),
  },
  {
    label: "Real-device/account-deletion evidence",
    args: "scripts/ios-release-evidence.mjs --verify".split(" "),
  },
  {
    label: "Screenshot evidence",
    args: "scripts/ios-screenshot-evidence.mjs --verify".split(" "),
  },
  {
    label: "App Store Connect evidence",
    args: "scripts/ios-app-store-connect-evidence.mjs --verify".split(" "),
  },
];

const required = [
  ["appleDeveloper.signInWithAppleEnabledForBundleId", gate.appleDeveloper?.signInWithAppleEnabledForBundleId],
  ["firebaseAuth.appleProviderConfigured", gate.firebaseAuth?.appleProviderConfigured],
  ["firebaseAuth.appleServiceIdCreated", gate.firebaseAuth?.appleServiceIdCreated],
  ["firebaseAuth.applePrivateKeyConfigured", gate.firebaseAuth?.applePrivateKeyConfigured],
  ["firebaseAuth.redirectUrlVerifiedInAppleAndFirebase", gate.firebaseAuth?.redirectUrlVerifiedInAppleAndFirebase],
  ["firebaseAuth.authorizedDomainsIncludeFirebaseHosting", gate.firebaseAuth?.authorizedDomainsIncludeFirebaseHosting],
  ["hosting.currentBuildDeployed", gate.hosting?.currentBuildDeployed],
  ["hosting.livePreflightPassed", gate.hosting?.livePreflightPassed],
  ["archiveExport.appStoreExportSigningReady", gate.archiveExport?.appStoreExportSigningReady],
  ["archiveExport.appStoreConnectAccountAccessVerified", gate.archiveExport?.appStoreConnectAccountAccessVerified],
  ["realDeviceAuth.googleSignInPassedInNativeShell", gate.realDeviceAuth?.googleSignInPassedInNativeShell],
  ["realDeviceAuth.appleSignInPassedInNativeShell", gate.realDeviceAuth?.appleSignInPassedInNativeShell],
  ["realDeviceAuth.appReviewDemoPassedInNativeShell", gate.realDeviceAuth?.appReviewDemoPassedInNativeShell],
  ["accountDeletion.requestFlowVerified", gate.accountDeletion?.requestFlowVerified],
  ["accountDeletion.adminDeletionProcessReady", gate.accountDeletion?.adminDeletionProcessReady],
  ["screenshots.iphone69Captured", gate.screenshots?.iphone69Captured],
  ["screenshots.ipad13Captured", gate.screenshots?.ipad13Captured],
  ["screenshots.screenshotsReviewedForNoPhi", gate.screenshots?.screenshotsReviewedForNoPhi],
  ["appStoreConnect.appRecordCreated", gate.appStoreConnect?.appRecordCreated],
  ["appStoreConnect.metadataEntered", gate.appStoreConnect?.metadataEntered],
  ["appStoreConnect.privacyLabelsEntered", gate.appStoreConnect?.privacyLabelsEntered],
  ["appStoreConnect.ageRatingCompleted", gate.appStoreConnect?.ageRatingCompleted],
  ["appStoreConnect.regulatedMedicalDeviceStatusCompleted", gate.appStoreConnect?.regulatedMedicalDeviceStatusCompleted],
  ["appStoreConnect.exportComplianceCompleted", gate.appStoreConnect?.exportComplianceCompleted],
  ["appStoreConnect.buildUploaded", gate.appStoreConnect?.buildUploaded],
  ["appStoreConnect.buildSelectedForVersion", gate.appStoreConnect?.buildSelectedForVersion],
  ["appStoreConnect.reviewNotesEntered", gate.appStoreConnect?.reviewNotesEntered],
  ["appStoreConnect.screenshotsUploaded", gate.appStoreConnect?.screenshotsUploaded],
];

const failures = required.filter(([, value]) => value !== true);
for (const [key, value] of required) {
  const icon = value === true ? "PASS" : "FAIL";
  console.log(`${icon} ${key}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} App Store submission gate item(s) are not verified.`);
  console.error("Update ios/AppStoreSubmissionGate.json only after the matching external evidence exists.");
  process.exit(1);
}

console.log("\nDetailed evidence verification:");
const evidenceFailures = [];
for (const check of evidenceChecks) {
  console.log(`\n## ${check.label}`);
  const result = spawnSync(process.execPath, check.args, {
    cwd: root,
    encoding: "utf8",
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.error) {
    evidenceFailures.push(`${check.label}: ${result.error.message}`);
    continue;
  }
  if (result.status !== 0) {
    evidenceFailures.push(`${check.label}: verifier exited with ${result.status ?? 1}`);
    continue;
  }
  if (check.requiredPattern && !check.requiredPattern.test(output)) {
    evidenceFailures.push(`${check.label}: ${check.failureMessage}`);
  }
}

if (evidenceFailures.length > 0) {
  console.error("\nDetailed evidence verification failed:");
  for (const failure of evidenceFailures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`\n${required.length} App Store submission gate items passed. The app is ready to submit for App Review.`);
