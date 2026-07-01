import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const projectPath = join(root, "ios", "UCLASportsMRI.xcodeproj");
const exportOptionsPath = join(root, "ios", "ExportOptions.plist");
const archivePath = process.env.IOS_ARCHIVE_PATH || join(root, "ios", "build", "UCLASportsMRI.xcarchive");
const exportPath = process.env.IOS_EXPORT_PATH || join(root, "ios", "build", "export");
const mode = process.argv.includes("--archive") ? "archive" : "check";

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
    "-allowProvisioningUpdates",
  ];

  if (process.env.IOS_DEVELOPMENT_TEAM) {
    args.push(`DEVELOPMENT_TEAM=${process.env.IOS_DEVELOPMENT_TEAM}`);
  }
  return args;
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

if (mode === "check") {
  console.log("\nArchive command is configured.");
  console.log("Set IOS_DEVELOPMENT_TEAM=<Apple Team ID> if automatic signing needs an explicit team.");
  console.log("Run npm run archive:ios after Apple Developer signing is configured.");
  process.exit(0);
}

mkdirSync(dirname(archivePath), { recursive: true });
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
