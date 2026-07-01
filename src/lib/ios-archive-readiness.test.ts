import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("iOS archive readiness", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const archiveHelper = readFileSync("scripts/ios-archive.mjs", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const readme = readFileSync("ios/README.md", "utf8");
  const projectSpec = readFileSync("ios/project.yml", "utf8");
  const xcodeProject = readFileSync("ios/UCLASportsMRI.xcodeproj/project.pbxproj", "utf8");

  it("exposes and documents the Release signing report", () => {
    expect(packageJson).toContain('"archive:ios:signing": "node scripts/ios-archive.mjs --signing"');
    expect(packageJson).toContain('"archive:ios:only": "node scripts/ios-archive.mjs --archive-only"');
    expect(packageJson).toContain('"export:ios": "node scripts/ios-archive.mjs --export"');
    expect(handoff).toContain("npm run archive:ios:signing");
    expect(handoff).toContain("npm run archive:ios:only");
    expect(handoff).toContain("npm run export:ios");
    expect(readme).toContain("npm run archive:ios:signing");
    expect(readme).toContain("npm run archive:ios:only");
    expect(readme).toContain("npm run export:ios");
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
    expect(archiveHelper).toContain("Apple Distribution identities");
    expect(archiveHelper).toContain("Apple Development identities");
    expect(archiveHelper).toContain("Provisioning profiles");
    expect(archiveHelper).toContain("Decoded provisioning profiles");
    expect(archiveHelper).toContain("Matching provisioning profiles");
    expect(archiveHelper).toContain("application-identifier");
    expect(archiveHelper).toContain("Local signing assets ready");
    expect(archiveHelper).toContain("distributionIdentityReady");
    expect(archiveHelper).toContain("archiveBuild");
    expect(archiveHelper).toContain("exportArchive");
    expect(handoff).toContain("X578T4K65B");
    expect(handoff).toContain("1 Apple Distribution identity");
    expect(handoff).toContain("Failed to find an account with App Store Connect access");
    expect(handoff).toContain("current blocker is App Store Connect access");
    expect(readme).toContain("X578T4K65B");
  });

  it("pins the Apple Developer Team in both XcodeGen and generated project settings", () => {
    expect(projectSpec).toContain("DEVELOPMENT_TEAM: X578T4K65B");
    expect(xcodeProject.match(/DEVELOPMENT_TEAM = X578T4K65B;/g)).toHaveLength(2);
    expect(handoff).toContain("DEVELOPMENT_TEAM = X578T4K65B");
  });
});
