import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verify = process.argv.includes("--verify");
const evidencePath = join(root, "ios", "ScreenshotEvidence.json");
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));

const plannedStems = [
  "01-dashboard",
  "02-normal-guided-tour",
  "03-knowledge-check",
  "04-cross-plane",
  "05-cases",
  "06-spaced-review",
  "07-progress",
];

const devices = [
  {
    key: "iphone69",
    label: "iPhone 6.9-inch",
    gateKey: "screenshots.iphone69Captured",
    folder: join("ios", "screenshots", "iphone-6-9"),
    prefix: "iphone-6-9",
  },
  {
    key: "ipad13",
    label: "iPad 13-inch",
    gateKey: "screenshots.ipad13Captured",
    folder: join("ios", "screenshots", "ipad-13"),
    prefix: "ipad-13",
  },
];

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function expectedFiles(prefix) {
  return plannedStems.map((stem) => `${prefix}-${stem}.png`);
}

function sameSet(actual, expected) {
  return (
    Array.isArray(actual) &&
    actual.length === expected.length &&
    expected.every((filename) => actual.includes(filename))
  );
}

function runScreenshotCheck() {
  return spawnSync(process.execPath, ["scripts/ios-screenshot-check.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
}

function firstUsefulFailure(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.find((line) => line.startsWith("FAIL ")) ?? lines.at(-1) ?? "No screenshot check output.";
}

const screenshotCheck = runScreenshotCheck();
const screenshotCheckPassed = screenshotCheck.status === 0;

console.log("# iOS Screenshot Evidence Report\n");
console.log("Evidence file: ios/ScreenshotEvidence.json");
console.log(`Last updated: ${evidence.lastUpdated ?? "unknown"}`);
console.log(`Screenshot pixel/file check: ${screenshotCheckPassed ? "PASS" : "TODO"}`);
if (!screenshotCheckPassed) {
  const checkOutput = `${screenshotCheck.stdout ?? ""}\n${screenshotCheck.stderr ?? ""}`;
  console.log(`First screenshot check issue: ${firstUsefulFailure(checkOutput)}`);
}
console.log("");

const readiness = [];

for (const device of devices) {
  const item = evidence[device.key] ?? {};
  const expected = expectedFiles(device.prefix);
  const folderExists = existsSync(join(root, device.folder));
  const manifestComplete =
    item.captured === true &&
    item.source === "TestFlight/native iOS app" &&
    text(item.capturedAt) &&
    text(item.device) &&
    text(item.appBuild) &&
    sameSet(item.files, expected);
  const ready = folderExists && screenshotCheckPassed && manifestComplete;
  readiness.push([device.gateKey, ready]);

  console.log(`## ${device.label}`);
  console.log(`Gate: ${device.gateKey}`);
  console.log(`Status: ${ready ? "PASS" : "TODO"}`);
  console.log(`Folder: ${device.folder}${folderExists ? "" : " (missing)"}`);
  console.log(`Source: ${item.source || "missing"}`);
  console.log(`Captured at: ${item.capturedAt || "missing"}`);
  console.log(`Device: ${item.device || "missing"}`);
  console.log(`App build: ${item.appBuild || "missing"}`);
  if (!sameSet(item.files, expected)) {
    console.log(`Next: Keep files exactly in sync with ios/ScreenshotPlan.md for ${device.label}.`);
  }
  if (item.source !== "TestFlight/native iOS app") {
    console.log('Next: Record source as "TestFlight/native iOS app" after final capture.');
  }
  if (!ready) {
    console.log("Next: Capture final native screenshots, run npm run screenshots:ios:check, then update this evidence block.");
  }
  console.log("");
}

const phi = evidence.phiReview ?? {};
const phiReady =
  phi.reviewed === true &&
  phi.noPhiConfirmed === true &&
  text(phi.reviewedAt) &&
  text(phi.reviewer);
readiness.push(["screenshots.screenshotsReviewedForNoPhi", phiReady]);

console.log("## No-PHI Review");
console.log("Gate: screenshots.screenshotsReviewedForNoPhi");
console.log(`Status: ${phiReady ? "PASS" : "TODO"}`);
console.log(`Reviewed at: ${phi.reviewedAt || "missing"}`);
console.log(`Reviewer: ${phi.reviewer || "missing"}`);
if (!phiReady) {
  console.log("Next: Review every screenshot for PHI, real learner data, local/debug UI, and clipped text, then update phiReview.");
}
console.log("");

const readyCount = readiness.filter(([, ready]) => ready).length;
console.log(`Ready screenshot gates: ${readyCount}/${readiness.length}`);
for (const [key, ready] of readiness) {
  console.log(`- ${ready ? "PASS" : "TODO"} ${key}`);
}
console.log("");

if (readyCount === readiness.length) {
  console.log("All screenshot evidence is ready. You may set the three screenshot gates to true in ios/AppStoreSubmissionGate.json.");
} else {
  console.log("Do not set any screenshot gate to true yet. Run npm run screenshots:ios:evidence:verify after final capture and review.");
}

if (verify && readyCount !== readiness.length) {
  console.error("\nScreenshot evidence verification failed.");
  process.exit(1);
}
