import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Metadata = {
  bundleId: string;
  sku: string;
  version: string;
  build: string;
  name: string;
  subtitle: string;
  primaryLanguage: string;
  ageRatingRecommendation: string;
  ageRatingBasis: {
    appleCategory: string;
    appleAnswer: string;
  };
  regulatedMedicalDevice: {
    declarationRequired: boolean;
    answer: string;
    rationale: string;
  };
  supportUrl: string;
  privacyPolicyUrl: string;
  accessibilityUrl: string;
  accessibilityNutritionLabels: {
    claimSupportOnlyAfterDeviceAudit: boolean;
    featuresToEvaluate: string[];
    commonTaskBasis: string[];
  };
  keywords: string[];
  description: string;
  promotionalText: string;
  whatsNew: string;
  reviewNotes: string;
  privacy: {
    tracking: boolean;
    dataLinkedToUser: string[];
    purposes: string[];
  };
};

type Evidence = {
  appRecord: { bundleId: string; sku: string; platform: string };
  metadata: { source: string };
  privacyLabels: { tracking: boolean; dataLinkedToUser: string[] };
  ageRating: { recommendation: string; basis: string };
  regulatedMedicalDevice: { isRegulatedMedicalDevice: boolean; answer: string; source: string };
  exportCompliance: { usesNonExemptEncryption: boolean; infoPlistKey: string };
  build: { version: string; build: string };
  reviewNotes: { source: string };
  screenshots: { source: string };
  accessibilityNutritionLabels: {
    optionalForCurrentSubmission: boolean;
    accessibilityUrl: string;
    source: string;
  };
};

type ScreenshotEvidence = {
  iphone69: { files: string[] };
  ipad13: { files: string[] };
  phiReview: { noPhiConfirmed: boolean };
};

