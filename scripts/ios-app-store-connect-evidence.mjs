import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verify = process.argv.includes("--verify");

const evidencePath = join(root, "ios", "AppStoreConnectEvidence.json");
const metadataPath = join(root, "ios", "AppStoreConnectMetadata.json");
const screenshotEvidencePath = join(root, "ios", "ScreenshotEvidence.json");
const submissionGatePath = join(root, "ios", "AppStoreSubmissionGate.json");
const infoPlistPath = join(root, "ios", "UCLASportsMRI", "Info.plist");
const projectSpecPath = join(root, "ios", "project.yml");

const evidenceText = readFileSync(evidencePath, "utf8");
const evidence = JSON.parse(evidenceText);
const metadataText = readFileSync(metadataPath, "utf8");
const metadata = JSON.parse(metadataText);
const screenshotEvidence = JSON.parse(readFileSync(screenshotEvidencePath, "utf8"));
const submissionGate = JSON.parse(readFileSync(submissionGatePath, "utf8"));
const infoPlist = readFileSync(infoPlistPath, "utf8");
const projectSpec = readFileSync(projectSpecPath, "utf8");
const nativeMarketingVersion = yamlStringValue(projectSpec, "MARKETING_VERSION");
const nativeBuildNumber = yamlStringValue(projectSpec, "CURRENT_PROJECT_VERSION");

const expected = {
  bundleId: "com.jeremyswisher.uclasportsmri",
  sku: "ucla-sports-mri-ios",
  platform: "iOS",
  version: nativeMarketingVersion,
  build: nativeBuildNumber,
  name: "UCLA Sports MRI",
  subtitle: "Sports medicine MRI learning",
  supportUrl: "https://ucla-knee-mri.firebaseapp.com/support",
  privacyPolicyUrl: "https://ucla-knee-mri.firebaseapp.com/privacy",
  accessibilityUrl: "https://ucla-knee-mri.firebaseapp.com/accessibility",
  screenshotSource: "ios/ScreenshotEvidence.json",
};

const limits = {
  nameMin: 2,
  nameMax: 30,
  subtitleMax: 30,
  descriptionMax: 4000,
  promotionalTextMax: 170,
  keywordsMax: 100,
  whatsNewMax: 4000,
  reviewNotesMaxBytes: 4000,
};

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function byteLength(value) {
  return Buffer.byteLength(value ?? "", "utf8");
}

function lengthBetween(value, min, max) {
  return text(value) && value.length >= min && value.length <= max;
}

function hasSecretLeak(raw) {
  return /-----BEGIN [A-Z ]*PRIVATE KEY-----|\.p8\b|(?:api[_-]?key|issuer[_-]?id|password|app[_-]?specific[_-]?password)\s*[:=]\s*["']?[^"',\s]{12,}/i.test(
    raw,
  );
}

function includesAll(actual, required) {
  return Array.isArray(actual) && required.every((value) => actual.includes(value));
}

function yamlStringValue(source, key) {
  return source.match(new RegExp(`\\b${key}:\\s*"?([^"\\n]+)"?`))?.[1]?.trim() ?? "";
}

function runScreenshotEvidenceVerifier() {
  return spawnSync(process.execPath, ["scripts/ios-screenshot-evidence.mjs", "--verify"], {
    cwd: root,
    encoding: "utf8",
  });
}

function firstUsefulFailure(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.find((line) => line.startsWith("FAIL ") || line.startsWith("TODO ")) ?? lines.at(-1) ?? "No verifier output.";
}

