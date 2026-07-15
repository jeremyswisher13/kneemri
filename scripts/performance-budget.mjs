import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const DIST_ROOT = resolve("dist");
const STACK_ROOT = resolve("public/images/teaching/stacks");
const INITIAL_GZIP_BUDGET = 260 * 1024;
const LARGEST_INITIAL_ASSET_BUDGET = 90 * 1024;
const NORMAL_STACK_BUDGET = 3 * 1024 * 1024;
const NORMAL_SLICE_BUDGET = 128 * 1024;

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`;
}

function assertBudget(condition, message, failures) {
  if (!condition) failures.push(message);
}

const failures = [];
const indexHtml = readFileSync(join(DIST_ROOT, "index.html"), "utf8");
const initialAssetUrls = [
  ...new Set(
    [...indexHtml.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)].map(
      (match) => match[1],
    ),
  ),
];

const initialAssets = initialAssetUrls.map((url) => {
  const bytes = readFileSync(join(DIST_ROOT, url));
  return { url, gzipBytes: gzipSync(bytes).byteLength };
});
const initialGzipBytes = initialAssets.reduce((total, asset) => total + asset.gzipBytes, 0);
const largestInitialAsset = initialAssets.reduce(
  (largest, asset) => (asset.gzipBytes > largest.gzipBytes ? asset : largest),
  { url: "none", gzipBytes: 0 },
);

assertBudget(
  initialGzipBytes <= INITIAL_GZIP_BUDGET,
  `Initial JS/CSS is ${formatBytes(initialGzipBytes)} gzip; budget is ${formatBytes(INITIAL_GZIP_BUDGET)}.`,
  failures,
);
assertBudget(
  largestInitialAsset.gzipBytes <= LARGEST_INITIAL_ASSET_BUDGET,
  `${largestInitialAsset.url} is ${formatBytes(largestInitialAsset.gzipBytes)} gzip; per-asset budget is ${formatBytes(LARGEST_INITIAL_ASSET_BUDGET)}.`,
  failures,
);

const stackResults = readdirSync(STACK_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name.startsWith("normal-"))
  .map((entry) => {
    const directory = join(STACK_ROOT, entry.name);
    const slices = readdirSync(directory)
      .filter((file) => /\.jpe?g$/i.test(file))
      .map((file) => ({ file, bytes: statSync(join(directory, file)).size }));
    const totalBytes = slices.reduce((total, slice) => total + slice.bytes, 0);
    const largestSlice = slices.reduce(
      (largest, slice) => (slice.bytes > largest.bytes ? slice : largest),
      { file: "none", bytes: 0 },
    );
    return { name: entry.name, count: slices.length, totalBytes, largestSlice };
  });

for (const stack of stackResults) {
  assertBudget(stack.count > 0, `${stack.name} has no JPEG slices.`, failures);
  assertBudget(
    stack.totalBytes <= NORMAL_STACK_BUDGET,
    `${stack.name} is ${formatBytes(stack.totalBytes)}; stack budget is ${formatBytes(NORMAL_STACK_BUDGET)}.`,
    failures,
  );
  assertBudget(
    stack.largestSlice.bytes <= NORMAL_SLICE_BUDGET,
    `${stack.name}/${stack.largestSlice.file} is ${formatBytes(stack.largestSlice.bytes)}; slice budget is ${formatBytes(NORMAL_SLICE_BUDGET)}.`,
    failures,
  );
}

const largestStack = stackResults.reduce(
  (largest, stack) => (stack.totalBytes > largest.totalBytes ? stack : largest),
  { name: "none", totalBytes: 0 },
);
const largestSlice = stackResults
  .map((stack) => ({ ...stack.largestSlice, stack: stack.name }))
  .reduce(
    (largest, slice) => (slice.bytes > largest.bytes ? slice : largest),
    { stack: "none", file: "none", bytes: 0 },
  );

console.log(
  `Performance budget: ${formatBytes(initialGzipBytes)} initial gzip across ${initialAssets.length} assets; largest ${basename(largestInitialAsset.url)} at ${formatBytes(largestInitialAsset.gzipBytes)}.`,
);
console.log(
  `Normal MRI media: ${stackResults.length} stacks; largest ${largestStack.name} at ${formatBytes(largestStack.totalBytes)}; largest slice ${largestSlice.stack}/${largestSlice.file} at ${formatBytes(largestSlice.bytes)}.`,
);

if (failures.length) {
  console.error("\nPerformance budget failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
}
