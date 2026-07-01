import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
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
  : process.argv.includes("--signing")
    ? "signing"
    : "check";

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

function parseBuildSettings(output) {
  const settings = new Map();
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^\s*([^=]+?)\s=\s(.*)$/);
    if (match) settings.set(match[1].trim(), match[2].trim());
  }
  return settings;
}

function ensureFile(label, filePath) {
  if (!existsSync(filePath)) {
    console.error(`Missing ${label}: ${filePath}`);
    process.exit(1);
  }
  console.log(`PASS ${label}: ${filePath}`);
}

function baseArchiveArgs() {
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

  if (process.env.IOS_DEVELOPMENT_TEAM) {
    args.push(`DEVELOPMENT_TEAM=${process.env.IOS_DEVELOPMENT_TEAM}`);
  }
  return args;
}

function buildSettingsArgs() {
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

  if (process.env.IOS_DEVELOPMENT_TEAM) {
    args.push(`DEVELOPMENT_TEAM=${process.env.IOS_DEVELOPMENT_TEAM}`);
  }
  return args;
}

function printSigningReport() {
  console.log("\nChecking Release signing settings...");
  mkdirSync(derivedDataPath, { recursive: true });
  const settings = parseBuildSettings(runCaptured("xcodebuild", buildSettingsArgs()));
  const developmentTeam = settings.get("DEVELOPMENT_TEAM") || process.env.IOS_DEVELOPMENT_TEAM || "";
  const rows = [
    ["Bundle ID", settings.get("PRODUCT_BUNDLE_IDENTIFIER")],
    ["Version", settings.get("MARKETING_VERSION")],
    ["Build", settings.get("CURRENT_PROJECT_VERSION")],
    ["Code signing style", settings.get("CODE_SIGN_STYLE")],
    ["Code signing identity", settings.get("CODE_SIGN_IDENTITY")],
    ["Development team", developmentTeam || "missing"],
    ["Provisioning required", settings.get("PROVISIONING_PROFILE_REQUIRED")],
    ["Entitlements", settings.get("CODE_SIGN_ENTITLEMENTS")],
    ["DerivedData path", derivedDataPath],
  ];

  for (const [label, value] of rows) {
    console.log(`${label}: ${value || "missing"}`);
  }

  const archiveReady =
    settings.get("PRODUCT_BUNDLE_IDENTIFIER") === "com.jeremyswisher.uclasportsmri" &&
    settings.get("CODE_SIGN_STYLE") === "Automatic" &&
    settings.get("CODE_SIGN_ENTITLEMENTS") === "UCLASportsMRI/UCLASportsMRI.entitlements" &&
    !!developmentTeam;

  console.log(`\nCommand-line archive signing ready: ${archiveReady ? "yes" : "no"}`);
  if (!developmentTeam) {
    console.log("Next: set IOS_DEVELOPMENT_TEAM=<Apple Team ID> or select the Apple Developer Team in Xcode before archiving.");
  }
  console.log("Run npm run archive:ios after Apple Developer signing is configured.");
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
  console.log("Set IOS_DEVELOPMENT_TEAM=<Apple Team ID> if automatic signing needs an explicit team.");
  console.log("Run npm run archive:ios:signing to inspect Release signing settings.");
  console.log("Run npm run archive:ios after Apple Developer signing is configured.");
  process.exit(0);
}

mkdirSync(dirname(archivePath), { recursive: true });
mkdirSync(derivedDataPath, { recursive: true });
rmSync(archivePath, { recursive: true, force: true });
rmSync(exportPath, { recursive: true, force: true });

console.log("\nArchiving Release build for iOS...");
run("xcodebuild", baseArchiveArgs());

console.log("\nExporting archive for App Store Connect upload...");
run("xcodebuild", [
  "-exportArchive",
  "-archivePath",
  archivePath,
  "-exportOptionsPlist",
  exportOptionsPath,
  "-exportPath",
  exportPath,
  "-allowProvisioningUpdates",
]);

console.log(`\nArchive complete: ${archivePath}`);
console.log(`Export output: ${exportPath}`);
