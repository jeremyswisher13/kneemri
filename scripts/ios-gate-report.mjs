import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const gatePath = join(root, "ios", "AppStoreSubmissionGate.json");
const gate = JSON.parse(readFileSync(gatePath, "utf8"));

const groups = [
  {
    title: "Apple Developer",
    evidence: gate.appleDeveloper?.evidence,
    items: [
      {
        key: "appleDeveloper.signInWithAppleEnabledForBundleId",
        value: gate.appleDeveloper?.signInWithAppleEnabledForBundleId,
        next: "Enable Sign in with Apple on App ID com.jeremyswisher.uclasportsmri.",
      },
    ],
  },
  {
    title: "Firebase Auth",
    evidence: gate.firebaseAuth?.evidence,
    items: [
      {
        key: "firebaseAuth.appleProviderConfigured",
        value: gate.firebaseAuth?.appleProviderConfigured,
        next: "Enable the Apple provider in Firebase Authentication.",
      },
      {
        key: "firebaseAuth.appleServiceIdCreated",
        value: gate.firebaseAuth?.appleServiceIdCreated,
        next: "Create and enter the Apple Service ID using https://ucla-knee-mri.firebaseapp.com/__/auth/handler.",
      },
      {
        key: "firebaseAuth.applePrivateKeyConfigured",
        value: gate.firebaseAuth?.applePrivateKeyConfigured,
        next: "Enter the Apple Team ID, Key ID, and private key in Firebase's Apple provider config.",
      },
      {
        key: "firebaseAuth.redirectUrlVerifiedInAppleAndFirebase",
        value: gate.firebaseAuth?.redirectUrlVerifiedInAppleAndFirebase,
        next: "Verify Apple and Firebase both point to the same Firebase Auth callback URL.",
      },
      {
        key: "firebaseAuth.authorizedDomainsIncludeFirebaseHosting",
        value: gate.firebaseAuth?.authorizedDomainsIncludeFirebaseHosting,
        next: "Confirm Firebase authorized domains include ucla-knee-mri.firebaseapp.com and ucla-knee-mri.web.app.",
      },
    ],
  },
  {
    title: "Hosting",
    evidence: gate.hosting?.evidence,
    items: [
      {
        key: "hosting.currentBuildDeployed",
        value: gate.hosting?.currentBuildDeployed,
        next: "Deploy the current build with firebase deploy --only hosting.",
      },
      {
        key: "hosting.livePreflightPassed",
        value: gate.hosting?.livePreflightPassed,
        next: "Run npm run preflight:ios:live and keep the passing output.",
      },
    ],
  },
  {
    title: "Real Device / TestFlight Auth",
    evidence: gate.realDeviceAuth?.evidence,
    items: [
      {
        key: "realDeviceAuth.googleSignInPassedInNativeShell",
        value: gate.realDeviceAuth?.googleSignInPassedInNativeShell,
        next: "Verify Google sign-in inside the TestFlight/native shell on a real iPhone.",
      },
      {
        key: "realDeviceAuth.appleSignInPassedInNativeShell",
        value: gate.realDeviceAuth?.appleSignInPassedInNativeShell,
        next: "Verify Sign in with Apple inside the TestFlight/native shell on a real iPhone.",
      },
      {
        key: "realDeviceAuth.appReviewDemoPassedInNativeShell",
        value: gate.realDeviceAuth?.appReviewDemoPassedInNativeShell,
        next: "Verify Continue in App Review demo opens the curriculum in the TestFlight/native shell.",
      },
    ],
  },
  {
    title: "Account Deletion",
    evidence: gate.accountDeletion?.evidence,
    items: [
      {
        key: "accountDeletion.requestFlowVerified",
        value: gate.accountDeletion?.requestFlowVerified,
        next: "Submit a deletion request from /account as a signed-in test user.",
      },
      {
        key: "accountDeletion.adminDeletionProcessReady",
        value: gate.accountDeletion?.adminDeletionProcessReady,
        next: "Run npm run account:deletion -- --uid <firebase-uid> as a dry run, then confirm fulfillment for the test user.",
      },
    ],
  },
  {
    title: "Screenshots",
    evidence: gate.screenshots?.evidence,
    items: [
      {
        key: "screenshots.iphone69Captured",
        value: gate.screenshots?.iphone69Captured,
        next: "Capture the iPhone 6.9-inch set in ios/screenshots/iphone-6-9/.",
      },
      {
        key: "screenshots.ipad13Captured",
        value: gate.screenshots?.ipad13Captured,
        next: "Capture the iPad 13-inch set in ios/screenshots/ipad-13/.",
      },
      {
        key: "screenshots.screenshotsReviewedForNoPhi",
        value: gate.screenshots?.screenshotsReviewedForNoPhi,
        next: "Run npm run screenshots:ios:check and npm run screenshots:ios:evidence:verify after reviewing every screenshot for no PHI or real learner data.",
      },
    ],
  },
  {
    title: "App Store Connect",
    evidence: gate.appStoreConnect?.evidence,
    items: [
      {
        key: "appStoreConnect.appRecordCreated",
        value: gate.appStoreConnect?.appRecordCreated,
        next: "Create the App Store Connect app record for bundle ID com.jeremyswisher.uclasportsmri.",
      },
      {
        key: "appStoreConnect.metadataEntered",
        value: gate.appStoreConnect?.metadataEntered,
        next: "Enter the metadata from ios/AppStoreConnectMetadata.json.",
      },
      {
        key: "appStoreConnect.privacyLabelsEntered",
        value: gate.appStoreConnect?.privacyLabelsEntered,
        next: "Enter privacy labels matching ios/AppStoreSubmission.md.",
      },
      {
        key: "appStoreConnect.ageRatingCompleted",
        value: gate.appStoreConnect?.ageRatingCompleted,
        next: "Complete App Store Connect age rating, recommended 17+ for advanced medical education.",
      },
      {
        key: "appStoreConnect.exportComplianceCompleted",
        value: gate.appStoreConnect?.exportComplianceCompleted,
        next: "Complete export compliance using the app's non-exempt-encryption declaration.",
      },
      {
        key: "appStoreConnect.buildUploaded",
        value: gate.appStoreConnect?.buildUploaded,
        next: "Archive and upload the iOS build to App Store Connect/TestFlight.",
      },
      {
        key: "appStoreConnect.buildSelectedForVersion",
        value: gate.appStoreConnect?.buildSelectedForVersion,
        next: "Select the uploaded build for version 1.0.",
      },
      {
        key: "appStoreConnect.reviewNotesEntered",
        value: gate.appStoreConnect?.reviewNotesEntered,
        next: "Enter review notes including demo access and medical disclaimer.",
      },
      {
        key: "appStoreConnect.screenshotsUploaded",
        value: gate.appStoreConnect?.screenshotsUploaded,
        next: "Upload the verified iPhone and iPad screenshot sets.",
      },
    ],
  },
];

