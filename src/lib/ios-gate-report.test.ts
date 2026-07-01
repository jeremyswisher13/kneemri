import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

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

  it("keeps the hard submission gate tied to detailed evidence verifiers", () => {
    expect(handoff).toContain("runs the detailed evidence verifiers");
    expect(handoff).toContain("App Store export signing ready: yes");
    expect(submissionGateScript).toContain("Detailed evidence verification");
    expect(submissionGateScript).toContain("scripts/ios-archive.mjs --signing");
    expect(submissionGateScript).toContain("^App Store export signing ready: yes$");
    expect(submissionGateScript).toContain("scripts/ios-auth-evidence.mjs --verify");
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
