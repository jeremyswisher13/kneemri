import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

describe("iOS App Store screenshot readiness", () => {
  const screenshotPlan = readFileSync("ios/ScreenshotPlan.md", "utf8");
  const checker = readFileSync("scripts/ios-screenshot-check.mjs", "utf8");
  const packageJson = readFileSync("package.json", "utf8");

  it("documents and exposes the screenshot validation command", () => {
    expect(packageJson).toContain('"screenshots:ios:check": "node scripts/ios-screenshot-check.mjs"');
    expect(screenshotPlan).toContain("npm run screenshots:ios:check");
  });

  it("keeps planned App Store screenshot filenames in sync with the checker", () => {
    for (const stem of [
      "01-dashboard",
      "02-normal-guided-tour",
      "03-knowledge-check",
      "04-cross-plane",
      "05-cases",
      "06-spaced-review",
      "07-progress",
    ]) {
      expect(screenshotPlan).toContain(`iphone-6-9-${stem}.png`);
      expect(screenshotPlan).toContain(`ipad-13-${stem}.png`);
      expect(checker).toContain(stem);
    }
  });

  it("validates the Apple high-resolution iPhone and iPad size families", () => {
    for (const size of ["1260, 2736", "1290, 2796", "1320, 2868", "2064, 2752", "2048, 2732"]) {
      expect(checker).toContain(size);
    }
  });
});
