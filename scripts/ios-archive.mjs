import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const projectPath = join(root, "ios", "UCLASportsMRI.xcodeproj");
const exportOptionsPath = join(root, "ios", "ExportOptions.plist");
const archivePath = process.env.IOS_ARCHIVE_PATH || join(root, "ios", "build", "UCLASportsMRI.xcarchive");
const exportPath = process.env.IOS_EXPORT_PATH || join(root, "ios", "build", "export");
const derivedDataPath = process.env.IOS_DERIVED_DATA_PATH || join(root, "ios", "build", "DerivedData");
const mode = process.argv.includes("--archive")
  ? "archive"
  : process.argv.includes("--archive-only")
    ? "archive-only"
    : process.argv.includes("--export")
      ? "export"
      : process.argv.includes("--signing")
        ? "signing"
        : "check";
const xcodeProvisioningProfilesPath = join(homedir(), "Library", "Developer", "Xcode", "UserData", "Provisioning Profiles");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    ...options,
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runCaptured(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    if (result.stdout) console.error(result.stdout.trim());
    if (result.stderr) console.error(result.stderr.trim());
    process.exit(result.status ?? 1);
  }
  return result.stdout;
}

function runCapturedOptional(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
  });
  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`,
  };
}

function diagnoseExportFailure(output) {
  const distributionLogPath = output.match(/Created bundle at path "([^"]+\.xcdistributionlogs)"/)?.[1];
  const standardLogPath = distributionLogPath ? join(distributionLogPath, "IDEDistribution.standard.log") : "";
  const standardLog = standardLogPath && existsSync(standardLogPath) ? readFileSync(standardLogPath, "utf8") : "";
  const combined = `${output}\n${standardLog}`;
  const actionableLine = combined
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(
      (line) =>
        line.includes("Failed to find an account with App Store Connect access") ||
        line.includes("No profiles for") ||
        line.includes("No Accounts"),
    );

  console.error("\nExport diagnosis:");
  if (actionableLine) {
    console.error(actionableLine);
  }
  if (combined.includes("Failed to find an account with App Store Connect access")) {
    console.error("Next: open Xcode > Settings > Accounts and confirm the signed-in Apple ID has App Store Connect access for Team X578T4K65B.");
    console.error("Required upload role: Account Holder, Admin, App Manager, or Developer in App Store Connect for Team X578T4K65B.");
  }
  if (combined.includes("No profiles for")) {
    console.error("Next: create/download an App Store distribution provisioning profile for com.jeremyswisher.uclasportsmri on Team X578T4K65B.");
  }
  console.error("Then rerun npm run archive:ios:signing and npm run export:ios.");
  if (standardLogPath) {
    console.error(`Xcode distribution log: ${standardLogPath}`);
  }
}

function runExport(args) {
  const result = spawnSync("xcodebuild", args, {
    cwd: root,
    encoding: "utf8",
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    diagnoseExportFailure(`${result.stdout ?? ""}${result.stderr ?? ""}`);
    process.exit(result.status ?? 1);
  }
}

function parseBuildSettings(output) {
  const settings = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*([^=]+?)\s=\s(.*)$/);
    if (match) settings.set(match[1].trim(), match[2].trim());
  }
  return settings;
}

function parseXcodeTeams(output) {
  const teams = [];
  const blocks = output.split(/\n\s*\}\s*\n/);
  for (const block of blocks) {
    const teamID = block.match(/teamID = ([A-Z0-9]+);/)?.[1];
    if (!teamID) continue;
    teams.push({
      teamID,
      teamName: block.match(/teamName = "?([^";]+)"?;/)?.[1] ?? "unknown",
      teamType: block.match(/teamType = "?([^";]+)"?;/)?.[1] ?? "unknown",
      isFreeProvisioningTeam: block.match(/isFreeProvisioningTeam = ([01]);/)?.[1] === "1",
    });
  }
  return teams;
}

function detectXcodeTeams() {
  const result = runCapturedOptional("defaults", ["read", "com.apple.dt.Xcode", "IDEProvisioningTeamByIdentifier"]);
  if (result.status !== 0) return [];
  return parseXcodeTeams(result.output);
}

function detectedDevelopmentTeam() {
  if (process.env.IOS_DEVELOPMENT_TEAM) {
    return {
      teamID: process.env.IOS_DEVELOPMENT_TEAM,
      teamName: "from IOS_DEVELOPMENT_TEAM",
      teamType: "environment",
      isFreeProvisioningTeam: false,
      source: "environment",
    };
  }

  const paidTeams = detectXcodeTeams().filter((team) => !team.isFreeProvisioningTeam);
  if (paidTeams.length !== 1) return null;
  return { ...paidTeams[0], source: "Xcode Accounts defaults" };
}

function signingIdentitySummary() {
  const result = runCapturedOptional("security", ["find-identity", "-v", "-p", "codesigning"]);
  const identityLines = result.output
    .split(/\r?\n/)
    .filter((line) => /^\s*\d+\)/.test(line));
  const validCount = Number(result.output.match(/(\d+) valid identities found/)?.[1] ?? 0);
  return {
    validCount,
    distributionCount: identityLines.filter((line) => /Apple Distribution|iPhone Distribution/.test(line)).length,
    developmentCount: identityLines.filter((line) => /Apple Development|iPhone Developer/.test(line)).length,
    available: result.status === 0,
  };
}

function printSigningIdentityVisibilityWarning(identitySummary, profileSummary) {
  if (!identitySummary.available) {
    console.log("Warning: the signing identity probe could not read code-signing identities from the keychain.");
    console.log("Rerun npm run archive:ios:signing from a normal Terminal/Xcode session before creating or replacing certificates.");
    return;
  }

  if (identitySummary.validCount === 0 && profileSummary.count > 0) {
    console.log("Warning: no code-signing identities were visible to this process, even though provisioning profiles are installed.");
    console.log("If Xcode shows Apple certificates, rerun npm run archive:ios:signing with full keychain access before changing certificates.");
  }
}

function xmlValue(plist, key) {
  return plist.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]+)</string>`))?.[1] ?? "";
}

