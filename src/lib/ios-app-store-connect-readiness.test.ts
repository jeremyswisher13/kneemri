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
  supportUrl: string;
  privacyPolicyUrl: string;
  keywords: string[];
  reviewNotes: string;
  privacy: {
    tracking: boolean;
    dataLinkedToUser: string[];
  };
};

type Evidence = {
  appRecord: { bundleId: string; sku: string; platform: string };
  metadata: { source: string };
  privacyLabels: { tracking: boolean; dataLinkedToUser: string[] };
  ageRating: { recommendation: string };
  exportCompliance: { usesNonExemptEncryption: boolean; infoPlistKey: string };
  build: { version: string; build: string };
  reviewNotes: { source: string };
  screenshots: { source: string };
};

describe("iOS App Store Connect readiness", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const readme = readFileSync("ios/README.md", "utf8");
  const metadata = JSON.parse(readFileSync("ios/AppStoreConnectMetadata.json", "utf8")) as Metadata;
  const evidence = JSON.parse(readFileSync("ios/AppStoreConnectEvidence.json", "utf8")) as Evidence;
  const evidenceScript = readFileSync("scripts/ios-app-store-connect-evidence.mjs", "utf8");
  const preflight = readFileSync("scripts/ios-app-store-preflight.mjs", "utf8");
  const gateReport = readFileSync("scripts/ios-gate-report.mjs", "utf8");

  it("documents and exposes the App Store Connect evidence commands", () => {
    expect(packageJson).toContain('"asc:ios:evidence": "node scripts/ios-app-store-connect-evidence.mjs"');
    expect(packageJson).toContain('"asc:ios:evidence:verify": "node scripts/ios-app-store-connect-evidence.mjs --verify"');
    expect(handoff).toContain("npm run asc:ios:evidence:verify");
    expect(handoff).toContain("ios/AppStoreConnectEvidence.json");
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
    expect(keywords.length).toBeLessThanOrEqual(100);
    expect(metadata.supportUrl).toBe("https://ucla-knee-mri.firebaseapp.com/support");
    expect(metadata.privacyPolicyUrl).toBe("https://ucla-knee-mri.firebaseapp.com/privacy");
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
      "appStoreConnect.exportComplianceCompleted",
      "appStoreConnect.buildUploaded",
      "appStoreConnect.buildSelectedForVersion",
      "appStoreConnect.reviewNotesEntered",
      "appStoreConnect.screenshotsUploaded",
    ]) {
      expect(evidenceScript).toContain(key);
      expect(gateReport).toContain(key);
    }

    expect(evidence.appRecord.bundleId).toBe(metadata.bundleId);
    expect(evidence.appRecord.sku).toBe(metadata.sku);
    expect(evidence.appRecord.platform).toBe("iOS");
    expect(evidence.metadata.source).toBe("ios/AppStoreConnectMetadata.json");
    expect(evidence.privacyLabels.tracking).toBe(false);
    expect(evidence.privacyLabels.dataLinkedToUser).toEqual(expect.arrayContaining(metadata.privacy.dataLinkedToUser));
    expect(evidence.ageRating.recommendation).toBe("17+");
    expect(evidence.exportCompliance.usesNonExemptEncryption).toBe(false);
    expect(evidence.exportCompliance.infoPlistKey).toBe("ITSAppUsesNonExemptEncryption");
    expect(evidence.build.version).toBe(metadata.version);
    expect(evidence.build.build).toBe(metadata.build);
    expect(evidence.reviewNotes.source).toBe("ios/AppStoreConnectMetadata.json#reviewNotes");
    expect(evidence.screenshots.source).toBe("ios/ScreenshotEvidence.json");
  });

  it("can report App Store Connect evidence status before external entry is complete", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-app-store-connect-evidence.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain("iOS App Store Connect Evidence Report");
    expect(output).toContain("Metadata Source Checks");
    expect(output).toContain("Copy-Paste Packet");
    expect(output).toContain("Ready App Store Connect gates:");
  });
});