const keywords = Array.isArray(metadata.keywords) ? metadata.keywords.join(", ") : "";
const metadataChecks = [
  {
    label: "App name is 2-30 characters",
    ok: lengthBetween(metadata.name, limits.nameMin, limits.nameMax),
    detail: `${metadata.name?.length ?? 0}/${limits.nameMax}`,
  },
  {
    label: "Subtitle is 30 characters or fewer",
    ok: text(metadata.subtitle) && metadata.subtitle.length <= limits.subtitleMax,
    detail: `${metadata.subtitle?.length ?? 0}/${limits.subtitleMax}`,
  },
  {
    label: "Bundle ID matches native project",
    ok: metadata.bundleId === expected.bundleId,
    detail: metadata.bundleId ?? "missing",
  },
  {
    label: "SKU uses the locked submission SKU",
    ok: metadata.sku === expected.sku && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(metadata.sku),
    detail: metadata.sku ?? "missing",
  },
  {
    label: "Version/build match native project settings",
    ok: metadata.version === expected.version && metadata.build === expected.build,
    detail: `${metadata.version ?? "missing"} (${metadata.build ?? "missing"})`,
  },
  {
    label: "Age rating recommendation matches Apple medical category",
    ok:
      metadata.ageRatingRecommendation === "16+" &&
      metadata.ageRatingBasis?.appleAnswer === "Frequent medical or treatment information",
    detail: `${metadata.ageRatingRecommendation ?? "missing"}; ${metadata.ageRatingBasis?.appleAnswer ?? "missing"}`,
  },
  {
    label: "Regulated medical device declaration is prepared",
    ok:
      metadata.regulatedMedicalDevice?.declarationRequired === true &&
      metadata.regulatedMedicalDevice?.answer === "No" &&
      text(metadata.regulatedMedicalDevice?.rationale) &&
      metadata.regulatedMedicalDevice.rationale.includes("educational only"),
    detail: metadata.regulatedMedicalDevice?.answer ?? "missing",
  },
  {
    label: "Support URL is HTTPS",
    ok: metadata.supportUrl === expected.supportUrl && httpsUrl(metadata.supportUrl),
    detail: metadata.supportUrl ?? "missing",
  },
  {
    label: "Privacy Policy URL is HTTPS",
    ok: metadata.privacyPolicyUrl === expected.privacyPolicyUrl && httpsUrl(metadata.privacyPolicyUrl),
    detail: metadata.privacyPolicyUrl ?? "missing",
  },
  {
    label: "Accessibility URL is HTTPS",
    ok: metadata.accessibilityUrl === expected.accessibilityUrl && httpsUrl(metadata.accessibilityUrl),
    detail: metadata.accessibilityUrl ?? "missing",
  },
  {
    label: "Accessibility Nutrition Label audit plan is prepared",
    ok:
      metadata.accessibilityNutritionLabels?.claimSupportOnlyAfterDeviceAudit === true &&
      includesAll(metadata.accessibilityNutritionLabels?.featuresToEvaluate, ["VoiceOver", "Voice Control", "Larger Text"]) &&
      includesAll(metadata.accessibilityNutritionLabels?.commonTaskBasis, ["Choose a course"]),
    detail: metadata.accessibilityNutritionLabels?.status ?? "missing",
  },
  {
    label: "Keywords fit App Store Connect field",
    ok: keywords.length > 0 && keywords.length <= limits.keywordsMax,
    detail: `${keywords.length}/${limits.keywordsMax}`,
  },
  {
    label: "Description fits App Store Connect field",
    ok: text(metadata.description) && metadata.description.length <= limits.descriptionMax,
    detail: `${metadata.description?.length ?? 0}/${limits.descriptionMax}`,
  },
  {
    label: "Promotional text fits App Store Connect field",
    ok: text(metadata.promotionalText) && metadata.promotionalText.length <= limits.promotionalTextMax,
    detail: `${metadata.promotionalText?.length ?? 0}/${limits.promotionalTextMax}`,
  },
  {
    label: "What's New text is within later-version limit",
    ok: !text(metadata.whatsNew) || metadata.whatsNew.length <= limits.whatsNewMax,
    detail: `${metadata.whatsNew?.length ?? 0}/${limits.whatsNewMax}`,
  },
  {
    label: "Review notes fit App Review field",
    ok: text(metadata.reviewNotes) && byteLength(metadata.reviewNotes) <= limits.reviewNotesMaxBytes,
    detail: `${byteLength(metadata.reviewNotes)}/${limits.reviewNotesMaxBytes} bytes`,
  },
  {
    label: "Review notes include demo access",
    ok: metadata.reviewNotes?.includes("Continue in App Review demo"),
    detail: "Continue in App Review demo",
  },
  {
    label: "Review notes include medical disclaimer",
    ok: metadata.reviewNotes?.includes("not intended to diagnose"),
    detail: "not intended to diagnose",
  },
  {
    label: "Privacy summary matches app behavior",
    ok:
      metadata.privacy?.tracking === false &&
      includesAll(metadata.privacy?.dataLinkedToUser, ["Name", "Email Address", "User ID", "Product Interaction"]) &&
      includesAll(metadata.privacy?.notUsed, ["HealthKit", "Location", "Camera", "Contacts", "Push notifications"]),
    detail: "tracking false; no sensitive device permissions",
  },
];