function xmlDateValue(plist, key) {
  return plist.match(new RegExp(`<key>${key}</key>\\s*<date>([^<]+)</date>`))?.[1] ?? "";
}

function xmlBoolValue(plist, key) {
  const match = plist.match(new RegExp(`<key>${key}</key>\\s*<(true|false)\\s*/?>`));
  if (!match) return null;
  return match[1] === "true";
}

function xmlArrayValues(plist, key) {
  const body = plist.match(new RegExp(`<key>${key}</key>\\s*<array>([\\s\\S]*?)</array>`))?.[1] ?? "";
  return Array.from(body.matchAll(/<string>([^<]+)<\/string>/g), (match) => match[1]);
}

function decodeProvisioningProfile(filePath) {
  const openssl = runCapturedOptional("openssl", ["smime", "-inform", "DER", "-verify", "-noverify", "-in", filePath]);
  if (openssl.status !== 0) return null;
  const plistStart = openssl.output.indexOf("<?xml");
  const plistEnd = openssl.output.lastIndexOf("</plist>");
  if (plistStart < 0 || plistEnd < 0) return null;

  const plist = openssl.output.slice(plistStart, plistEnd + "</plist>".length);
  const applicationIdentifier = xmlValue(plist, "application-identifier");
  const teamIdentifiers = xmlArrayValues(plist, "TeamIdentifier");
  const teamId = teamIdentifiers[0] ?? applicationIdentifier.split(".")[0] ?? "";
  const bundleId = applicationIdentifier.startsWith(`${teamId}.`)
    ? applicationIdentifier.slice(teamId.length + 1)
    : applicationIdentifier;
  const getTaskAllow = xmlBoolValue(plist, "get-task-allow");
  const hasProvisionedDevices = plist.includes("<key>ProvisionedDevices</key>");

  return {
    filePath,
    uuid: xmlValue(plist, "UUID"),
    name: xmlValue(plist, "Name"),
    teamId,
    teamName: xmlValue(plist, "TeamName"),
    bundleId,
    expirationDate: xmlDateValue(plist, "ExpirationDate"),
    getTaskAllow,
    hasProvisionedDevices,
    isAppStoreProfile: getTaskAllow === false && !hasProvisionedDevices,
  };
}

