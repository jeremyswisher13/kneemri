import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readJson(...parts) {
  return JSON.parse(readFileSync(join(root, ...parts), "utf8"));
}

function valueForPath(source, dottedPath) {
  return dottedPath.split(".").reduce((current, part) => {
    if (current && typeof current === "object" && part in current) return current[part];
    return undefined;
  }, source);
}

function taskStatus(keys, gate) {
  const missing = keys.filter((key) => valueForPath(gate, key) !== true);
  return {
    missing,
    label: missing.length === 0 ? "PASS" : "TODO",
  };
}

function printGateList(keys, gate) {
  for (const key of keys) {
    const icon = valueForPath(gate, key) === true ? "PASS" : "TODO";
    console.log(`- ${icon} ${key}`);
  }
}

const gate = readJson("ios", "AppStoreSubmissionGate.json");
const metadata = readJson("ios", "AppStoreConnectMetadata.json");
const screenshotEvidence = readJson("ios", "ScreenshotEvidence.json");
const releaseEvidence = readJson("ios", "AppStoreReleaseEvidence.json");

const expected = {
  appleTeamId: "X578T4K65B",
  bundleId: "com.jeremyswisher.uclasportsmri",
  firebaseProjectId: "ucla-knee-mri",
  serviceId: "com.jeremyswisher.uclasportsmri.web",
  primaryReturnUrl: "https://ucla-knee-mri.firebaseapp.com/__/auth/handler",
  secondaryAuthHandler: "https://ucla-knee-mri.web.app/__/auth/handler",
  authorizedDomains: ["ucla-knee-mri.firebaseapp.com", "ucla-knee-mri.web.app"],
};

const authKeys = [
  "appleDeveloper.signInWithAppleEnabledForBundleId",
  "firebaseAuth.appleProviderConfigured",
  "firebaseAuth.appleServiceIdCreated",
  "firebaseAuth.applePrivateKeyConfigured",
  "firebaseAuth.redirectUrlVerifiedInAppleAndFirebase",
  "firebaseAuth.authorizedDomainsIncludeFirebaseHosting",
];
const archiveExportKeys = [
  "archiveExport.appStoreExportSigningReady",
  "archiveExport.appStoreConnectAccountAccessVerified",
];
const appStoreConnectKeys = [
  "appStoreConnect.appRecordCreated",
  "appStoreConnect.metadataEntered",
  "appStoreConnect.privacyLabelsEntered",
  "appStoreConnect.ageRatingCompleted",
  "appStoreConnect.regulatedMedicalDeviceStatusCompleted",
  "appStoreConnect.exportComplianceCompleted",
  "appStoreConnect.buildUploaded",
  "appStoreConnect.buildSelectedForVersion",
  "appStoreConnect.reviewNotesEntered",
  "appStoreConnect.screenshotsUploaded",
];
const realDeviceAndDeletionKeys = [
  "realDeviceAuth.googleSignInPassedInNativeShell",
  "realDeviceAuth.appleSignInPassedInNativeShell",
  "realDeviceAuth.appReviewDemoPassedInNativeShell",
  "accountDeletion.requestFlowVerified",
  "accountDeletion.adminDeletionProcessReady",
];

const gateGroups = [
  {
    title: "Apple Developer and Firebase Auth",
    evidenceFile: "ios/AppleFirebaseAuthEvidence.json",
    verifyCommand: "npm run auth:ios:evidence:verify",
    nextAction: `Enable Sign in with Apple for App ID ${expected.bundleId}, create Services ID ${expected.serviceId}, set Return URL ${expected.primaryReturnUrl}, configure Firebase project ${expected.firebaseProjectId} Apple provider, and confirm authorized domains ${expected.authorizedDomains.join(" plus ")}.`,
    keys: authKeys,
  },
  {
    title: "Archive Export and TestFlight Upload Access",
    evidenceFile: "ios/AppStoreSubmissionGate.json",
    verifyCommand: "npm run archive:ios:signing && npm run export:ios",
    nextAction: `Create/download an App Store distribution provisioning profile for ${expected.bundleId} on Team ${expected.appleTeamId}, then confirm Xcode has App Store Connect upload access for that team.`,
    keys: archiveExportKeys,
  },
  {
    title: "App Store Connect Entry",
    evidenceFile: "ios/AppStoreConnectEvidence.json",
    verifyCommand: "npm run asc:ios:evidence:verify",
    nextAction: `Create the App Store Connect app record for ${expected.bundleId}, paste the metadata from ios/AppStoreConnectMetadata.json, upload the verified screenshots, complete privacy/age-rating/regulated-device/export-compliance fields, upload build ${metadata.version} (${metadata.build}), and select it for version ${metadata.version}.`,
    keys: appStoreConnectKeys,
  },
  {
    title: "Real-Device and Account Deletion Verification",
    evidenceFile: "ios/ReleaseVerificationEvidence.json",
    verifyCommand: "npm run release:ios:evidence:verify",
    nextAction: "After TestFlight/native install, verify Google sign-in, Sign in with Apple, App Review demo mode, and the full account-deletion request plus admin dry-run/fulfillment path with non-identifying test evidence.",
    keys: realDeviceAndDeletionKeys,
  },
];