const screenshotEvidenceVerification = runScreenshotEvidenceVerifier();
const screenshotEvidenceVerifierPassed = screenshotEvidenceVerification.status === 0;
const metadataSourceReady = metadataChecks.every((check) => check.ok);
const screenshotEvidenceReady =
  screenshotEvidenceVerifierPassed &&
  screenshotEvidence.iphone69?.captured === true &&
  screenshotEvidence.ipad13?.captured === true &&
  screenshotEvidence.phiReview?.reviewed === true &&
  screenshotEvidence.phiReview?.noPhiConfirmed === true;
const exportComplianceReady =
  infoPlist.includes("<key>ITSAppUsesNonExemptEncryption</key>") && infoPlist.includes("<false/>");
const secretLeak = hasSecretLeak(`${evidenceText}\n${metadataText}`);

const appRecord = evidence.appRecord ?? {};
const metadataEvidence = evidence.metadata ?? {};
const privacyLabels = evidence.privacyLabels ?? {};
const ageRating = evidence.ageRating ?? {};
const regulatedMedicalDevice = evidence.regulatedMedicalDevice ?? {};
const exportCompliance = evidence.exportCompliance ?? {};
const build = evidence.build ?? {};
const reviewNotes = evidence.reviewNotes ?? {};
const screenshots = evidence.screenshots ?? {};
const accessibilityNutritionLabels = evidence.accessibilityNutritionLabels ?? {};