function provisioningProfileSummary(targetBundleId = "", targetTeamId = "") {
  if (!existsSync(xcodeProvisioningProfilesPath)) {
    return {
      count: 0,
      decodedCount: 0,
      decodeFailureCount: 0,
      matching: [],
      path: xcodeProvisioningProfilesPath,
    };
  }

  const files = readdirSync(xcodeProvisioningProfilesPath)
    .filter((filename) => filename.endsWith(".mobileprovision"))
    .map((filename) => join(xcodeProvisioningProfilesPath, filename));
  const decoded = files
    .map((filePath) => decodeProvisioningProfile(filePath))
    .filter((profile) => profile !== null);
  const matching = decoded.filter(
    (profile) =>
      profile.bundleId === targetBundleId &&
      (!targetTeamId || profile.teamId === targetTeamId),
  );
  const matchingAppStore = matching.filter((profile) => profile.isAppStoreProfile);

  return {
    count: files.length,
    decodedCount: decoded.length,
    decodeFailureCount: files.length - decoded.length,
    matching,
    matchingAppStore,
    path: xcodeProvisioningProfilesPath,
  };
}

function ensureFile(label, filePath) {
  if (!existsSync(filePath)) {
    console.error(`Missing ${label}: ${filePath}`);
    process.exit(1);
  }
  console.log(`PASS ${label}: ${filePath}`);
}

function baseArchiveArgs() {
  const team = detectedDevelopmentTeam();
  const args = [
    "archive",
    "-project",
    projectPath,
    "-scheme",
    "UCLASportsMRI",
    "-configuration",
    "Release",
    "-destination",
    "generic/platform=iOS",
    "-archivePath",
    archivePath,
    "-derivedDataPath",
    derivedDataPath,
    "-allowProvisioningUpdates",
  ];

  if (team?.teamID) {
    args.push(`DEVELOPMENT_TEAM=${team.teamID}`);
  }
  return args;
}

function buildSettingsArgs() {
  const team = detectedDevelopmentTeam();
  const args = [
    "-showBuildSettings",
    "-project",
    projectPath,
    "-scheme",
    "UCLASportsMRI",
    "-configuration",
    "Release",
    "-destination",
    "generic/platform=iOS",
    "-derivedDataPath",
    derivedDataPath,
  ];

  if (team?.teamID) {
    args.push(`DEVELOPMENT_TEAM=${team.teamID}`);
  }
  return args;
}

function archiveBuild() {
  mkdirSync(dirname(archivePath), { recursive: true });
  mkdirSync(derivedDataPath, { recursive: true });
  rmSync(archivePath, { recursive: true, force: true });

  console.log("\nArchiving Release build for iOS...");
  run("xcodebuild", baseArchiveArgs());
  console.log(`\nArchive complete: ${archivePath}`);
}

function exportArchive() {
  ensureFile("archive metadata", join(archivePath, "Info.plist"));
  mkdirSync(dirname(exportPath), { recursive: true });
  rmSync(exportPath, { recursive: true, force: true });

  console.log("\nExporting archive for App Store Connect upload...");
  runExport([
    "-exportArchive",
    "-archivePath",
    archivePath,
    "-exportOptionsPlist",
    exportOptionsPath,
    "-exportPath",
    exportPath,
    "-allowProvisioningUpdates",
  ]);

  console.log(`\nExport output: ${exportPath}`);
}

