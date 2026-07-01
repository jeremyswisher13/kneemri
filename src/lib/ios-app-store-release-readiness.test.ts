import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type AppStoreReleaseEvidence = {
  submission: {
    submittedForReview: boolean;
    version: string;
    build: string;
  };
  review: {
    approvedForRelease: boolean;
    status: string;
  };
  availability: {
    releasedToAppStore: boolean;
    publicStorePageVerified: boolean;
    appStoreUrl: string;
    version: string;
  };
};

describe("iOS App Store release evidence readiness", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const readme = readFileSync("ios/README.md", "utf8");
  const preflight = readFileSync("scripts/ios-app-store-preflight.mjs", "utf8");
  const auditScript = readFileSync("scripts/ios-evidence-audit.mjs", "utf8");
  const evidenceScript = readFileSync("scripts/ios-app-store-release-evidence.mjs", "utf8");
  const evidence = JSON.parse(readFileSync("ios/AppStoreReleaseEvidence.json", "utf8")) as AppStoreReleaseEvidence;

  it("documents and exposes the post-submission release evidence commands", () => {
    expect(packageJson).toContain('"store:ios:evidence": "node scripts/ios-app-store-release-evidence.mjs"');
    expect(packageJson).toContain('"store:ios:evidence:verify": "node scripts/ios-app-store-release-evidence.mjs --verify"');
    expect(handoff).toContain("npm run store:ios:evidence:verify");
    expect(handoff).toContain("ios/AppStoreReleaseEvidence.json");
    expect(readme).toContain("npm run store:ios:evidence");
    expect(preflight).toContain("App Store release evidence JSON exists");
    expect(preflight).toContain("App Store release evidence script exists");
  });

  it("requires submission, approval, and public App Store availability evidence", () => {
    for (const key of [
      "appStoreRelease.submittedForReview",
      "appStoreRelease.approvedForRelease",
      "appStoreRelease.publicStorePageVerified",
    ]) {
      expect(evidenceScript).toContain(key);
    }

    expect(evidenceScript).toContain("apps.apple.com");
    expect(evidenceScript).toContain("Ready App Store release gates");
    expect(auditScript).toContain("scripts/ios-app-store-release-evidence.mjs");
    expect(auditScript).toContain("App Store release evidence");
    expect(auditScript).toContain("Ready App Store release gates");
    expect(evidence.submission.version).toBe("1.0");
    expect(evidence.submission.build).toBe("1");
    expect(evidence.availability.version).toBe("1.0");
  });

  it("starts as incomplete until external App Review and public listing evidence exists", () => {
    expect(evidence.submission.submittedForReview).toBe(false);
    expect(evidence.review.approvedForRelease).toBe(false);
    expect(evidence.review.status).toBe("");
    expect(evidence.availability.releasedToAppStore).toBe(false);
    expect(evidence.availability.publicStorePageVerified).toBe(false);
    expect(evidence.availability.appStoreUrl).toBe("");
  });

  it("can print a non-failing post-submission release evidence report", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-app-store-release-evidence.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain("iOS App Store Release Evidence Report");
    expect(output).toContain("Ready App Store release gates:");
    expect(output).toContain("Do not mark the overall App Store goal complete yet");
  });
});
