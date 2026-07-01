import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("iOS evidence audit", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const readme = readFileSync("ios/README.md", "utf8");
  const auditScript = readFileSync("scripts/ios-evidence-audit.mjs", "utf8");
  const preflight = readFileSync("scripts/ios-app-store-preflight.mjs", "utf8");
  const gateReport = readFileSync("scripts/ios-gate-report.mjs", "utf8");

  it("exposes and documents the consolidated evidence audit", () => {
    expect(packageJson).toContain('"evidence:ios": "node scripts/ios-evidence-audit.mjs"');
    expect(packageJson).toContain('"evidence:ios:verify": "node scripts/ios-evidence-audit.mjs --verify"');
    expect(handoff).toContain("npm run evidence:ios");
    expect(readme).toContain("npm run evidence:ios");
    expect(preflight).toContain("Evidence audit script exists");
    expect(gateReport).toContain("npm run evidence:ios");
  });

  it("runs every evidence report needed before App Store submission", () => {
    for (const script of [
      "scripts/ios-archive.mjs",
      "scripts/ios-auth-evidence.mjs",
      "scripts/ios-release-evidence.mjs",
      "scripts/ios-screenshot-evidence.mjs",
      "scripts/ios-app-store-connect-evidence.mjs",
      "scripts/ios-gate-report.mjs",
    ]) {
      expect(auditScript).toContain(script);
    }

    expect(auditScript).toContain("App Store export signing ready");
    expect(auditScript).toContain("readyPattern: /^App Store export signing ready: yes$/m");
    expect(auditScript).toContain("App Store Connect access for Team X578T4K65B");
    expect(auditScript).toContain("Apple/Firebase auth gates");
    expect(auditScript).toContain("Real-device/account-deletion gates");
    expect(auditScript).toContain("Ready screenshot gates");
    expect(auditScript).toContain("Ready App Store Connect gates");
    expect(auditScript).toContain("Ready for App Review submission");
  });

  it("can print a non-failing consolidated readiness report", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-evidence-audit.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain("iOS Evidence Audit");
    expect(output).toContain("Archive/export signing");
    expect(output).toContain("Apple/Firebase auth evidence");
    expect(output).toContain("Real-device/account-deletion evidence");
    expect(output).toContain("App Store Connect evidence");
    expect(output).toContain("Suggested Order");
    expect(output).toContain("Audited groups ready:");
  });
});
