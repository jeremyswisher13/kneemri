import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const checks = [];

function path(...parts) {
  return join(root, ...parts);
}

function readText(...parts) {
  return readFileSync(path(...parts), "utf8");
}

function pass(label, detail = "") {
  checks.push({ ok: true, label, detail });
}

function fail(label, detail = "") {
  checks.push({ ok: false, label, detail });
}

function assertFile(label, ...parts) {
  const file = path(...parts);
  if (existsSync(file) && statSync(file).isFile()) {
    pass(label, parts.join("/"));
    return true;
  }
  fail(label, `${parts.join("/")} is missing`);
  return false;
}

function assertIncludes(label, text, needle) {
  if (text.includes(needle)) {
    pass(label, needle);
  } else {
    fail(label, `Missing ${needle}`);
  }
}

function pngSize(file) {
  const data = readFileSync(file);
  if (data.length < 24 || data.toString("ascii", 1, 4) !== "PNG") {
    throw new Error("Not a PNG file");
  }
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

assertFile("Xcode project exists", "ios", "UCLASportsMRI.xcodeproj", "project.pbxproj");
assertFile("XcodeGen spec exists", "ios", "project.yml");
assertFile("Info.plist exists", "ios", "UCLASportsMRI", "Info.plist");
assertFile("Privacy manifest exists", "ios", "UCLASportsMRI", "PrivacyInfo.xcprivacy");
assertFile("Entitlements exist", "ios", "UCLASportsMRI", "UCLASportsMRI.entitlements");
assertFile("Native shell exists", "ios", "UCLASportsMRI", "WebShellView.swift");
assertFile("Export options template exists", "ios", "ExportOptions.plist");
assertFile("App Store export readiness checklist exists", "ios", "AppStoreExportReadiness.md");
assertFile("App Store handoff exists", "ios", "AppStoreSubmission.md");
assertFile("App Store metadata JSON exists", "ios", "AppStoreConnectMetadata.json");
assertFile("App Store Connect evidence JSON exists", "ios", "AppStoreConnectEvidence.json");
assertFile("App Store release evidence JSON exists", "ios", "AppStoreReleaseEvidence.json");
assertFile("Screenshot plan exists", "ios", "ScreenshotPlan.md");
assertFile("Screenshot evidence JSON exists", "ios", "ScreenshotEvidence.json");
assertFile("Apple/Firebase auth setup doc exists", "ios", "AppleFirebaseAuthSetup.md");
assertFile("Apple/Firebase auth evidence JSON exists", "ios", "AppleFirebaseAuthEvidence.json");
assertFile("Release verification evidence JSON exists", "ios", "ReleaseVerificationEvidence.json");
assertFile("Submission gate file exists", "ios", "AppStoreSubmissionGate.json");
assertFile("iOS README exists", "ios", "README.md");
assertFile("Live readiness script exists", "scripts", "ios-live-readiness.mjs");
assertFile("Submission gate script exists", "scripts", "ios-submission-gate.mjs");
assertFile("Submission gate report script exists", "scripts", "ios-gate-report.mjs");
assertFile("Evidence audit script exists", "scripts", "ios-evidence-audit.mjs");
assertFile("Archive helper script exists", "scripts", "ios-archive.mjs");
assertFile("Apple/Firebase auth evidence script exists", "scripts", "ios-auth-evidence.mjs");
assertFile("App Store Connect evidence script exists", "scripts", "ios-app-store-connect-evidence.mjs");
assertFile("App Store release evidence script exists", "scripts", "ios-app-store-release-evidence.mjs");
assertFile("Release evidence script exists", "scripts", "ios-release-evidence.mjs");
assertFile("Account deletion processor exists", "scripts", "process-account-deletion.mjs");
assertFile("Screenshot checker exists", "scripts", "ios-screenshot-check.mjs");
assertFile("Screenshot evidence script exists", "scripts", "ios-screenshot-evidence.mjs");
assertFile("Screenshot capture script exists", "scripts", "ios-capture-screenshots.mjs");

const project = readText("ios", "project.yml");
assertIncludes("Bundle ID configured", project, "PRODUCT_BUNDLE_IDENTIFIER: com.jeremyswisher.uclasportsmri");
assertIncludes("iPhone and iPad enabled", project, 'TARGETED_DEVICE_FAMILY: "1,2"');
assertIncludes("App icon catalog configured", project, "ASSETCATALOG_COMPILER_APPICON_NAME: AppIcon");
assertIncludes("Sign in with Apple entitlement wired", project, "CODE_SIGN_ENTITLEMENTS");
assertIncludes("Apple Developer Team pinned in XcodeGen spec", project, "DEVELOPMENT_TEAM: X578T4K65B");

const info = readText("ios", "UCLASportsMRI", "Info.plist");
assertIncludes("Display name configured", info, "<string>UCLA Sports MRI</string>");
assertIncludes("Encryption export declaration present", info, "<key>ITSAppUsesNonExemptEncryption</key>");
assertIncludes("Launch color configured", info, "<string>LaunchBackground</string>");
assertIncludes("iPad orientations configured", info, "<key>UISupportedInterfaceOrientations~ipad</key>");

const entitlements = readText("ios", "UCLASportsMRI", "UCLASportsMRI.entitlements");
assertIncludes("Sign in with Apple entitlement present", entitlements, "com.apple.developer.applesignin");

const privacy = readText("ios", "UCLASportsMRI", "PrivacyInfo.xcprivacy");
assertIncludes("Privacy manifest says no tracking", privacy, "<key>NSPrivacyTracking</key>");
assertIncludes("Name privacy label present", privacy, "NSPrivacyCollectedDataTypeName");
assertIncludes("Email privacy label present", privacy, "NSPrivacyCollectedDataTypeEmailAddress");
assertIncludes("User ID privacy label present", privacy, "NSPrivacyCollectedDataTypeUserID");
assertIncludes("Product interaction privacy label present", privacy, "NSPrivacyCollectedDataTypeProductInteraction");
assertIncludes("Privacy purpose is app functionality", privacy, "NSPrivacyCollectedDataTypePurposeAppFunctionality");

const webShell = readText("ios", "UCLASportsMRI", "WebShellView.swift");
assertIncludes("Native shell loads Firebase app", webShell, "https://ucla-knee-mri.firebaseapp.com");
assertIncludes("Native shell marks iOS source", webShell, 'setQueryItem(name: "source", value: "ios-app"');
assertIncludes("Reviewer demo launch flag present", webShell, 'setQueryItem(name: "reviewerDemo", value: "1"');
assertIncludes("Native shell supports screenshot route launch args", webShell, "--ucla-sports-mri-path");
assertIncludes("Native shell supports screenshot demo bootstrap", webShell, "--ucla-sports-mri-screenshot-demo");
assertIncludes("Native shell supports screenshot MRI focus", webShell, "screenshotFocus");
assertIncludes("TestFlight sandbox receipt path handled", webShell, "sandboxReceipt");
assertIncludes("Apple auth host allowed", webShell, "appleid.apple.com");
assertIncludes("External links open outside shell", webShell, "UIApplication.shared.open(url)");
assertIncludes("Native load retry increments reload token", webShell, "self.reloadToken += 1");
assertIncludes("Native web view observes reload token", webShell, "context.coordinator.reloadToken != reloadToken");
assertIncludes("Native retry reloads initial URL", webShell, "loadInitialURL(in: webView, url: url)");
assertIncludes("Native shell avoids stale cached app loads", webShell, ".reloadIgnoringLocalCacheData");

const appStoreSubmission = readText("ios", "AppStoreSubmission.md");
assertIncludes("Privacy URL documented", appStoreSubmission, "https://ucla-knee-mri.firebaseapp.com/privacy");
assertIncludes("Support URL documented", appStoreSubmission, "https://ucla-knee-mri.firebaseapp.com/support");
assertIncludes("Reviewer demo documented", appStoreSubmission, "Continue in App Review demo");
assertIncludes("Metadata JSON documented", appStoreSubmission, "ios/AppStoreConnectMetadata.json");
assertIncludes("Screenshot plan documented", appStoreSubmission, "ios/ScreenshotPlan.md");
assertIncludes("Screenshot checker documented", appStoreSubmission, "npm run screenshots:ios:check");
assertIncludes("Screenshot evidence documented", appStoreSubmission, "npm run screenshots:ios:evidence:verify");
assertIncludes("Screenshot capture documented", appStoreSubmission, "npm run screenshots:ios:capture");
assertIncludes("Apple/Firebase auth evidence documented", appStoreSubmission, "npm run auth:ios:evidence:verify");
assertIncludes("App Store Connect evidence documented", appStoreSubmission, "npm run asc:ios:evidence:verify");
assertIncludes("App Store release evidence documented", appStoreSubmission, "npm run store:ios:evidence:verify");
assertIncludes("Release evidence documented", appStoreSubmission, "npm run release:ios:evidence:verify");
assertIncludes("Live readiness documented", appStoreSubmission, "npm run preflight:ios:live");
assertIncludes("Apple callback URL documented", appStoreSubmission, "https://ucla-knee-mri.firebaseapp.com/__/auth/handler");
assertIncludes("Gate report documented", appStoreSubmission, "npm run preflight:ios:report");
assertIncludes("Submission gate documented", appStoreSubmission, "npm run preflight:ios:submit");
assertIncludes("Submission gate evidence verifier behavior documented", appStoreSubmission, "runs the detailed evidence verifiers");
assertIncludes("Submission gate archive-signing behavior documented", appStoreSubmission, "App Store export signing ready: yes");
assertIncludes("Evidence audit documented", appStoreSubmission, "npm run evidence:ios");
assertIncludes("Archive check documented", appStoreSubmission, "npm run archive:ios:check");
assertIncludes("Archive signing report documented", appStoreSubmission, "npm run archive:ios:signing");
assertIncludes("Archive command documented", appStoreSubmission, "npm run archive:ios");
assertIncludes("Archive-only command documented", appStoreSubmission, "npm run archive:ios:only");
assertIncludes("Export retry command documented", appStoreSubmission, "npm run export:ios");
assertIncludes("App Store Connect account blocker documented", appStoreSubmission, "App Store Connect access");
assertIncludes("App Store export checklist documented", appStoreSubmission, "ios/AppStoreExportReadiness.md");
assertIncludes("Archive export gate documented", appStoreSubmission, "archiveExport.appStoreExportSigningReady");
assertIncludes("Medical education disclaimer documented", appStoreSubmission, "not intended to diagnose");
assertIncludes("Account deletion risk documented", appStoreSubmission, "Account deletion");

const appStoreExportReadiness = readText("ios", "AppStoreExportReadiness.md");
assertIncludes("Export checklist names bundle ID", appStoreExportReadiness, "com.jeremyswisher.uclasportsmri");
assertIncludes("Export checklist names Apple team", appStoreExportReadiness, "X578T4K65B");
assertIncludes("Export checklist names App Store profile type", appStoreExportReadiness, "App Store distribution provisioning profile");
assertIncludes("Export checklist accepts one or more App Store profiles", appStoreExportReadiness, "1` or higher");
assertIncludes("Export checklist tolerates duplicate matching profiles", appStoreExportReadiness, "more than one installed matching");
assertIncludes("Export checklist separates independent blockers", appStoreExportReadiness, "Two independent Apple-side blockers remain");
assertIncludes("Export checklist documents Xcode account access", appStoreExportReadiness, "App Store Connect access for Team `X578T4K65B`");
assertIncludes("Export checklist includes signing command", appStoreExportReadiness, "npm run archive:ios:signing");
assertIncludes("Export checklist cites Apple profile workflow", appStoreExportReadiness, "create-an-app-store-provisioning-profile");
assertIncludes("Export checklist covers keychain visibility caveat", appStoreExportReadiness, "zero code-signing identities");
assertIncludes("Export checklist documents upload-capable roles", appStoreExportReadiness, "Account Holder, Admin, App Manager, or Developer");

const authSetup = readText("ios", "AppleFirebaseAuthSetup.md");
assertIncludes("Apple setup doc names bundle ID", authSetup, "com.jeremyswisher.uclasportsmri");
assertIncludes("Apple setup doc names Apple Services ID", authSetup, "com.jeremyswisher.uclasportsmri.web");
assertIncludes("Apple setup doc lists Firebase provider", authSetup, "Firebase Authentication");
assertIncludes("Apple setup doc gives exact return URL", authSetup, "https://ucla-knee-mri.firebaseapp.com/__/auth/handler");
assertIncludes("Apple setup doc gives secondary auth handler", authSetup, "https://ucla-knee-mri.web.app/__/auth/handler");
assertIncludes("Apple setup doc names Firebase auth domain", authSetup, "ucla-knee-mri.firebaseapp.com");
assertIncludes("Apple setup doc names Firebase web.app domain", authSetup, "ucla-knee-mri.web.app");
assertIncludes("Apple setup doc warns against committing secrets", authSetup, "Do not commit");
assertIncludes("Apple setup doc includes auth evidence command", authSetup, "npm run auth:ios:evidence:verify");
assertIncludes("Apple setup doc includes submission gate command", authSetup, "npm run preflight:ios:submit");

const authEvidence = readText("scripts", "ios-auth-evidence.mjs");
assertIncludes("Auth evidence verifies Apple Developer gate", authEvidence, "appleDeveloper.signInWithAppleEnabledForBundleId");
assertIncludes("Auth evidence verifies Firebase Apple provider gate", authEvidence, "firebaseAuth.appleProviderConfigured");
assertIncludes("Auth evidence verifies Firebase authorized domains gate", authEvidence, "firebaseAuth.authorizedDomainsIncludeFirebaseHosting");
assertIncludes("Auth evidence validates native Apple entitlement", authEvidence, "com.apple.developer.applesignin");
assertIncludes("Auth evidence validates web Apple provider", authEvidence, 'OAuthProvider("apple.com")');
assertIncludes("Auth evidence validates Firebase project", authEvidence, "firebase.firebaseProjectId === expected.firebaseProjectId");
assertIncludes("Auth evidence validates Apple Services ID", authEvidence, "firebase.serviceId === expected.serviceId");
assertIncludes("Auth evidence reports submission gate alignment", authEvidence, "Submission Gate Alignment");
assertIncludes("Auth evidence rejects private keys", authEvidence, "PRIVATE KEY");

const appStoreConnectEvidenceScript = readText("scripts", "ios-app-store-connect-evidence.mjs");
assertIncludes("App Store Connect evidence verifies metadata gate", appStoreConnectEvidenceScript, "appStoreConnect.metadataEntered");
assertIncludes("App Store Connect evidence verifies regulated medical device gate", appStoreConnectEvidenceScript, "appStoreConnect.regulatedMedicalDeviceStatusCompleted");
assertIncludes("App Store Connect evidence verifies screenshot upload gate", appStoreConnectEvidenceScript, "appStoreConnect.screenshotsUploaded");
assertIncludes("App Store Connect evidence runs screenshot verifier", appStoreConnectEvidenceScript, "scripts/ios-screenshot-evidence.mjs");
assertIncludes("App Store Connect evidence requires screenshot verifier pass", appStoreConnectEvidenceScript, "screenshotEvidenceVerifierPassed");
assertIncludes("App Store Connect evidence prints screenshot upload packet", appStoreConnectEvidenceScript, "Screenshot Upload Packet");
assertIncludes("App Store Connect evidence prints iPhone screenshot folder", appStoreConnectEvidenceScript, "ios/screenshots/iphone-6-9");
assertIncludes("App Store Connect evidence prints iPad screenshot folder", appStoreConnectEvidenceScript, "ios/screenshots/ipad-13");
assertIncludes("App Store Connect evidence derives native marketing version", appStoreConnectEvidenceScript, "MARKETING_VERSION");
assertIncludes("App Store Connect evidence derives native build number", appStoreConnectEvidenceScript, "CURRENT_PROJECT_VERSION");
assertIncludes("App Store Connect evidence validates App Store limits", appStoreConnectEvidenceScript, "reviewNotesMaxBytes");
assertIncludes("App Store Connect evidence reports ready gates", appStoreConnectEvidenceScript, "Ready App Store Connect gates");
assertIncludes("App Store Connect evidence prints role prerequisites", appStoreConnectEvidenceScript, "Account Holder, App Manager, or Admin");
assertIncludes("App Store Connect evidence prints primary language", appStoreConnectEvidenceScript, "Primary language");
assertIncludes("App Store Connect evidence prints user access", appStoreConnectEvidenceScript, "Full Access");

const appStoreReleaseEvidenceScript = readText("scripts", "ios-app-store-release-evidence.mjs");
assertIncludes("App Store release evidence verifies submission gate", appStoreReleaseEvidenceScript, "appStoreRelease.submittedForReview");
assertIncludes("App Store release evidence verifies approval gate", appStoreReleaseEvidenceScript, "appStoreRelease.approvedForRelease");
assertIncludes("App Store release evidence verifies public listing gate", appStoreReleaseEvidenceScript, "appStoreRelease.publicStorePageVerified");
assertIncludes("App Store release evidence reports ready gates", appStoreReleaseEvidenceScript, "Ready App Store release gates");

const releaseEvidenceScript = readText("scripts", "ios-release-evidence.mjs");
assertIncludes("Release evidence verifies Google native auth gate", releaseEvidenceScript, "realDeviceAuth.googleSignInPassedInNativeShell");
assertIncludes("Release evidence verifies Apple native auth gate", releaseEvidenceScript, "realDeviceAuth.appleSignInPassedInNativeShell");
assertIncludes("Release evidence verifies account deletion gate", releaseEvidenceScript, "accountDeletion.requestFlowVerified");
assertIncludes("Release evidence reports ready gates", releaseEvidenceScript, "Ready real-device/account-deletion gates");

const evidenceAuditScript = readText("scripts", "ios-evidence-audit.mjs");
assertIncludes("Evidence audit runs archive signing", evidenceAuditScript, "scripts/ios-archive.mjs");
assertIncludes("Evidence audit runs auth evidence", evidenceAuditScript, "scripts/ios-auth-evidence.mjs");
assertIncludes("Evidence audit runs release evidence", evidenceAuditScript, "scripts/ios-release-evidence.mjs");
assertIncludes("Evidence audit runs App Store Connect evidence", evidenceAuditScript, "scripts/ios-app-store-connect-evidence.mjs");
assertIncludes("Evidence audit runs App Store release evidence", evidenceAuditScript, "scripts/ios-app-store-release-evidence.mjs");
assertIncludes("Evidence audit runs submission gate report", evidenceAuditScript, "scripts/ios-gate-report.mjs");

const submissionGateScript = readText("scripts", "ios-submission-gate.mjs");
assertIncludes("Hard gate requires App Store export signing evidence", submissionGateScript, "archiveExport.appStoreExportSigningReady");
assertIncludes(
  "Hard gate requires App Store Connect account evidence",
  submissionGateScript,
  "archiveExport.appStoreConnectAccountAccessVerified",
);
assertIncludes("Hard gate runs archive-signing verifier", submissionGateScript, "scripts/ios-archive.mjs --signing");
assertIncludes("Hard gate requires exact export-signing success", submissionGateScript, "^App Store export signing ready: yes$");
assertIncludes("Hard gate runs Apple/Firebase verifier", submissionGateScript, "scripts/ios-auth-evidence.mjs --verify");
assertIncludes("Hard gate runs release verifier", submissionGateScript, "scripts/ios-release-evidence.mjs --verify");
assertIncludes("Hard gate runs screenshot verifier", submissionGateScript, "scripts/ios-screenshot-evidence.mjs --verify");
assertIncludes("Hard gate runs App Store Connect verifier", submissionGateScript, "scripts/ios-app-store-connect-evidence.mjs --verify");

const submissionGate = JSON.parse(readText("ios", "AppStoreSubmissionGate.json"));
if (submissionGate.appleDeveloper?.bundleId === "com.jeremyswisher.uclasportsmri") {
  pass("Submission gate bundle ID matches native bundle");
} else {
  fail("Submission gate bundle ID matches native bundle", submissionGate.appleDeveloper?.bundleId ?? "missing");
}
if (submissionGate.firebaseAuth?.appleProviderConfigured === false) {
  pass("Submission gate tracks Firebase Apple provider as external");
} else {
  fail("Submission gate tracks Firebase Apple provider as external");
}
if (submissionGate.archiveExport?.appStoreExportSigningReady === false) {
  pass("Submission gate tracks App Store export signing as external");
} else {
  fail("Submission gate tracks App Store export signing as external");
}
if (submissionGate.archiveExport?.appStoreConnectAccountAccessVerified === false) {
  pass("Submission gate tracks App Store Connect account access as external");
} else {
  fail("Submission gate tracks App Store Connect account access as external");
}
if (submissionGate.appStoreConnect?.submittedForReview === false) {
  pass("Submission gate prevents accidental App Review completion claim");
} else {
  fail("Submission gate prevents accidental App Review completion claim");
}
if (submissionGate.appStoreConnect?.regulatedMedicalDeviceStatusCompleted === false) {
  pass("Submission gate tracks regulated medical device status as external");
} else {
  fail("Submission gate tracks regulated medical device status as external");
}

const metadata = JSON.parse(readText("ios", "AppStoreConnectMetadata.json"));
if (metadata.bundleId === "com.jeremyswisher.uclasportsmri") {
  pass("Metadata bundle ID matches native bundle");
} else {
  fail("Metadata bundle ID matches native bundle", metadata.bundleId ?? "missing");
}
if (metadata.name === "UCLA Sports MRI") {
  pass("Metadata app name is ready");
} else {
  fail("Metadata app name is ready", metadata.name ?? "missing");
}
if (metadata.subtitle === "Sports medicine MRI learning") {
  pass("Metadata subtitle is ready");
} else {
  fail("Metadata subtitle is ready", metadata.subtitle ?? "missing");
}
if (
  metadata.ageRatingRecommendation === "16+" &&
  metadata.ageRatingBasis?.appleAnswer === "Frequent medical or treatment information"
) {
  pass("Metadata age rating matches current Apple medical category");
} else {
  fail("Metadata age rating matches current Apple medical category", metadata.ageRatingRecommendation ?? "missing");
}
if (
  metadata.regulatedMedicalDevice?.declarationRequired === true &&
  metadata.regulatedMedicalDevice?.answer === "No" &&
  metadata.regulatedMedicalDevice?.rationale?.includes("educational only")
) {
  pass("Metadata regulated medical device declaration is ready");
} else {
  fail("Metadata regulated medical device declaration is ready", metadata.regulatedMedicalDevice?.answer ?? "missing");
}
if (metadata.supportUrl === "https://ucla-knee-mri.firebaseapp.com/support") {
  pass("Metadata support URL matches app route");
} else {
  fail("Metadata support URL matches app route", metadata.supportUrl ?? "missing");
}
if (metadata.privacyPolicyUrl === "https://ucla-knee-mri.firebaseapp.com/privacy") {
  pass("Metadata privacy URL matches app route");
} else {
  fail("Metadata privacy URL matches app route", metadata.privacyPolicyUrl ?? "missing");
}
if (metadata.accessibilityUrl === "https://ucla-knee-mri.firebaseapp.com/accessibility") {
  pass("Metadata accessibility URL matches app route");
} else {
  fail("Metadata accessibility URL matches app route", metadata.accessibilityUrl ?? "missing");
}
if (
  metadata.accessibilityNutritionLabels?.claimSupportOnlyAfterDeviceAudit === true &&
  metadata.accessibilityNutritionLabels?.featuresToEvaluate?.includes("VoiceOver")
) {
  pass("Metadata accessibility label audit plan is ready");
} else {
  fail("Metadata accessibility label audit plan is ready");
}
if (Array.isArray(metadata.keywords) && metadata.keywords.includes("MRI") && metadata.keywords.includes("sports medicine")) {
  pass("Metadata keywords include core search terms");
} else {
  fail("Metadata keywords include core search terms");
}
const metadataKeywords = Array.isArray(metadata.keywords) ? metadata.keywords.join(", ") : "";
if (metadataKeywords.length > 0 && metadataKeywords.length <= 100) {
  pass("Metadata keywords fit App Store Connect limit", `${metadataKeywords.length}/100`);
} else {
  fail("Metadata keywords fit App Store Connect limit", `${metadataKeywords.length}/100`);
}
if (metadata.reviewNotes?.includes("Continue in App Review demo") && metadata.reviewNotes?.includes("not intended to diagnose")) {
  pass("Metadata review notes include demo access and medical disclaimer");
} else {
  fail("Metadata review notes include demo access and medical disclaimer");
}
if (
  Array.isArray(metadata.submissionChecklist) &&
  metadata.submissionChecklist.some((item) => item.includes("com.jeremyswisher.uclasportsmri.web")) &&
  metadata.submissionChecklist.some((item) => item.includes("https://ucla-knee-mri.firebaseapp.com/__/auth/handler")) &&
  metadata.submissionChecklist.some((item) => item.includes("ucla-knee-mri.web.app"))
) {
  pass("Metadata checklist includes exact Apple/Firebase auth values");
} else {
  fail("Metadata checklist includes exact Apple/Firebase auth values");
}
if (metadata.privacy?.tracking === false && metadata.privacy?.dataLinkedToUser?.includes("Product Interaction")) {
  pass("Metadata privacy summary matches manifest");
} else {
  fail("Metadata privacy summary matches manifest");
}

const screenshotPlan = readText("ios", "ScreenshotPlan.md");
assertIncludes("Screenshot plan covers iPhone 6.9-inch", screenshotPlan, "iPhone 6.9-inch");
assertIncludes("Screenshot plan covers iPad 13-inch", screenshotPlan, "iPad 13-inch");
assertIncludes("Screenshot plan covers guided tour route", screenshotPlan, "normal-knee-mri?mode=tour");
assertIncludes("Screenshot plan covers knowledge check route", screenshotPlan, "normal-knee-mri?mode=check");
assertIncludes("Screenshot plan covers cross-plane route", screenshotPlan, "normal-shoulder-mri?mode=correlate");
assertIncludes("Screenshot plan includes checker command", screenshotPlan, "npm run screenshots:ios:check");
assertIncludes("Screenshot plan includes capture command", screenshotPlan, "npm run screenshots:ios:capture");
assertIncludes("Screenshot plan includes evidence command", screenshotPlan, "npm run screenshots:ios:evidence:verify");
assertIncludes("Screenshot plan excludes PHI", screenshotPlan, "No protected health information");

const screenshotCapture = readText("scripts", "ios-capture-screenshots.mjs");
assertIncludes("Screenshot capture script launches planned routes", screenshotCapture, "--ucla-sports-mri-path");
assertIncludes("Screenshot capture script enables demo bootstrap", screenshotCapture, "--ucla-sports-mri-screenshot-demo");
assertIncludes("Screenshot capture script focuses MRI screenshots", screenshotCapture, "screenshotFocus");
assertIncludes("Screenshot capture script writes iPhone set", screenshotCapture, "iphone-6-9");
assertIncludes("Screenshot capture script writes iPad set", screenshotCapture, "ipad-13");

const exportOptions = readText("ios", "ExportOptions.plist");
assertIncludes("Export destination uploads to App Store Connect", exportOptions, "<string>upload</string>");
assertIncludes("Export method targets App Store Connect", exportOptions, "<string>app-store-connect</string>");
assertIncludes("Automatic signing export configured", exportOptions, "<string>automatic</string>");

const xcodeProject = readText("ios", "UCLASportsMRI.xcodeproj", "project.pbxproj");
const xcodeTeamMatches = xcodeProject.match(/DEVELOPMENT_TEAM = X578T4K65B;/g) ?? [];
if (xcodeTeamMatches.length === 2) {
  pass("Apple Developer Team pinned in generated Xcode project", "Debug and Release");
} else {
  fail("Apple Developer Team pinned in generated Xcode project", `${xcodeTeamMatches.length}/2 matches`);
}

const archiveHelper = readText("scripts", "ios-archive.mjs");
assertIncludes("Archive helper targets Release", archiveHelper, '"Release"');
assertIncludes("Archive helper targets generic iOS", archiveHelper, "generic/platform=iOS");
assertIncludes("Archive helper uses export options", archiveHelper, "ExportOptions.plist");
assertIncludes("Archive helper supports archive-only mode", archiveHelper, "--archive-only");
assertIncludes("Archive helper supports export retry mode", archiveHelper, "--export");
assertIncludes("Archive helper diagnoses export failures", archiveHelper, "diagnoseExportFailure");
assertIncludes("Archive helper reads distribution logs", archiveHelper, "IDEDistribution.standard.log");
assertIncludes("Archive helper explains account access failures", archiveHelper, "App Store Connect access");
assertIncludes("Archive helper explains upload-capable roles", archiveHelper, "Account Holder, Admin, App Manager, or Developer");
assertIncludes("Archive helper explains missing App Store profiles", archiveHelper, "No profiles for");
assertIncludes("Archive helper supports explicit team", archiveHelper, "IOS_DEVELOPMENT_TEAM");
assertIncludes("Archive helper auto-detects Xcode teams", archiveHelper, "detectXcodeTeams");
assertIncludes("Archive helper uses workspace DerivedData", archiveHelper, "IOS_DERIVED_DATA_PATH");
assertIncludes("Archive helper reports signing settings", archiveHelper, "--signing");
assertIncludes("Archive helper checks development team", archiveHelper, "DEVELOPMENT_TEAM");
assertIncludes("Archive helper reports Distribution identities", archiveHelper, "Apple Distribution identities");
assertIncludes("Archive helper decodes provisioning profiles", archiveHelper, "Decoded provisioning profiles");
assertIncludes("Archive helper reports matching profiles", archiveHelper, "Matching provisioning profiles");
assertIncludes("Archive helper reports App Store profiles", archiveHelper, "Matching App Store profiles");
assertIncludes("Archive helper warns on weak keychain visibility", archiveHelper, "no code-signing identities were visible to this process");
assertIncludes("Archive helper asks for full keychain access", archiveHelper, "with full keychain access");
assertIncludes("Archive helper reports archive signing assets", archiveHelper, "Local archive signing assets ready");
assertIncludes("Archive helper reports App Store export signing", archiveHelper, "App Store export signing ready");
assertIncludes("Archive helper tells user to recheck export signing", archiveHelper, "until App Store export signing ready: yes");
assertIncludes("Archive helper tells user to recheck App Store Connect account", archiveHelper, "from an Xcode account with App Store Connect access");

const firestoreRules = readText("firestore.rules");
assertIncludes("Deletion request rules exist", firestoreRules, "match /accountDeletionRequests/{userId}");
assertIncludes("Learners can create own deletion request", firestoreRules, "allow create: if isOwner(userId)");
assertIncludes("Deletion request owner field is enforced", firestoreRules, "request.resource.data.userId == userId");
assertIncludes("Deletion request uses server timestamp", firestoreRules, "request.resource.data.requestedAt == request.time");
assertIncludes("Deletion request admin delete is restricted", firestoreRules, "allow delete: if isAdmin()");

const deletionProcessor = readText("scripts", "process-account-deletion.mjs");
assertIncludes("Deletion processor deletes Firebase Auth user", deletionProcessor, "getAuth().deleteUser");
assertIncludes("Deletion processor recursively removes learner data", deletionProcessor, "deleteDocumentTree(userRef)");
assertIncludes("Deletion processor de-identifies audit logs", deletionProcessor, "deidentifyAuditLogs");
assertIncludes("Deletion processor requires explicit confirmation", deletionProcessor, "--confirm");

const screenshotChecker = readText("scripts", "ios-screenshot-check.mjs");
assertIncludes("Screenshot checker validates iPhone folder", screenshotChecker, 'join("ios", "screenshots", "iphone-6-9")');
assertIncludes("Screenshot checker validates iPad folder", screenshotChecker, 'join("ios", "screenshots", "ipad-13")');
assertIncludes("Screenshot checker validates iPhone 6.9 size", screenshotChecker, "1320, 2868");
assertIncludes("Screenshot checker validates iPad 13 size", screenshotChecker, "2048, 2732");
assertIncludes("Screenshot checker enforces screenshot count", screenshotChecker, "screenshot count is 1-10");
assertIncludes("Screenshot checker covers App Store stem", screenshotChecker, "04-cross-plane");

const screenshotEvidence = readText("scripts", "ios-screenshot-evidence.mjs");
assertIncludes("Screenshot evidence verifies iPhone screenshot gate", screenshotEvidence, "screenshots.iphone69Captured");
assertIncludes("Screenshot evidence verifies iPad screenshot gate", screenshotEvidence, "screenshots.ipad13Captured");
assertIncludes("Screenshot evidence verifies no-PHI screenshot gate", screenshotEvidence, "screenshots.screenshotsReviewedForNoPhi");
assertIncludes("Screenshot evidence accepts TestFlight source", screenshotEvidence, "TestFlight/native iOS app");
assertIncludes("Screenshot evidence accepts native simulator source", screenshotEvidence, "Native iOS simulator Debug build");

const liveReadiness = readText("scripts", "ios-live-readiness.mjs");
assertIncludes("Live readiness checks firebaseapp auth handler", liveReadiness, "https://ucla-knee-mri.firebaseapp.com/__/auth/handler");
assertIncludes("Live readiness checks web.app auth handler", liveReadiness, "https://ucla-knee-mri.web.app/__/auth/handler");
assertIncludes("Live readiness validates Firebase auth helper", liveReadiness, "firebase-auth-helper");
assertIncludes("Live readiness validates native iOS marker", liveReadiness, "UCLASportsMRIiOS");
assertIncludes("Live readiness fetches lazy chunks", liveReadiness, "Live JS bundle and lazy chunks fetched");
assertIncludes("Live readiness checks web manifest", liveReadiness, "/manifest.webmanifest");
assertIncludes("Live readiness checks Apple touch icon", liveReadiness, "/apple-touch-icon.png");
assertIncludes("Live readiness checks 512 PWA icon", liveReadiness, "/pwa-icon-512.png");
assertIncludes("Live readiness validates icon content types", liveReadiness, "assertContentTypeIncludes");
assertIncludes("Live readiness normalizes Vite asset references", liveReadiness, 'assetPath.startsWith("assets/")');
assertIncludes("Live readiness rejects rewritten JS chunks", liveReadiness, "Live JS asset did not rewrite to HTML shell");
assertIncludes("Live readiness checks account route", liveReadiness, 'fetchText("/account")');
assertIncludes("Live readiness validates account deletion UI", liveReadiness, "Request account deletion");
assertIncludes("Live readiness validates deletion confirmation", liveReadiness, "Confirm deletion request");

const gateReport = readText("scripts", "ios-gate-report.mjs");
assertIncludes("Gate report summarizes App Review readiness", gateReport, "Ready for App Review submission");
assertIncludes("Gate report includes final submission flag", gateReport, "appStoreConnect.submittedForReview");
assertIncludes("Gate report includes archive export signing group", gateReport, "Archive / Export Signing");
assertIncludes("Gate report includes App Store export signing gate", gateReport, "archiveExport.appStoreExportSigningReady");
assertIncludes(
  "Gate report includes App Store Connect account gate",
  gateReport,
  "archiveExport.appStoreConnectAccountAccessVerified",
);
assertIncludes("Gate report includes export signing command", gateReport, "npm run archive:ios:signing");
assertIncludes("Gate report includes export retry command", gateReport, "npm run export:ios");
assertIncludes("Gate report includes real-device Apple auth gate", gateReport, "realDeviceAuth.appleSignInPassedInNativeShell");
assertIncludes("Gate report includes App Store Connect evidence command", gateReport, "npm run asc:ios:evidence");
assertIncludes("Gate report includes release evidence command", gateReport, "npm run release:ios:evidence");
assertIncludes("Gate report includes evidence audit command", gateReport, "npm run evidence:ios");

const appIconManifestPath = path("ios", "UCLASportsMRI", "Assets.xcassets", "AppIcon.appiconset", "Contents.json");
const appIconManifest = JSON.parse(readFileSync(appIconManifestPath, "utf8"));
const expectedMarketing = appIconManifest.images.find(
  (image) => image.idiom === "ios-marketing" && image.size === "1024x1024" && image.scale === "1x",
);
if (expectedMarketing?.filename) {
  const iconPath = path("ios", "UCLASportsMRI", "Assets.xcassets", "AppIcon.appiconset", expectedMarketing.filename);
  if (!existsSync(iconPath)) {
    fail("Marketing app icon exists", `${expectedMarketing.filename} is missing`);
  } else {
    const size = pngSize(iconPath);
    if (size.width === 1024 && size.height === 1024) {
      pass("Marketing app icon is 1024x1024", expectedMarketing.filename);
    } else {
      fail("Marketing app icon is 1024x1024", `${expectedMarketing.filename} is ${size.width}x${size.height}`);
    }
  }
} else {
  fail("Marketing app icon declared", "Missing ios-marketing 1024x1024 entry");
}

for (const image of appIconManifest.images) {
  if (!image.filename) continue;
  if (!existsSync(path("ios", "UCLASportsMRI", "Assets.xcassets", "AppIcon.appiconset", image.filename))) {
    fail("All declared app icon files exist", `${image.filename} is missing`);
  }
}
if (!checks.some((check) => check.label === "All declared app icon files exist" && !check.ok)) {
  pass("All declared app icon files exist");
}

assertFile("Built web index exists", "dist", "index.html");
assertFile("PWA 512 icon exists", "public", "pwa-icon-512.png");
assertFile("Apple touch icon exists", "public", "apple-touch-icon.png");

const app = readText("src", "App.tsx");
assertIncludes("Accessibility route exists", app, 'path="/accessibility"');
assertIncludes("Privacy route exists", app, 'path="/privacy"');
assertIncludes("Support route exists", app, 'path="/support"');
assertIncludes("Account route exists", app, 'path="/account"');

const accessibility = readText("src", "pages", "AccessibilityPage.tsx");
assertIncludes("Accessibility page names common tasks", accessibility, "Common tasks");
assertIncludes("Accessibility page avoids unsupported label claims", accessibility, "should be entered only after");
assertIncludes("Accessibility page explains MRI image limitation", accessibility, "image anatomy");

const login = readText("src", "pages", "LoginPage.tsx");
assertIncludes("Sign in with Apple button exists", login, "Sign in with Apple");
assertIncludes("App Review demo button exists", login, "Continue in App Review demo");
assertIncludes("Medical disclaimer present on login", login, "Educational training only");
assertIncludes("Account deletion notice survives sign-out redirect", login, "noticeFromLocationState");
assertIncludes("Account deletion notice is announced", login, 'role="status"');

const loginReturn = readText("src", "lib", "login-return.ts");
assertIncludes("Native iOS shell auth uses redirect flow", loginReturn, "isNativeIosAppShell(url.search, hints.userAgent)");
assertIncludes("Native shell auth keeps return path", login, "rememberReturnPath(sessionStorage, returnTo)");

const pwaHelpers = readText("src", "lib", "pwa.ts");
assertIncludes("Native iOS shell skips service worker registration", pwaHelpers, "clearNativeIosShellServiceWorkerState");
assertIncludes("Native iOS shell unregisters stale service workers", pwaHelpers, "navigator.serviceWorker");
assertIncludes("Native iOS shell clears stale app caches", pwaHelpers, "window.caches.delete");

const authErrorMessages = readText("src", "lib", "auth-error-message.ts");
assertIncludes("Apple auth setup error is user-friendly", authErrorMessages, "Sign in with Apple is not fully configured yet");
assertIncludes("Apple redirect setup hint exists", authErrorMessages, "Configure the Apple provider");

const firebase = readText("firebase.json");
assertIncludes("Firebase Hosting serves dist", firebase, '"public": "dist"');
assertIncludes("SPA rewrite configured", firebase, '"destination": "/index.html"');

const failures = checks.filter((check) => !check.ok);
for (const check of checks) {
  const icon = check.ok ? "PASS" : "FAIL";
  console.log(`${icon} ${check.label}${check.detail ? ` - ${check.detail}` : ""}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} iOS App Store preflight check(s) failed.`);
  process.exit(1);
}

console.log(`\n${checks.length} iOS App Store preflight checks passed.`);