function printSigningReport() {
  console.log("\nChecking Release signing settings...");
  mkdirSync(derivedDataPath, { recursive: true });
  const detectedTeam = detectedDevelopmentTeam();
  const identitySummary = signingIdentitySummary();
  const settings = parseBuildSettings(runCaptured("xcodebuild", buildSettingsArgs()));
  const developmentTeam = settings.get("DEVELOPMENT_TEAM") || detectedTeam?.teamID || "";
  const bundleId = settings.get("PRODUCT_BUNDLE_IDENTIFIER") ?? "";
  const profileSummary = provisioningProfileSummary(bundleId, developmentTeam);
  const rows = [
    ["Bundle ID", bundleId],
    ["Version", settings.get("MARKETING_VERSION")],
    ["Build", settings.get("CURRENT_PROJECT_VERSION")],
    ["Code signing style", settings.get("CODE_SIGN_STYLE")],
    ["Code signing identity", settings.get("CODE_SIGN_IDENTITY")],
    ["Development team", developmentTeam || "missing"],
    [
      "Detected Xcode team",
      detectedTeam
        ? `${detectedTeam.teamName} (${detectedTeam.teamID}, ${detectedTeam.teamType}; ${detectedTeam.source})`
        : "missing",
    ],
    ["Valid code signing identities", identitySummary.available ? String(identitySummary.validCount) : "unavailable"],
    ["Apple Distribution identities", identitySummary.available ? String(identitySummary.distributionCount) : "unavailable"],
    ["Apple Development identities", identitySummary.available ? String(identitySummary.developmentCount) : "unavailable"],
    ["Provisioning profiles", `${profileSummary.count} at ${profileSummary.path}`],
    ["Decoded provisioning profiles", `${profileSummary.decodedCount}/${profileSummary.count}`],
    ["Matching provisioning profiles", `${profileSummary.matching.length} for ${bundleId || "missing"}${developmentTeam ? ` / ${developmentTeam}` : ""}`],
    ["Matching App Store profiles", `${profileSummary.matchingAppStore.length} for ${bundleId || "missing"}${developmentTeam ? ` / ${developmentTeam}` : ""}`],
    ["Provisioning required", settings.get("PROVISIONING_PROFILE_REQUIRED")],
    ["Entitlements", settings.get("CODE_SIGN_ENTITLEMENTS")],
    ["DerivedData path", derivedDataPath],
  ];

  for (const [label, value] of rows) {
    console.log(`${label}: ${value || "missing"}`);
  }

  const archiveSettingsReady =
    settings.get("PRODUCT_BUNDLE_IDENTIFIER") === "com.jeremyswisher.uclasportsmri" &&
    settings.get("CODE_SIGN_STYLE") === "Automatic" &&
    settings.get("CODE_SIGN_ENTITLEMENTS") === "UCLASportsMRI/UCLASportsMRI.entitlements" &&
    !!developmentTeam;
  const distributionIdentityReady = identitySummary.distributionCount > 0;
  const matchingProfileReady = profileSummary.matching.length > 0;
  const appStoreProfileReady = profileSummary.matchingAppStore.length > 0;
  const localArchiveSigningAssetsReady = identitySummary.validCount > 0 && matchingProfileReady;
  const appStoreExportSigningReady = distributionIdentityReady && appStoreProfileReady;
  const archiveReady = archiveSettingsReady && localArchiveSigningAssetsReady;

  console.log(`\nCommand-line archive settings ready: ${archiveSettingsReady ? "yes" : "no"}`);
  console.log(`Local archive signing assets ready: ${localArchiveSigningAssetsReady ? "yes" : "no"}`);
  console.log(`App Store export signing ready: ${appStoreExportSigningReady ? "yes" : "no"}`);
  console.log(`Command-line archive signing ready: ${archiveReady ? "yes" : "no"}`);
  printSigningIdentityVisibilityWarning(identitySummary, profileSummary);
  if (profileSummary.decodeFailureCount > 0) {
    console.log(`Warning: ${profileSummary.decodeFailureCount} provisioning profile(s) could not be decoded.`);
  }
  if (profileSummary.matching.length > 0) {
    for (const profile of profileSummary.matching) {
      const profileKind = profile.isAppStoreProfile
        ? "App Store"
        : profile.getTaskAllow === true
          ? "Development"
          : profile.hasProvisionedDevices
            ? "Ad Hoc"
            : "Unknown";
      console.log(`Matching profile: ${profile.name} (${profile.uuid}); ${profileKind}; expires ${profile.expirationDate || "unknown"}`);
    }
  }
  if (!developmentTeam) {
    console.log("Next: set IOS_DEVELOPMENT_TEAM=<Apple Team ID> or select the Apple Developer Team in Xcode before archiving.");
  } else if (!distributionIdentityReady && !matchingProfileReady) {
    console.log("Next: open Xcode > Settings > Accounts, sign in or refresh Jeremy Swisher, then let Xcode create/download signing certificates and provisioning profiles for com.jeremyswisher.uclasportsmri.");
  } else if (!distributionIdentityReady) {
    console.log("Next: open Xcode > Settings > Accounts > Jeremy Swisher > Manage Certificates, then create/download an Apple Distribution certificate with its private key on this Mac.");
  } else if (!matchingProfileReady || !appStoreProfileReady) {
    console.log("Next: create/download an App Store distribution provisioning profile for com.jeremyswisher.uclasportsmri on Team X578T4K65B, then rerun npm run archive:ios:signing until App Store export signing ready: yes.");
    console.log("After that, rerun npm run export:ios from an Xcode account with App Store Connect access for Team X578T4K65B.");
  }
  console.log("Run npm run archive:ios after Apple Developer account credentials and signing assets are configured.");
}

