import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const allowedExtensions = [".png", ".jpg", ".jpeg"];
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
    label: "iPhone 6.9-inch",
    folder: join("ios", "screenshots", "iphone-6-9"),
    prefix: "iphone-6-9",
    allowedSizes: [
      [1260, 2736],
      [1290, 2796],
      [1320, 2868],
    ],
  },
  {
    label: "iPad 13-inch",
    folder: join("ios", "screenshots", "ipad-13"),
    prefix: "ipad-13",
    allowedSizes: [
      [2064, 2752],
      [2048, 2732],
    ],
  },
];

const checks = [];

function pass(label, detail = "") {
  checks.push({ ok: true, label, detail });
}

function fail(label, detail = "") {
  checks.push({ ok: false, label, detail });
}

function isImageFile(filename) {
  return allowedExtensions.some((extension) => filename.toLowerCase().endsWith(extension));
}

function matchingScreenshotFile(folder, prefix, stem) {
  for (const extension of allowedExtensions) {
    const filename = `${prefix}-${stem}${extension}`;
    if (existsSync(join(folder, filename))) return filename;
  }
  return null;
}

function pngDimensions(buffer) {
  const signature = "89504e470d0a1a0a";
  if (buffer.subarray(0, 8).toString("hex") !== signature) return null;
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    type: "png",
  };
}

function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;

  let offset = 2;
  while (offset < buffer.length) {
    while (buffer[offset] === 0xff) offset += 1;
    const marker = buffer[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) break;
    if (offset + 2 > buffer.length) break;

    const segmentLength = buffer.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > buffer.length) break;

    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isStartOfFrame) {
      return {
        width: buffer.readUInt16BE(offset + 5),
        height: buffer.readUInt16BE(offset + 3),
        type: "jpeg",
      };
    }

    offset += segmentLength;
  }

  return null;
}

function imageDimensions(filePath) {
  const buffer = readFileSync(filePath);
  return pngDimensions(buffer) || jpegDimensions(buffer);
}

function sizeAllowed(dimensions, allowedSizes) {
  return allowedSizes.some(([width, height]) => width === dimensions.width && height === dimensions.height);
}

function formatSizes(sizes) {
  return sizes.map(([width, height]) => `${width}x${height}`).join(", ");
}

for (const device of devices) {
  if (!existsSync(device.folder)) {
    fail(`${device.label} screenshot folder exists`, device.folder);
    continue;
  }
  pass(`${device.label} screenshot folder exists`, device.folder);

  const imageFiles = readdirSync(device.folder).filter(isImageFile).sort();
  if (imageFiles.length < 1 || imageFiles.length > 10) {
    fail(`${device.label} screenshot count is 1-10`, `${imageFiles.length} image file(s)`);
  } else {
    pass(`${device.label} screenshot count is 1-10`, `${imageFiles.length} image file(s)`);
  }

  const expectedFiles = new Set();
  for (const stem of plannedStems) {
    const filename = matchingScreenshotFile(device.folder, device.prefix, stem);
    const expectedBase = `${device.prefix}-${stem}`;
    if (!filename) {
      fail(`${device.label} has ${stem}`, `Missing ${expectedBase}.png/.jpg/.jpeg`);
      continue;
    }
    expectedFiles.add(filename);

    const filePath = join(device.folder, filename);
    const dimensions = imageDimensions(filePath);
    if (!dimensions) {
      fail(`${filename} dimensions readable`, "Not a readable PNG or JPEG");
      continue;
    }
    pass(`${filename} dimensions readable`, `${dimensions.width}x${dimensions.height} ${dimensions.type}`);

    if (sizeAllowed(dimensions, device.allowedSizes)) {
      pass(`${filename} uses accepted ${device.label} size`, `${dimensions.width}x${dimensions.height}`);
    } else {
      fail(
        `${filename} uses accepted ${device.label} size`,
        `${dimensions.width}x${dimensions.height}; expected one of ${formatSizes(device.allowedSizes)}`,
      );
    }
  }

  for (const filename of imageFiles) {
    if (!expectedFiles.has(filename)) {
      fail(`${device.label} has no unexpected screenshot file`, filename);
    }
  }
}

for (const check of checks) {
  const icon = check.ok ? "PASS" : "FAIL";
  console.log(`${icon} ${check.label}${check.detail ? ` - ${check.detail}` : ""}`);
}

const failures = checks.filter((check) => !check.ok);
if (failures.length > 0) {
  console.error(`\n${failures.length} iOS screenshot check(s) failed.`);
  console.error("Capture the final TestFlight/native screenshots from ios/ScreenshotPlan.md, then rerun this command.");
  process.exit(1);
}

console.log(`\n${checks.length} iOS screenshot checks passed.`);
