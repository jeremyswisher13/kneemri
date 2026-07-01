import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const bundleId = "com.jeremyswisher.uclasportsmri";

const screenshotRoutes = [
  {
    stem: "01-dashboard",
    path: "/courses/knee-mri",
  },
  {
    stem: "02-normal-guided-tour",
    path: "/courses/knee-mri/normal-knee-mri?mode=tour&series=sag-pdfs",
    focus: "mri",
  },
  {
    stem: "03-knowledge-check",
    path: "/courses/knee-mri/normal-knee-mri?mode=check&series=cor-pdfs",
    focus: "mri",
  },
  {
    stem: "04-cross-plane",
    path: "/courses/shoulder-mri/normal-shoulder-mri?mode=correlate&series=cor-t2fs",
    focus: "mri-deep",
  },
  {
    stem: "05-cases",
    path: "/courses/knee-mri/cases",
  },
  {
    stem: "06-spaced-review",
    path: "/courses/knee-mri/review",
  },
  {
    stem: "07-progress",
    path: "/courses/knee-mri/progress",
  },
];

const screenshotSets = {
  "iphone-6-9": {
    label: "iPhone 6.9-inch",
    folder: join("ios", "screenshots", "iphone-6-9"),
    prefix: "iphone-6-9",
  },
  "ipad-13": {
    label: "iPad 13-inch",
    folder: join("ios", "screenshots", "ipad-13"),
    prefix: "ipad-13",
  },
};

function option(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) return null;
  return value;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function usage(exitCode = 1) {
  console.log(`Usage:
  npm run screenshots:ios:capture -- --set iphone-6-9 --device <simulator-udid-or-booted> [--app <path-to-UCLA Sports MRI.app>]
  npm run screenshots:ios:capture -- --set ipad-13 --device <simulator-udid> --app <path-to-UCLA Sports MRI.app>

Options:
  --set       ${Object.keys(screenshotSets).join(" | ")}
  --device    Simulator UDID, or "booted" for the current booted simulator
  --app       Optional built simulator .app to install before capture
  --wait-ms   Delay after each route launch before capture, default 6500
`);
  process.exit(exitCode);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.stdio ?? "inherit",
  });
  if (result.status !== 0) {
    if (options.allowFailure) return result;
    const status = result.status ?? "unknown";
    throw new Error(`${command} ${args.join(" ")} failed with status ${status}`);
  }
  return result;
}

function bootIfNeeded(device) {
  if (device === "booted") return;

  const boot = run("xcrun", ["simctl", "boot", device], {
    allowFailure: true,
    stdio: "pipe",
  });
  const output = `${boot.stdout ?? ""}\n${boot.stderr ?? ""}`;
  if (boot.status !== 0 && !/current state: Booted|already booted/i.test(output)) {
    process.stderr.write(output);
    throw new Error(`Unable to boot simulator ${device}`);
  }

  run("xcrun", ["simctl", "bootstatus", device, "-b"]);
}

function installAppIfProvided(device, appPath) {
  if (!appPath) return;
  const resolved = resolve(appPath);
  if (!existsSync(resolved)) {
    throw new Error(`Simulator app not found: ${resolved}`);
  }
  run("xcrun", ["simctl", "install", device, resolved]);
}

function wait(ms) {
  return new Promise((resolveWait) => {
    setTimeout(resolveWait, ms);
  });
}

function launchPath(route) {
  if (!route.focus) return route.path;
  const separator = route.path.includes("?") ? "&" : "?";
  return `${route.path}${separator}screenshotFocus=${encodeURIComponent(route.focus)}`;
}

const setKey = option("--set");
const device = option("--device") ?? "booted";
const appPath = option("--app");
const waitMs = Number(option("--wait-ms") ?? "6500");

if (hasFlag("--help") || !setKey) usage(hasFlag("--help") ? 0 : 1);
if (!Number.isFinite(waitMs) || waitMs < 1000) {
  throw new Error("--wait-ms must be a number of at least 1000.");
}

const screenshotSet = screenshotSets[setKey];
if (!screenshotSet) usage();

const outputFolder = join(root, screenshotSet.folder);
mkdirSync(outputFolder, { recursive: true });

console.log(`# iOS App Store screenshot capture: ${screenshotSet.label}`);
console.log(`Device: ${device}`);
console.log(`Output: ${screenshotSet.folder}`);
console.log(`Bundle ID: ${bundleId}`);
console.log("");

bootIfNeeded(device);
installAppIfProvided(device, appPath);

for (const route of screenshotRoutes) {
  const filename = `${screenshotSet.prefix}-${route.stem}.png`;
  const outputPath = join(outputFolder, filename);
  const path = launchPath(route);
  console.log(`Launching ${path}`);
  run("xcrun", [
    "simctl",
    "launch",
    "--terminate-running-process",
    device,
    bundleId,
    "--ucla-sports-mri-screenshot-demo",
    "--ucla-sports-mri-path",
    path,
  ]);
  await wait(waitMs);
  run("xcrun", ["simctl", "io", device, "screenshot", outputPath]);
  console.log(`Saved ${filename}`);
  console.log("");
}

console.log("Capture complete.");
console.log("Next: run npm run screenshots:ios:check and review every screenshot for no PHI, local/debug UI, clipped text, or login state.");