ensureFile("Xcode project", projectPath);
ensureFile("export options", exportOptionsPath);

console.log("\nChecking Xcode installation...");
run("xcodebuild", ["-version"]);

console.log("\nChecking project schemes...");
const projectList = runCaptured("xcodebuild", ["-list", "-project", projectPath]);
if (!projectList.includes("UCLASportsMRI")) {
  console.error(projectList.trim());
  console.error("Missing UCLASportsMRI scheme in Xcode project.");
  process.exit(1);
}
console.log("PASS UCLASportsMRI scheme is visible to xcodebuild.");

if (mode === "signing") {
  printSigningReport();
  process.exit(0);
}

if (mode === "check") {
  console.log("\nArchive command is configured.");
  console.log(`DerivedData will be written to: ${derivedDataPath}`);
  const detectedTeam = detectedDevelopmentTeam();
  if (detectedTeam?.teamID) {
    console.log(`Detected Apple Developer Team: ${detectedTeam.teamName} (${detectedTeam.teamID}) from ${detectedTeam.source}.`);
  } else {
    console.log("Set IOS_DEVELOPMENT_TEAM=<Apple Team ID> if automatic signing needs an explicit team.");
  }
  console.log("Run npm run archive:ios:signing to inspect Release signing settings.");
  console.log("Run npm run archive:ios:only to create or refresh the local .xcarchive.");
  console.log("Run npm run export:ios to retry App Store Connect export/upload from the existing archive.");
  console.log("Run npm run archive:ios after Apple Developer account credentials and signing assets are configured.");
  process.exit(0);
}

if (mode === "archive-only") {
  archiveBuild();
  console.log("Run npm run export:ios after Xcode has an App Store Connect account for Team X578T4K65B.");
  process.exit(0);
}

if (mode === "export") {
  exportArchive();
  process.exit(0);
}

archiveBuild();
exportArchive();
