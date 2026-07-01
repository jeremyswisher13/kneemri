import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const gatePath = join(root, "ios", "AppStoreSubmissionGate.json");
const gate = JSON.parse(readFileSync(gatePath, "utf8"));

const required = [
  ["appleDeveloper.signInWithAppleEnabledForBundleId", gate.appleDeveloper?.signInWithAppleEnabledForBundleId],
  ["firebaseAuth.appleProviderConfigured", gate.firebaseAuth?.appleProviderConfigured],
  ["firebaseAuth.appleServiceIdCreated", gate.firebaseAuth?.appleServiceIdCreated],
  ["firebaseAuth.applePrivateKeyConfigured", gate.firebaseAuth?.applePrivateKeyConfigured],
  ["firebaseAuth.redirectUrlVerifiedInAppleAndFirebase", gate.firebaseAuth?.redirectUrlVerifiedInAppleAndFirebase],
  ["firebaseAuth.authorizedDomainsIncludeFirebaseHosting", gate.firebaseAuth?.authorizedDomainsIncludeFirebaseHosting],
  ["hosting.currentBuildDeployed", gate.hosting?.currentBuildDeployed],
  ["hosting.livePreflightPassed", gate.hosting?.livePreflightPassed],
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

console.log(`\n${required.length} App Store submission gate items passed. The app is ready to submit for App Review.`);