const requiredKeys = [
  ...authKeys,
  "hosting.currentBuildDeployed",
  "hosting.livePreflightPassed",
  ...archiveExportKeys,
  ...realDeviceAndDeletionKeys,
  "screenshots.iphone69Captured",
  "screenshots.ipad13Captured",
  "screenshots.screenshotsReviewedForNoPhi",
  ...appStoreConnectKeys,
];
const verifiedCount = requiredKeys.filter((key) => valueForPath(gate, key) === true).length;
const missingCount = requiredKeys.length - verifiedCount;
const submissionReady = missingCount === 0;
const releaseReady =
  releaseEvidence.submission?.submittedForReview === true &&
  releaseEvidence.review?.approvedForRelease === true &&
  releaseEvidence.availability?.publicStorePageVerified === true;

console.log("# iOS App Store Submission Packet\n");
console.log(`Generated from: ios/AppStoreSubmissionGate.json (${gate.lastUpdated ?? "unknown"})`);
console.log(`Submission gate: ${verifiedCount}/${requiredKeys.length} verified, ${missingCount} missing`);
console.log(`Ready for App Review submission: ${submissionReady ? "yes" : "no"}`);
console.log(`Public App Store release evidence complete: ${releaseReady ? "yes" : "no"}`);
console.log("");

console.log("## Locked Portal Values");
console.log(`App name: ${metadata.name}`);
console.log(`Subtitle: ${metadata.subtitle}`);
console.log(`Bundle ID: ${expected.bundleId}`);
console.log(`SKU: ${metadata.sku}`);
console.log(`Version/build: ${metadata.version} (${metadata.build})`);
console.log(`Apple Team ID: ${expected.appleTeamId}`);
console.log(`Firebase project: ${expected.firebaseProjectId}`);
console.log(`Apple Services ID: ${expected.serviceId}`);
console.log(`Apple Service ID Return URL: ${expected.primaryReturnUrl}`);
console.log(`Secondary Firebase auth handler: ${expected.secondaryAuthHandler}`);
console.log(`Firebase authorized domains: ${expected.authorizedDomains.join(", ")}`);
console.log(`Privacy Policy URL: ${metadata.privacyPolicyUrl}`);
console.log(`Support URL: ${metadata.supportUrl}`);
console.log(`Accessibility URL: ${metadata.accessibilityUrl}`);
console.log("");

console.log("## Ordered Portal Tasks");
console.log("Update evidence JSON only after the matching Apple/Firebase/App Store Connect screen or real-device test is actually verified.");
console.log("Do not commit Apple private keys, .p8 files, App Store Connect API keys, app-specific passwords, Firebase service accounts, full UIDs, test-user emails, PHI, or real learner data.");
console.log("");

for (const [index, group] of gateGroups.entries()) {
  const status = taskStatus(group.keys, gate);
  console.log(`${index + 1}. ${group.title}`);
  console.log(`Status: ${status.label}`);
  console.log(`Evidence file: ${group.evidenceFile}`);
  console.log(`Verify with: ${group.verifyCommand}`);
  if (status.label !== "PASS") console.log(`Next action: ${group.nextAction}`);
  printGateList(group.keys, gate);
  console.log("");
}

console.log("## App Store Connect Copy Values");
console.log(`Primary language: ${metadata.primaryLanguage}`);
console.log("User access: Full Access");
console.log(`Primary category: ${metadata.primaryCategory}`);
console.log(`Secondary category: ${metadata.secondaryCategory}`);
console.log(`Price: ${metadata.price}`);
console.log(`Age rating recommendation: ${metadata.ageRatingRecommendation}`);
console.log(`Age rating basis: ${metadata.ageRatingBasis?.appleAnswer ?? "medical education"}`);
console.log(`Regulated medical device: ${metadata.regulatedMedicalDevice?.answer ?? "No"}`);
console.log(`Keywords: ${Array.isArray(metadata.keywords) ? metadata.keywords.join(", ") : ""}`);
console.log("Description source: ios/AppStoreConnectMetadata.json#description");
console.log("Promotional text source: ios/AppStoreConnectMetadata.json#promotionalText");
console.log("Review notes source: ios/AppStoreConnectMetadata.json#reviewNotes");
console.log("");

console.log("## Screenshot Upload Packet");
console.log("Upload only the listed PNG files to the matching App Store Connect device-size screenshot sets.");
console.log(`iPhone 6.9-inch folder: ios/screenshots/iphone-6-9`);
for (const file of screenshotEvidence.iphone69?.files ?? []) {
  console.log(`- ios/screenshots/iphone-6-9/${file}`);
}
console.log(`iPad 13-inch folder: ios/screenshots/ipad-13`);
for (const file of screenshotEvidence.ipad13?.files ?? []) {
  console.log(`- ios/screenshots/ipad-13/${file}`);
}
console.log(`No-PHI review: ${screenshotEvidence.phiReview?.noPhiConfirmed === true ? "PASS" : "TODO"}`);
console.log("");

console.log("## Final Commands");
console.log("Final release evidence file: ios/AppStoreReleaseEvidence.json");
console.log("- npm run preflight:ios:report");
console.log("- npm run evidence:ios");
console.log("- npm run preflight:ios:submit");
console.log("- npm run store:ios:evidence:verify");
console.log("");

if (!submissionReady) {
  console.log("Next: complete the TODO portal tasks above, update only the matching evidence files/gates, then rerun npm run submit:ios:packet.");
} else if (!releaseReady) {
  console.log("Next: submit version 1.0 (1), wait for App Review approval and public App Store availability, update ios/AppStoreReleaseEvidence.json, then rerun npm run store:ios:evidence:verify.");
} else {
  console.log("All submission and public App Store release evidence is complete.");
}