const items = [
  {
    group: "App Store Connect",
    key: "appStoreConnect.appRecordCreated",
    value: appRecord.created,
    ready:
      appRecord.created === true &&
      appRecord.bundleId === expected.bundleId &&
      appRecord.sku === expected.sku &&
      appRecord.platform === expected.platform &&
      text(appRecord.confirmedAt) &&
      text(appRecord.confirmedBy),
    next: "Create the App Store Connect app record for bundle ID com.jeremyswisher.uclasportsmri and SKU ucla-sports-mri-ios.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.metadataEntered",
    value: metadataEvidence.entered,
    ready:
      metadataEvidence.entered === true &&
      metadataEvidence.source === "ios/AppStoreConnectMetadata.json" &&
      metadataSourceReady &&
      text(metadataEvidence.enteredAt) &&
      text(metadataEvidence.confirmedBy),
    next: "Enter the validated metadata from ios/AppStoreConnectMetadata.json, then record enteredAt and confirmedBy.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.privacyLabelsEntered",
    value: privacyLabels.entered,
    ready:
      privacyLabels.entered === true &&
      privacyLabels.tracking === false &&
      includesAll(privacyLabels.dataLinkedToUser, ["Name", "Email Address", "User ID", "Product Interaction"]) &&
      text(privacyLabels.enteredAt) &&
      text(privacyLabels.confirmedBy),
    next: "Enter privacy labels matching the privacy manifest and metadata: no tracking; name, email, user ID, product interaction for app functionality.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.ageRatingCompleted",
    value: ageRating.completed,
    ready:
      ageRating.completed === true &&
      ageRating.recommendation === metadata.ageRatingRecommendation &&
      text(ageRating.completedAt) &&
      text(ageRating.confirmedBy),
    next: "Complete the age-rating questionnaire; use 16+ for frequent medical or treatment information in advanced medical education.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.regulatedMedicalDeviceStatusCompleted",
    value: regulatedMedicalDevice.completed,
    ready:
      regulatedMedicalDevice.completed === true &&
      regulatedMedicalDevice.isRegulatedMedicalDevice === false &&
      regulatedMedicalDevice.answer === metadata.regulatedMedicalDevice?.answer &&
      regulatedMedicalDevice.source === "ios/AppStoreConnectMetadata.json#regulatedMedicalDevice" &&
      text(regulatedMedicalDevice.completedAt) &&
      text(regulatedMedicalDevice.confirmedBy),
    next: "Declare Regulated Medical Device Status in App Store Connect as No for EU/EEA, UK, and US; then record completedAt and confirmedBy.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.exportComplianceCompleted",
    value: exportCompliance.completed,
    ready:
      exportCompliance.completed === true &&
      exportCompliance.usesNonExemptEncryption === false &&
      exportComplianceReady &&
      text(exportCompliance.completedAt) &&
      text(exportCompliance.confirmedBy),
    next: "Complete export compliance and confirm the app declares no non-exempt encryption.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.buildUploaded",
    value: build.uploaded,
    ready:
      build.uploaded === true &&
      build.version === expected.version &&
      build.build === expected.build &&
      text(build.uploadedAt) &&
      text(build.confirmedBy),
    next: "Archive and upload UCLA Sports MRI 1.0 (1) to App Store Connect/TestFlight.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.buildSelectedForVersion",
    value: build.selectedForVersion,
    ready:
      build.selectedForVersion === true &&
      build.version === expected.version &&
      build.build === expected.build &&
      text(build.selectedAt) &&
      text(build.confirmedBy),
    next: "Select the uploaded 1.0 (1) build for the App Store version.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.reviewNotesEntered",
    value: reviewNotes.entered,
    ready:
      reviewNotes.entered === true &&
      reviewNotes.source === "ios/AppStoreConnectMetadata.json#reviewNotes" &&
      metadataChecks.find((check) => check.label === "Review notes fit App Review field")?.ok === true &&
      metadata.reviewNotes?.includes("Continue in App Review demo") &&
      metadata.reviewNotes?.includes("not intended to diagnose") &&
      text(reviewNotes.enteredAt) &&
      text(reviewNotes.confirmedBy),
    next: "Enter the App Review notes from ios/AppStoreConnectMetadata.json, including demo access and medical-education disclaimer.",
  },
  {
    group: "App Store Connect",
    key: "appStoreConnect.screenshotsUploaded",
    value: screenshots.uploaded,
    ready:
      screenshots.uploaded === true &&
      screenshots.source === expected.screenshotSource &&
      screenshotEvidenceReady &&
      text(screenshots.uploadedAt) &&
      text(screenshots.confirmedBy),
    next: "Upload the verified iPhone 6.9-inch and iPad 13-inch screenshot sets from ios/screenshots/.",
  },
];

const readyCount = items.filter((item) => item.ready && !secretLeak).length;
const gateValues = items.map((item) => {
  const gateValue = item.key.split(".").reduce((current, part) => {
    if (current && typeof current === "object" && part in current) return current[part];
    return undefined;
  }, submissionGate);
  return { key: item.key, gateValue };
});

console.log("# iOS App Store Connect Evidence Report\n");
console.log("Evidence file: ios/AppStoreConnectEvidence.json");
console.log(`Last updated: ${evidence.lastUpdated ?? "unknown"}`);
console.log(`Secret scan: ${secretLeak ? "FAIL" : "PASS"}`);
if (secretLeak) {
  console.log("Next: remove App Store Connect API keys, app-specific passwords, private keys, or Apple credentials before committing.");
}
console.log("");

