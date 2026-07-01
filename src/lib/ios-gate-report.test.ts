import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const APPLE_TEAM_ID = "X578T4K65B";
const BUNDLE_ID = "com.jeremyswisher.uclasportsmri";
const FIREBASE_PROJECT_ID = "ucla-knee-mri";
const APPLE_SERVICE_ID = "com.jeremyswisher.uclasportsmri.web";
const PRIMARY_RETURN_URL = "https://ucla-knee-mri.firebaseapp.com/__/auth/handler";
const SECONDARY_AUTH_HANDLER = "https://ucla-knee-mri.web.app/__/auth/handler";
const AUTHORIZED_DOMAINS = ["ucla-knee-mri.firebaseapp.com", "ucla-knee-mri.web.app"];

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function valueForPath(source: unknown, dottedPath: string): unknown {
  return dottedPath.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

describe("iOS App Store gate report", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const submissionGateScript = readFileSync("scripts/ios-submission-gate.mjs", "utf8");
  const gateReportScript = readFileSync("scripts/ios-gate-report.mjs", "utf8");
  const gate = readJson<Record<string, unknown>>("ios/AppStoreSubmissionGate.json");
  const requiredKeys = Array.from(submissionGateScript.matchAll(/\["([^"]+)"/g), (match) => match[1]);
  const verifiedCount = requiredKeys.filter((key) => valueForPath(gate, key) === true).length;
  const missingCount = requiredKeys.length - verifiedCount;

  it("exposes and documents the readable report command", () => {
    expect(packageJson).toContain('"preflight:ios:report": "node scripts/ios-gate-report.mjs"');
    expect(handoff).toContain("npm run preflight:ios:report");
    expect(handoff).toContain("does not fail while external gates are still open");
  });

  it("covers every required hard submission gate", () => {
    expect(requiredKeys).toHaveLength(28);
    for (const key of requiredKeys) {
      expect(gateReportScript).toContain(key);
    }
    expect(gateReportScript).toContain("Archive / Export Signing");
    expect(gateReportScript).toContain("archiveExport.appStoreExportSigningReady");
    expect(gateReportScript).toContain("archiveExport.appStoreConnectAccountAccessVerified");
    expect(gateReportScript).toContain("npm run archive:ios:signing");
    expect(gateReportScript).toContain("npm run export:ios");
    expect(gateReportScript).toContain("Ready for App Review submission");
    expect(gateReportScript).toContain("appStoreConnect.submittedForReview");
    expect(gateReportScript).not.toContain("process.exit(1)");
  });

  it("prints exact Apple/Firebase portal values in the next actions", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-gate-report.mjs"], {
      encoding: "utf8",
    });

    for (const value of [
      APPLE_TEAM_ID,
      BUNDLE_ID,
      FIREBASE_PROJECT_ID,
      APPLE_SERVICE_ID,
      PRIMARY_RETURN_URL,
      SECONDARY_AUTH_HANDLER,
      ...AUTHORIZED_DOMAINS,
    ]) {
      expect(gateReportScript).toContain(value);
      expect(output).toContain(value);
    }

    expect(output).toContain(`Create Apple Services ID ${APPLE_SERVICE_ID}`);
    expect(output).toContain(`set Primary App ID ${BUNDLE_ID}`);
    expect(output).toContain(`Firebase Authentication project ${FIREBASE_PROJECT_ID}`);
  });

  it("keeps the hard submission gate tied to detailed evidence verifiers", () => {
    expect(handoff).toContain("runs the detailed evidence verifiers");
    expect(handoff).toContain("reruns the live Firebase Hosting readiness check");
    expect(handoff).toContain("App Store export signing ready: yes");
    expect(submissionGateScript).toContain("Detailed evidence verification");
    expect(submissionGateScript).toContain("scripts/ios-archive.mjs --signing");
    expect(submissionGateScript).toContain("^App Store export signing ready: yes$");
    expect(submissionGateScript).toContain("scripts/ios-auth-evidence.mjs --verify");
    expect(submissionGateScript).toContain("scripts/ios-live-readiness.mjs");
    expect(submissionGateScript).toContain("live iOS App Store readiness checks passed");
    expect(submissionGateScript).toContain("scripts/ios-release-evidence.mjs --verify");
    expect(submissionGateScript).toContain("scripts/ios-screenshot-evidence.mjs --verify");
    expect(submissionGateScript).toContain("scripts/ios-app-store-connect-evidence.mjs --verify");
  });

  it("prints counts that match the current gate evidence", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-gate-report.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain(`Verified: ${verifiedCount}/${requiredKeys.length}`);
    expect(output).toContain(`Missing: ${missingCount}/${requiredKeys.length}`);
    expect(output).toContain(`Ready for App Review submission: ${missingCount === 0 ? "yes" : "no"}`);
  });
});