const requiredItems = groups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));
const verified = requiredItems.filter((item) => item.value === true);
const missing = requiredItems.filter((item) => item.value !== true);

console.log("# iOS App Store Gate Report\n");
console.log(`Gate file: ios/AppStoreSubmissionGate.json`);
console.log(`Last updated: ${gate.lastUpdated ?? "unknown"}`);
console.log(`Verified: ${verified.length}/${requiredItems.length}`);
console.log(`Missing: ${missing.length}/${requiredItems.length}`);
console.log(`Ready for App Review submission: ${missing.length === 0 ? "yes" : "no"}\n`);

for (const group of groups) {
  const groupMissing = group.items.filter((item) => item.value !== true);
  const groupVerified = group.items.length - groupMissing.length;
  const status = groupMissing.length === 0 ? "complete" : "needs evidence";
  console.log(`## ${group.title} (${groupVerified}/${group.items.length} ${status})`);
  if (group.evidence) console.log(`Evidence: ${group.evidence}`);
  for (const item of group.items) {
    const icon = item.value === true ? "PASS" : "TODO";
    console.log(`- ${icon} ${item.key}`);
    if (item.value !== true) console.log(`  Next: ${item.next}`);
  }
  console.log("");
}

if (missing.length > 0) {
  console.log("## Next Commands");
  console.log("- npm run preflight:ios");
  console.log("- npm run preflight:ios:live");
  console.log("- npm run preflight:ios:submit");
  console.log("- npm run archive:ios:signing");
  console.log("- npm run screenshots:ios:check");
  console.log("- npm run screenshots:ios:evidence");
  console.log("");
}

if (gate.appStoreConnect?.submittedForReview === true) {
  console.log("Final App Review submission flag is set.");
} else {
  console.log("Final App Review submission flag is still false. Set appStoreConnect.submittedForReview only after the actual App Review submission action is complete.");
}
