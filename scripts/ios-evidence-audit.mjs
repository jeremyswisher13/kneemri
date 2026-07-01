import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const verify = process.argv.includes("--verify");

const commands = [
  {
    key: "archiveSigning",
    label: "Archive/export signing",
    command: "node",
    args: ["scripts/ios-archive.mjs", "--signing"],
    readyPattern: /^App Store export signing ready: yes$/m,
    readyLabel: "App Store export signing ready",
  },
  {
    key: "appleFirebaseAuth",
    label: "Apple/Firebase auth evidence",
    command: "node",
    args: ["scripts/ios-auth-evidence.mjs"],
    readyPattern: /Ready Apple\/Firebase auth gates: (\d+)\/(\d+)/,
    readyLabel: "Apple/Firebase auth gates",
  },
  {
    key: "releaseVerification",
    label: "Real-device/account-deletion evidence",
    command: "node",
    args: ["scripts/ios-release-evidence.mjs"],
    readyPattern: /Ready real-device\/account-deletion gates: (\d+)\/(\d+)/,
    readyLabel: "Real-device/account-deletion gates",
  },
  {
    key: "screenshots",
    label: "Screenshot evidence",
    command: "node",
    args: ["scripts/ios-screenshot-evidence.mjs"],
    readyPattern: /Ready screenshot gates: (\d+)\/(\d+)/,
    readyLabel: "Screenshot gates",
  },
  {
    key: "appStoreConnect",
    label: "App Store Connect evidence",
    command: "node",
    args: ["scripts/ios-app-store-connect-evidence.mjs"],
    readyPattern: /Ready App Store Connect gates: (\d+)\/(\d+)/,
    readyLabel: "App Store Connect gates",
  },
  {
    key: "submissionGate",
    label: "Hard submission gate",
    command: "node",
    args: ["scripts/ios-gate-report.mjs"],
    readyPattern: /Ready for App Review submission: yes/,
    readyLabel: "Ready for App Review submission",
  },
  {
    key: "appStoreRelease",
    label: "App Store release evidence",
    command: "node",
    args: ["scripts/ios-app-store-release-evidence.mjs"],
    readyPattern: /Ready App Store release gates: (\d+)\/(\d+)/,
    readyLabel: "App Store release gates",
  },
];

function runCommand(command) {
  const result = spawnSync(command.command, command.args, {
    cwd: root,
    encoding: "utf8",
  });
  return {
    ...command,
    status: result.status ?? 1,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`,
  };
}

function parseReady(result) {
  if (result.readyPattern instanceof RegExp) {
    const match = result.output.match(result.readyPattern);
    if (match?.[1] && match?.[2]) {
      const ready = Number(match[1]);
      const total = Number(match[2]);
      return {
        ready: ready === total,
        count: `${ready}/${total}`,
      };
    }
    return {
      ready: result.readyPattern.test(result.output),
      count: result.readyPattern.test(result.output) ? "yes" : "no",
    };
  }
  return { ready: false, count: "unknown" };
}

function firstActionableLine(output) {
  const lines = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  return (
    lines.find((line) => line.startsWith("Next: ")) ??
    lines.find((line) => line.startsWith("- TODO ")) ??
    lines.find((line) => line.startsWith("FAIL ")) ??
    lines.find((line) => line.includes("not verified")) ??
    "No next action found."
  );
}

const results = commands.map(runCommand).map((result) => ({
  ...result,
  parsed: parseReady(result),
  next: firstActionableLine(result.output),
}));

const failures = results.filter((result) => result.status !== 0 || !result.parsed.ready);

console.log("# iOS Evidence Audit\n");
console.log("This summarizes signing, evidence JSONs, screenshots, and the final App Store submission gate.");
console.log("");

for (const result of results) {
  const status = result.status === 0 && result.parsed.ready ? "PASS" : "TODO";
  console.log(`## ${result.label}`);
  console.log(`Status: ${status}`);
  console.log(`${result.readyLabel}: ${result.parsed.count}`);
  if (status !== "PASS") {
    console.log(result.next);
  }
  console.log("");
}

console.log("## Suggested Order");
const suggestedActions = [];
if (failures.some((result) => result.key === "archiveSigning")) {
  suggestedActions.push(
    "Create/download an App Store distribution provisioning profile for com.jeremyswisher.uclasportsmri, confirm Xcode has App Store Connect access for Team X578T4K65B, then rerun npm run archive:ios:signing and npm run export:ios.",
  );
}
if (failures.some((result) => result.key === "appleFirebaseAuth")) {
  suggestedActions.push("Complete Apple Developer Sign in with Apple and Firebase apple.com provider setup, then rerun npm run auth:ios:evidence:verify.");
}
if (failures.some((result) => result.key === "releaseVerification")) {
  suggestedActions.push("Upload/install the native build, verify real-device auth and account deletion, then rerun npm run release:ios:evidence:verify.");
}
if (failures.some((result) => result.key === "appStoreConnect")) {
  suggestedActions.push("Enter App Store Connect metadata/privacy/age-rating/regulated-device/build/screenshot evidence, then rerun npm run asc:ios:evidence:verify.");
}
if (failures.some((result) => result.key === "submissionGate")) {
  suggestedActions.push("Update ios/AppStoreSubmissionGate.json only after matching evidence is ready, then rerun npm run preflight:ios:submit.");
}
if (failures.some((result) => result.key === "appStoreRelease")) {
  suggestedActions.push("After App Review submission, approval, and public listing are complete, update ios/AppStoreReleaseEvidence.json and rerun npm run store:ios:evidence:verify.");
}
if (suggestedActions.length === 0) {
  console.log("All audited evidence is ready. The app is recorded as submitted, approved, and publicly available on the App Store.");
} else {
  suggestedActions.forEach((action, index) => {
    console.log(`${index + 1}. ${action}`);
  });
}
console.log("");

console.log(`Audited groups ready: ${results.length - failures.length}/${results.length}`);
for (const result of results) {
  console.log(`- ${result.status === 0 && result.parsed.ready ? "PASS" : "TODO"} ${result.label}`);
}

if (verify && failures.length > 0) {
  console.error("\nOne or more iOS App Store evidence groups are not ready.");
  process.exit(1);
}