console.log("## Metadata Source Checks");
for (const check of metadataChecks) {
  console.log(`- ${check.ok ? "PASS" : "TODO"} ${check.label} (${check.detail})`);
}
console.log("");

console.log("## Screenshot Source Verification");
console.log(`Screenshot evidence verifier: ${screenshotEvidenceVerifierPassed ? "PASS" : "TODO"}`);
if (!screenshotEvidenceVerifierPassed) {
  const screenshotOutput = `${screenshotEvidenceVerification.stdout ?? ""}\n${screenshotEvidenceVerification.stderr ?? ""}`;
  console.log(`First screenshot evidence issue: ${firstUsefulFailure(screenshotOutput)}`);
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

console.log("## Copy-Paste Packet");
console.log("Prerequisites: latest Paid Apps/Developer Program agreement accepted; role Account Holder, App Manager, or Admin.");
console.log(`Name: ${metadata.name}`);
console.log(`Primary language: ${metadata.primaryLanguage}`);
console.log("User access: Full Access");
console.log(`Subtitle: ${metadata.subtitle}`);
console.log(`SKU: ${metadata.sku}`);
console.log(`Bundle ID: ${metadata.bundleId}`);
console.log(`Version/build: ${metadata.version} (${metadata.build})`);
console.log(`Categories: ${metadata.primaryCategory}; ${metadata.secondaryCategory}`);
console.log(`Price: ${metadata.price}`);
console.log(`Age rating: ${metadata.ageRatingRecommendation} (${metadata.ageRatingBasis?.appleAnswer ?? "medical education"})`);
console.log(`Regulated medical device: ${metadata.regulatedMedicalDevice?.answer ?? "No"} (${metadata.regulatedMedicalDevice?.rationale ?? "educational only"})`);
console.log(`Keywords (${keywords.length}/${limits.keywordsMax}): ${keywords}`);
console.log(`Support URL: ${metadata.supportUrl}`);
console.log(`Privacy Policy URL: ${metadata.privacyPolicyUrl}`);
console.log(`Accessibility URL: ${metadata.accessibilityUrl}`);
console.log(`Review notes: ios/AppStoreConnectMetadata.json#reviewNotes (${byteLength(metadata.reviewNotes)} bytes)`);
console.log("What's New: initial 1.0 release; only paste if App Store Connect asks for it.");
console.log("");

console.log("## Optional Accessibility Nutrition Labels");
console.log(`Accessibility URL entered: ${accessibilityNutritionLabels.accessibilityUrlEntered === true ? "yes" : "no"}`);
console.log(`Label responses entered: ${accessibilityNutritionLabels.labelResponsesEntered === true ? "yes" : "no"}`);
console.log(`Source: ${accessibilityNutritionLabels.source ?? "missing"}`);
console.log("Do not claim specific accessibility label support until common tasks are tested on each supported device.");
console.log("");

console.log("## Submission Gate Alignment");
for (const { key, gateValue } of gateValues) {
  console.log(`- ${gateValue === true ? "PASS" : "TODO"} ${key} in ios/AppStoreSubmissionGate.json`);
}
console.log("");

console.log(`Ready App Store Connect gates: ${secretLeak ? 0 : readyCount}/${items.length}`);
for (const item of items) {
  console.log(`- ${item.ready && !secretLeak ? "PASS" : "TODO"} ${item.key}`);
}
console.log("");

if (!secretLeak && metadataSourceReady && readyCount === items.length) {
  console.log("All App Store Connect evidence is ready. You may set the matching appStoreConnect gates to true in ios/AppStoreSubmissionGate.json.");
} else {
  console.log("Do not set App Store Connect gates to true yet. Run npm run asc:ios:evidence:verify after App Store Connect entry/upload is complete.");
}

if (verify && (secretLeak || !metadataSourceReady || readyCount !== items.length)) {
  console.error("\nApp Store Connect evidence verification failed.");
  process.exit(1);
}
