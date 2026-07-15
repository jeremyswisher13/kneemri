import { expect, test } from "@playwright/test";
import {
  elbowModuleMetas,
  hipModuleMetas,
  kneeModuleMetas,
  shoulderModuleMetas,
} from "../src/content/module-metas";
import {
  elbowCaseMetas,
  hipCaseMetas,
  kneeCaseMetas,
  shoulderCaseMetas,
} from "../src/content/case-metas";
import { collectRuntimeErrors, installPreviewSession } from "./helpers";

const COURSES = [
  { id: "knee-mri", region: "knee", modules: kneeModuleMetas, cases: kneeCaseMetas },
  { id: "shoulder-mri", region: "shoulder", modules: shoulderModuleMetas, cases: shoulderCaseMetas },
  { id: "hip-mri", region: "hip", modules: hipModuleMetas, cases: hipCaseMetas },
  { id: "elbow-mri", region: "elbow", modules: elbowModuleMetas, cases: elbowCaseMetas },
] as const;

const ROUTES = [
  "/",
  "/account",
  "/accessibility",
  "/privacy",
  "/support",
  ...COURSES.flatMap((course) => {
    const base = `/courses/${course.id}`;
    return [
      base,
      `${base}/modules`,
      ...course.modules.map((module) => `${base}/modules/${module.id}`),
      `${base}/search-pattern`,
      `${base}/cases`,
      ...course.cases.map((caseItem) => `${base}/cases/${caseItem.id}`),
      `${base}/learning-paths`,
      `${base}/progress`,
      `${base}/pre-assessment`,
      `${base}/post-assessment`,
      `${base}/certificate`,
      `${base}/reference`,
      `${base}/review`,
      `${base}/normal-${course.region}-mri`,
    ];
  }),
];

test.beforeEach(async ({ context }) => {
  await installPreviewSession(context);
});

test("every learner route renders and scrolls cleanly on a phone", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "The exhaustive route sweep targets the installed-phone experience.");
  test.setTimeout(300_000);
  const runtimeErrors = collectRuntimeErrors(page);

  for (const route of ROUTES) {
    runtimeErrors.length = 0;
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("#root"), route).toBeVisible();
    await page.waitForTimeout(75);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText.trim().length, `${route} should render meaningful content`).toBeGreaterThan(20);
    expect(bodyText, route).not.toContain("Something went wrong");
    expect(bodyText, route).not.toContain("Module Not Found");
    expect(bodyText, route).not.toContain("Case Not Found");
    expect(runtimeErrors, route).toEqual([]);

    const layout = await page.evaluate(() => {
      const root = document.documentElement;
      const main = document.querySelector<HTMLElement>("#main-content");
      const mainOverflow = main ? main.scrollWidth - main.clientWidth : 0;
      let scrollMoved = true;
      if (main && main.scrollHeight > main.clientHeight + 1) {
        main.scrollTop = 0;
        main.scrollTop = Math.min(160, main.scrollHeight - main.clientHeight);
        scrollMoved = main.scrollTop > 0;
        main.scrollTop = 0;
      }
      const brokenVisibleImages = [...document.images]
        .filter((image) => {
          const rect = image.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight && image.complete && image.naturalWidth === 0;
        })
        .map((image) => image.currentSrc || image.src);
      return {
        rootOverflow: root.scrollWidth - root.clientWidth,
        mainOverflow,
        scrollMoved,
        brokenVisibleImages,
      };
    });

    expect(layout.rootOverflow, `${route} root overflow`).toBeLessThanOrEqual(1);
    expect(layout.mainOverflow, `${route} main overflow`).toBeLessThanOrEqual(1);
    expect(layout.scrollMoved, `${route} main scrolling`).toBe(true);
    expect(layout.brokenVisibleImages, `${route} visible images`).toEqual([]);
  }
});
