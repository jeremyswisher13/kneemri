import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

describe("iOS App Store screenshot readiness", () => {
  const screenshotPlan = readFileSync("ios/ScreenshotPlan.md", "utf8");
  const checker = readFileSync("scripts/ios-screenshot-check.mjs", "utf8");
  const evidenceScript = readFileSync("scripts/ios-screenshot-evidence.mjs", "utf8");
  const evidence = JSON.parse(readFileSync("ios/ScreenshotEvidence.json", "utf8")) as {
    iphone69: { files: string[] };
    ipad13: { files: string[] };
  };
  const packageJson = readFileSync("package.json", "utf8");

  it("documents and exposes the screenshot validation commands", () => {
    expect(packageJson).toContain('"screenshots:ios:check": "node scripts/ios-screenshot-check.mjs"');
    expect(packageJson).toContain('"screenshots:ios:evidence": "node scripts/ios-screenshot-evidence.mjs"');
    expect(packageJson).toContain('"screenshots:ios:evidence:verify": "node scripts/ios-screenshot-evidence.mjs --verify"');
    expect(screenshotPlan).toContain("npm run screenshots:ios:check");
    expect(screenshotPlan).toContain("npm run screenshots:ios:evidence:verify");
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
      expect(evidenceScript).toContain(stem);
      expect(evidence.iphone69.files).toContain(`iphone-6-9-${stem}.png`);
      expect(evidence.ipad13.files).toContain(`ipad-13-${stem}.png`);
    }
  });

  it("tracks the three screenshot gate booleans and source requirements", () => {
    expect(evidenceScript).toContain("screenshots.iphone69Captured");
    expect(evidenceScript).toContain("screenshots.ipad13Captured");
    expect(evidenceScript).toContain("screenshots.screenshotsReviewedForNoPhi");
    expect(evidenceScript).toContain("TestFlight/native iOS app");
  });

  it("can report screenshot evidence status before final screenshots are present", () => {
    const output = execFileSync(process.execPath, ["scripts/ios-screenshot-evidence.mjs"], {
      encoding: "utf8",
    });

    expect(output).toContain("iOS Screenshot Evidence Report");
    expect(output).toContain("Ready screenshot gates:");
  });

  it("validates the Apple high-resolution iPhone and iPad size families", () => {
    for (const size of ["1260, 2736", "1290, 2796", "1320, 2868", "2064, 2752", "2048, 2732"]) {
      expect(checker).toContain(size);
    }
  });
});
