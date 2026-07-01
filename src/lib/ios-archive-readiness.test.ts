import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("iOS archive readiness", () => {
  const packageJson = readFileSync("package.json", "utf8");
  const archiveHelper = readFileSync("scripts/ios-archive.mjs", "utf8");
  const handoff = readFileSync("ios/AppStoreSubmission.md", "utf8");
  const exportReadiness = readFileSync("ios/AppStoreExportReadiness.md", "utf8");
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
    expect(handoff).toContain("ios/AppStoreExportReadiness.md");
    expect(readme).toContain("npm run archive:ios:signing");
    expect(readme).toContain("npm run archive:ios:only");
    expect(readme).toContain("npm run export:ios");
    expect(readme).toContain("ios/AppStoreExportReadiness.md");
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
    expect(archiveHelper).toContain("Matching App Store profiles");
    expect(archiveHelper).toContain("application-identifier");
    expect(archiveHelper).toContain("printSigningIdentityVisibilityWarning");
    expect(archiveHelper).toContain("no code-signing identities were visible to this process");
    expect(archiveHelper).toContain("with full keychain access");
    expect(archiveHelper).toContain("Local archive signing assets ready");
    expect(archiveHelper).toContain("App Store export signing ready");
    expect(archiveHelper).toContain("distributionIdentityReady");
    expect(archiveHelper).toContain("appStoreProfileReady");
    expect(archiveHelper).toContain("archiveBuild");
    expect(archiveHelper).toContain("exportArchive");
    expect(archiveHelper).toContain("diagnoseExportFailure");
    expect(archiveHelper).toContain("IDEDistribution.standard.log");
    expect(archiveHelper).toContain("Failed to find an account with App Store Connect access");
    expect(archiveHelper).toContain("Account Holder, Admin, App Manager, or Developer");
    expect(archiveHelper).toContain("IOS_ASC_API_KEY_PATH");
    expect(archiveHelper).toContain("IOS_ASC_API_KEY_ID");
    expect(archiveHelper).toContain("IOS_ASC_API_ISSUER_ID");
    expect(archiveHelper).toContain("-authenticationKeyPath");
    expect(archiveHelper).toContain("App Store Connect API key auth");
    expect(archiveHelper).toContain("No profiles for");
    expect(archiveHelper).toContain("until App Store export signing ready: yes");
    expect(archiveHelper).toContain("from an Xcode account with App Store Connect access");
    expect(archiveHelper).toContain("or with IOS_ASC_API_KEY_PATH");
    expect(handoff).toContain("X578T4K65B");
    expect(handoff).toContain("1 Apple Distribution identity");
    expect(handoff).toContain("0 matching App Store distribution profiles");
    expect(handoff).toContain("Failed to find an account with App Store Connect access");
    expect(handoff).toContain("current blocker is App Store Connect-capable Xcode account access");
    expect(handoff).toContain("Account Holder, Admin, App Manager, or Developer");
    expect(handoff).toContain("IOS_ASC_API_KEY_PATH");
    expect(handoff).toContain("out of git and out of evidence JSON files");
    expect(readme).toContain("X578T4K65B");
    expect(readme).toContain("IOS_ASC_API_KEY_PATH");
    expect(readme).toContain("out of git and out of evidence JSON files");
  });

  it("keeps an exact App Store distribution profile checklist", () => {
    expect(exportReadiness).toContain("com.jeremyswisher.uclasportsmri");
    expect(exportReadiness).toContain("X578T4K65B");
    expect(exportReadiness).toContain("App Store distribution provisioning profile");
    expect(exportReadiness).toContain("1` or higher");
    expect(exportReadiness).toContain("more than one installed matching");
    expect(exportReadiness).toContain("Two independent Apple-side blockers remain");
    expect(exportReadiness).toContain("App Store Connect access for Team `X578T4K65B`");
    expect(exportReadiness).toContain("Account Holder, Admin, App Manager, or Developer");
    expect(exportReadiness).toContain("IOS_ASC_API_KEY_PATH");
    expect(exportReadiness).toContain("IOS_ASC_API_KEY_ID");
    expect(exportReadiness).toContain("IOS_ASC_API_ISSUER_ID");
    expect(exportReadiness).toContain("must never be committed");
    expect(exportReadiness).toContain("manage-builds/upload-builds");
    expect(exportReadiness).toContain("Account Holder or Admin");
    expect(exportReadiness).toContain("create-an-app-store-provisioning-profile");
    expect(exportReadiness).toContain("role-permissions");
    expect(exportReadiness).toContain("npm run archive:ios:signing");
    expect(exportReadiness).toContain("npm run export:ios");
    expect(exportReadiness).toContain("zero code-signing identities");
    expect(exportReadiness).toContain("full keychain access");
  });

  it("pins the Apple Developer Team in both XcodeGen and generated project settings", () => {
    expect(projectSpec).toContain("DEVELOPMENT_TEAM: X578T4K65B");
    expect(xcodeProject.match(/DEVELOPMENT_TEAM = X578T4K65B;/g)).toHaveLength(2);
    expect(handoff).toContain("DEVELOPMENT_TEAM = X578T4K65B");
  });
});