describe("iOS App Store Connect readiness", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const readme = readFileSync("ios/README.md", "utf8");
  const metadata = JSON.parse(readFileSync("ios/AppStoreConnectMetadata.json", "utf8")) as Metadata;
  const evidence = JSON.parse(readFileSync("ios/AppStoreConnectEvidence.json", "utf8")) as Evidence;
  const screenshotEvidence = JSON.parse(readFileSync("ios/ScreenshotEvidence.json", "utf8")) as ScreenshotEvidence;
  const evidenceScript = readFileSync("scripts/ios-app-store-connect-evidence.mjs", "utf8");
  const preflight = readFileSync("scripts/ios-app-store-preflight.mjs", "utf8");
  const gateReport = readFileSync("scripts/ios-gate-report.mjs", "utf8");

  it("documents and exposes the App Store Connect evidence commands", () => {
    expect(packageJson).toContain('"asc:ios:evidence": "node scripts/ios-app-store-connect-evidence.mjs"');
    expect(packageJson).toContain('"asc:ios:evidence:verify": "node scripts/ios-app-store-connect-evidence.mjs --verify"');
    expect(handoff).toContain("npm run asc:ios:evidence:verify");
    expect(handoff).toContain("ios/AppStoreConnectEvidence.json");
    expect(handoff).toContain("Primary language: `English (U.S.)`");
    expect(handoff).toContain("User access when creating the app record: `Full Access`");
    expect(handoff).toContain("Account Holder, App Manager, or Admin");
    expect(readme).toContain("npm run asc:ios:evidence");
    expect(preflight).toContain("App Store Connect evidence script exists");
    expect(gateReport).toContain("npm run asc:ios:evidence");
  });

  it("keeps the metadata within App Store Connect field limits", () => {
    const keywords = metadata.keywords.join(", ");

    expect(metadata.bundleId).toBe("com.jeremyswisher.uclasportsmri");
    expect(metadata.sku).toBe("ucla-sports-mri-ios");
    expect(metadata.version).toBe("1.0");
    expect(metadata.build).toBe("1");
    expect(metadata.name.length).toBeGreaterThanOrEqual(2);
    expect(metadata.name.length).toBeLessThanOrEqual(30);
    expect(metadata.subtitle.length).toBeLessThanOrEqual(30);
    expect(metadata.primaryLanguage).toBe("English (U.S.)");
    expect(metadata.ageRatingRecommendation).toBe("16+");
    expect(metadata.ageRatingBasis.appleCategory).toBe("Medical or Wellness");
    expect(metadata.ageRatingBasis.appleAnswer).toBe("Frequent medical or treatment information");
    expect(metadata.regulatedMedicalDevice.declarationRequired).toBe(true);
    expect(metadata.regulatedMedicalDevice.answer).toBe("No");
    expect(metadata.regulatedMedicalDevice.rationale).toContain("educational only");
    expect(keywords.length).toBeLessThanOrEqual(100);
    expect(metadata.supportUrl).toBe("https://ucla-knee-mri.firebaseapp.com/support");
    expect(metadata.privacyPolicyUrl).toBe("https://ucla-knee-mri.firebaseapp.com/privacy");
    expect(metadata.accessibilityUrl).toBe("https://ucla-knee-mri.firebaseapp.com/accessibility");
    expect(metadata.accessibilityNutritionLabels.claimSupportOnlyAfterDeviceAudit).toBe(true);
    expect(metadata.accessibilityNutritionLabels.featuresToEvaluate).toEqual(expect.arrayContaining(["VoiceOver", "Voice Control", "Larger Text"]));
    expect(metadata.accessibilityNutritionLabels.commonTaskBasis).toEqual(expect.arrayContaining(["Choose a course"]));
    expect(metadata.reviewNotes).toContain("Continue in App Review demo");
    expect(metadata.reviewNotes).toContain("not intended to diagnose");
    expect(Buffer.byteLength(metadata.reviewNotes, "utf8")).toBeLessThanOrEqual(4000);
  });

  it("maps evidence fields to every App Store Connect submission gate", () => {
    for (const key of [
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
    ]) {
      expect(evidenceScript).toContain(key);
      expect(gateReport).toContain(key);
    }

    expect(evidenceScript).toContain("scripts/ios-screenshot-evidence.mjs");
    expect(evidenceScript).toContain("--verify");
    expect(evidenceScript).toContain("screenshotEvidenceVerifierPassed");
    expect(evidenceScript).toContain("Screenshot Upload Packet");
    expect(evidenceScript).toContain("ios/screenshots/iphone-6-9");
    expect(evidenceScript).toContain("ios/screenshots/ipad-13");
    expect(evidenceScript).toContain("MARKETING_VERSION");
    expect(evidenceScript).toContain("CURRENT_PROJECT_VERSION");
    expect(evidence.appRecord.bundleId).toBe(metadata.bundleId);
    expect(evidence.appRecord.sku).toBe(metadata.sku);
    expect(evidence.appRecord.platform).toBe("iOS");
    expect(evidence.metadata.source).toBe("ios/AppStoreConnectMetadata.json");
    expect(evidence.privacyLabels.tracking).toBe(false);
    expect(evidence.privacyLabels.dataLinkedToUser).toEqual(expect.arrayContaining(metadata.privacy.dataLinkedToUser));
    expect(evidence.ageRating.recommendation).toBe(metadata.ageRatingRecommendation);
    expect(evidence.ageRating.basis).toBe(metadata.ageRatingBasis.appleAnswer);
    expect(evidence.regulatedMedicalDevice.isRegulatedMedicalDevice).toBe(false);
    expect(evidence.regulatedMedicalDevice.answer).toBe(metadata.regulatedMedicalDevice.answer);
    expect(evidence.regulatedMedicalDevice.source).toBe("ios/AppStoreConnectMetadata.json#regulatedMedicalDevice");
    expect(evidence.exportCompliance.usesNonExemptEncryption).toBe(false);
    expect(evidence.exportCompliance.infoPlistKey).toBe("ITSAppUsesNonExemptEncryption");
    expect(evidence.build.version).toBe(metadata.version);
    expect(evidence.build.build).toBe(metadata.build);
    expect(evidence.reviewNotes.source).toBe("ios/AppStoreConnectMetadata.json#reviewNotes");
    expect(evidence.screenshots.source).toBe("ios/ScreenshotEvidence.json");
    expect(evidence.accessibilityNutritionLabels.optionalForCurrentSubmission).toBe(true);
    expect(evidence.accessibilityNutritionLabels.accessibilityUrl).toBe(metadata.accessibilityUrl);
    expect(evidence.accessibilityNutritionLabels.source).toBe("ios/AppStoreConnectMetadata.json#accessibilityNutritionLabels");
  });

  it("can report App Store Connect evidence status before external entry is complete", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-app-store-connect-evidence.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain("iOS App Store Connect Evidence Report");
    expect(output).toContain("Metadata Source Checks");
    expect(output).toContain("Screenshot Source Verification");
    expect(output).toContain("Screenshot evidence verifier:");
    expect(output).toContain("Copy-Paste Packet");
    expect(output).toContain("Portal Text Fields");
    expect(output).toContain("Privacy Label Answers");
    expect(output).toContain("-----BEGIN Description-----");
    expect(output).toContain(metadata.description);
    expect(output).toContain("-----BEGIN Promotional Text-----");
    expect(output).toContain(metadata.promotionalText);
    expect(output).toContain("-----BEGIN What's New-----");
    expect(output).toContain(metadata.whatsNew);
    expect(output).toContain("-----BEGIN App Review Notes-----");
    expect(output).toContain(metadata.reviewNotes);
    expect(output).toContain(`Tracking: ${metadata.privacy.tracking ? "Yes" : "No"}`);
    expect(output).toContain(`Data linked to user: ${metadata.privacy.dataLinkedToUser.join(", ")}`);
    expect(output).toContain(`Purpose: ${metadata.privacy.purposes.join(", ")}`);
    expect(output).toContain("Screenshot Upload Packet");
    expect(output).toContain("iPhone 6.9-inch folder: ios/screenshots/iphone-6-9");
    expect(output).toContain("iPad 13-inch folder: ios/screenshots/ipad-13");
    expect(output).toContain(`iPhone 6.9-inch files (${screenshotEvidence.iphone69.files.length}):`);
    expect(output).toContain(`iPad 13-inch files (${screenshotEvidence.ipad13.files.length}):`);
    for (const filename of [...screenshotEvidence.iphone69.files, ...screenshotEvidence.ipad13.files]) {
      expect(output).toContain(filename);
    }
    expect(output).toContain(`No-PHI review: ${screenshotEvidence.phiReview.noPhiConfirmed ? "PASS" : "TODO"}`);
    expect(output).toContain("latest Paid Apps/Developer Program agreement accepted");
    expect(output).toContain("role Account Holder, App Manager, or Admin");
    expect(output).toContain("Primary language: English (U.S.)");
    expect(output).toContain("User access: Full Access");
    expect(output).toContain("Optional Accessibility Nutrition Labels");
    expect(output).toContain("Ready App Store Connect gates:");
  });
});
