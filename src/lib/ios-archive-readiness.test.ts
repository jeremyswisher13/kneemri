import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("iOS archive readiness", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const archiveHelper = readFileSync("scripts/ios-archive.mjs", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const readme = readFileSync("ios/README.md", "utf8");

  it("exposes and documents the Release signing report", () => {
    expect(packageJson).toContain('"archive:ios:signing": "node scripts/ios-archive.mjs --signing"');
    expect(handoff).toContain("npm run archive:ios:signing");
    expect(readme).toContain("npm run archive:ios:signing");
  });

  it("keeps command-line archives in local ignored build output", () => {
    expect(archiveHelper).toContain("IOS_DERIVED_DATA_PATH");
    expect(archiveHelper).toContain('join(root, "ios", "build", "DerivedData")');
    expect(archiveHelper).toContain("-derivedDataPath");
  });

  it("reports the signing values needed before TestFlight upload", () => {
    for (const requiredValue of [
      "PRODUCT_BUNDLE_IDENTIFIER",
      "MARKETING_VERSION",
      "CURRENT_PROJECT_VERSION",
      "CODE_SIGN_STYLE",
      "CODE_SIGN_IDENTITY",
      "DEVELOPMENT_TEAM",
      "CODE_SIGN_ENTITLEMENTS",
    ]) {
      expect(archiveHelper).toContain(requiredValue);
    }
  });

  it("auto-detects Xcode team metadata and reports local signing assets", () => {
    expect(archiveHelper).toContain("detectXcodeTeams");
    expect(archiveHelper).toContain("IDEProvisioningTeamByIdentifier");
    expect(archiveHelper).toContain("Detected Xcode team");
    expect(archiveHelper).toContain("Valid code signing identities");
    expect(archiveHelper).toContain("Provisioning profiles");
    expect(archiveHelper).toContain("Local signing assets ready");
    expect(handoff).toContain("X578T4K65B");
    expect(handoff).toContain("Local signing assets ready: no");
    expect(handoff).toContain("No Accounts");
    expect(readme).toContain("X578T4K65B");
  });
});
