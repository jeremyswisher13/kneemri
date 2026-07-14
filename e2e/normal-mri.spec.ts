import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  collectRuntimeErrors,
  expectNoHorizontalOverflow,
  installPreviewSession,
} from "./helpers";

interface WorkstationFixture {
  name: string;
  title: string;
  path: string;
  series: string[];
}

const WORKSTATIONS: WorkstationFixture[] = [
  {
    name: "knee",
    title: "Interactive Normal Knee MRI",
    path: "/courses/knee-mri/normal-knee-mri",
    series: ["sag-pdfs", "cor-pdfs", "axi-t2fs", "sag-t1"],
  },
  {
    name: "shoulder",
    title: "Interactive Normal Shoulder MRI",
    path: "/courses/shoulder-mri/normal-shoulder-mri",
    series: ["sag-t2fs", "cor-t2fs", "axi-t2fs", "sag-t1"],
  },
  {
    name: "hip",
    title: "Interactive Normal Hip MRI",
    path: "/courses/hip-mri/normal-hip-mri",
    series: ["cor-t2fs", "axi", "sag"],
  },
  {
    name: "elbow",
    title: "Interactive Normal Elbow MRI",
    path: "/courses/elbow-mri/normal-elbow-mri",
    series: ["cor-t2fs", "axi-t2fs", "sag-ir"],
  },
];

function modeButton(page: Page, mode: string) {
  return page.locator(`[data-normal-mode="${mode}"]`);
}

function seriesButton(page: Page, series: string) {
  return page.locator(`[data-normal-series="${series}"]`);
}

async function clickMode(page: Page, mode: string, series: string, runtimeErrors?: string[]) {
  await modeButton(page, mode).click();
  if (runtimeErrors) {
    await page.waitForTimeout(50);
    expect(runtimeErrors).toEqual([]);
  }
  await expect(modeButton(page, mode)).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(new RegExp(`mode=${mode}.*series=${series}|series=${series}.*mode=${mode}`));
}

async function expectImageLoaded(image: Locator) {
  await expect
    .poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
    .toBe(true);
}

async function expectMarkerGeometry(annotated: Locator, requireMarker = true) {
  await expect(annotated).toBeVisible();
  await expectImageLoaded(annotated.locator("img"));
  const result = await annotated.evaluate((root) => {
    const image = root.querySelector("img");
    const imageRect = image?.getBoundingClientRect();
    if (!imageRect || imageRect.width <= 0 || imageRect.height <= 0) {
      return { markerCount: 0, errors: ["MRI image has no rendered area"] };
    }
    const errors: string[] = [];
    const markers = Array.from(root.querySelectorAll<HTMLElement>("[data-mri-marker]"));
    for (const marker of markers) {
      const x = Number(marker.dataset.markerX);
      const y = Number(marker.dataset.markerY);
      const rect = marker.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const expectedX = imageRect.left + (imageRect.width * x) / 100;
      const expectedY = imageRect.top + (imageRect.height * y) / 100;
      if (!Number.isFinite(x) || !Number.isFinite(y) || x <= 0 || x >= 100 || y <= 0 || y >= 100) {
        errors.push(`invalid authored coordinate ${x},${y}`);
      }
      if (Math.abs(centerX - expectedX) > 1.5 || Math.abs(centerY - expectedY) > 1.5) {
        errors.push(`rendered marker drift at ${x},${y}`);
      }
      if (
        centerX < imageRect.left - 1 ||
        centerX > imageRect.right + 1 ||
        centerY < imageRect.top - 1 ||
        centerY > imageRect.bottom + 1
      ) {
        errors.push(`marker center outside MRI at ${x},${y}`);
      }
    }
    return { markerCount: markers.length, errors };
  });
  if (requireMarker) expect(result.markerCount).toBeGreaterThan(0);
  expect(result.errors).toEqual([]);
  return result.markerCount;
}

async function inspectEveryTourStep(page: Page) {
  const progress = page.getByText(/^Step \d+ of \d+$/).first();
  await expect(progress).toBeVisible();
  const match = (await progress.textContent())?.match(/^Step 1 of (\d+)$/);
  expect(match, "guided-tour step count").not.toBeNull();
  const count = Number(match?.[1]);
  expect(count).toBeGreaterThan(0);
  let markerCount = 0;

  for (let step = 1; step <= count; step += 1) {
    if (step > 1) {
      await page.getByRole("button", { name: new RegExp(`^Go to step ${step}:`) }).click();
    }
    await expect(page.getByText(`Step ${step} of ${count}`, { exact: true })).toBeVisible();
    markerCount += await expectMarkerGeometry(page.getByTestId("annotated-mri"), false);
  }
  expect(markerCount, "guided tour should contain authored markers").toBeGreaterThan(0);
}

async function inspectKnowledgeCheck(page: Page) {
  const selector = page.getByRole("group", { name: "Practice or mastery mode" });
  await expect(selector).toBeVisible();
  await expectMarkerGeometry(page.getByTestId("annotated-mri"));

  const locate = selector.getByRole("button", { name: "Locate" });
  await expect(locate).toBeEnabled();
  await locate.click();
  const image = page.getByTestId("locatable-mri");
  await expect(image).toBeVisible();
  await expectImageLoaded(image.locator("img"));
  const target = await image.evaluate((element) => ({
    x: Number(element.dataset.targetX),
    y: Number(element.dataset.targetY),
  }));
  expect(target.x).toBeGreaterThan(0);
  expect(target.x).toBeLessThan(100);
  expect(target.y).toBeGreaterThan(0);
  expect(target.y).toBeLessThan(100);
  const box = await image.boundingBox();
  expect(box).not.toBeNull();
  await image.click({
    position: {
      x: (box!.width * target.x) / 100,
      y: (box!.height * target.y) / 100,
    },
  });
  await expect(page.getByText(/^Correct\./)).toBeVisible();

  const mastery = selector.getByRole("button", { name: "Mastery" });
  await expect(mastery).toBeEnabled();
  await mastery.click();
  await expect(mastery).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-testid="annotated-mri"], [data-testid="locatable-mri"]').first()).toBeVisible();
}

async function expectControlsFit(page: Page, requireTouchSize: boolean) {
  const failures = await page
    .locator("[data-normal-mode], [data-normal-series]")
    .evaluateAll((controls, touch) =>
      controls.flatMap((control) => {
        const element = control as HTMLElement;
        const rect = element.getBoundingClientRect();
        const errors: string[] = [];
        if (element.scrollWidth > element.clientWidth + 2) errors.push(`${element.textContent}: clipped text`);
        if (touch && (rect.height < 42 || rect.width < 42)) errors.push(`${element.textContent}: small tap target`);
        return errors;
      }), requireTouchSize);
  expect(failures).toEqual([]);
}

async function expectPageScrolls(page: Page) {
  const result = await page.evaluate(() => {
    const scrolling = document.scrollingElement;
    if (!scrolling || scrolling.scrollHeight <= scrolling.clientHeight) return { scrollable: false, moved: false };
    scrolling.scrollTop = 0;
    scrolling.scrollTop = Math.min(500, scrolling.scrollHeight - scrolling.clientHeight);
    const moved = scrolling.scrollTop > 0;
    scrolling.scrollTop = 0;
    return { scrollable: true, moved };
  });
  expect(result.scrollable, "workstation should have page content below the fold").toBe(true);
  expect(result.moved, "document scrolling must not be locked").toBe(true);
}

async function inspectExtendedModes(
  page: Page,
  fixture: WorkstationFixture,
  series: string,
  runtimeErrors: string[],
) {
  await clickMode(page, "correlate", series);
  await expect(page.getByText(/Correlation 1 of \d+/)).toBeVisible();
  const crossPlaneImages = page.locator('[data-screenshot-anchor="mri-viewer"] img');
  await expect(crossPlaneImages).toHaveCount(2);
  await expectImageLoaded(crossPlaneImages.first());
  await expectImageLoaded(crossPlaneImages.nth(1));
  await page.getByRole("button", { name: /option A on/i }).first().click();
  await expect(page.getByText(/Correct — same structure|Not quite — the correct structure/)).toBeVisible();
  await page.reload();
  await expect(modeButton(page, "correlate")).toHaveAttribute("aria-pressed", "true");
  expect(runtimeErrors).toEqual([]);

  await clickMode(page, "compare", series, runtimeErrors);
  const compareViewers = page.getByTestId("mri-stack-viewer");
  await expect(compareViewers).toHaveCount(2);
  await expectImageLoaded(compareViewers.first().locator("img"));
  await expectImageLoaded(compareViewers.nth(1).locator("img"));
  await compareViewers.first().focus();
  await compareViewers.first().press("ArrowRight");
  await page.reload();
  await expect(modeButton(page, "compare")).toHaveAttribute("aria-pressed", "true");

  await clickMode(page, "advanced", series);
  await page.getByRole("button", { name: /Start advanced challenge with all topics/ }).click();
  await page.getByRole("radio", { name: /^Option A:/ }).click();
  await expect(page.locator("p").filter({ hasText: /^(Correct|Not quite)$/ }).last()).toBeVisible();
  await page.reload();
  await expect(modeButton(page, "advanced")).toHaveAttribute("aria-pressed", "true");

  await clickMode(page, "caq", series);
  await page.getByRole("button", { name: /Start image-anchored CAQ/ }).click();
  const caqViewer = page.getByTestId("mri-stack-viewer");
  await expect(caqViewer).toBeVisible();
  await expectImageLoaded(caqViewer.locator("img"));
  await page.getByRole("radio", { name: /^Option A:/ }).click();
  await expect(page.locator("p").filter({ hasText: /^(Correct|Not quite)$/ }).last()).toBeVisible();
  await page.reload();
  await expect(modeButton(page, "caq")).toHaveAttribute("aria-pressed", "true");

  await expect(page.getByRole("heading", { name: fixture.title })).toBeVisible();
  await expectNoHorizontalOverflow(page);
}

test.beforeEach(async ({ context }) => {
  await installPreviewSession(context);
});

for (const fixture of WORKSTATIONS) {
  test(`${fixture.name}: every plane, tour marker, mastery interaction, and mode works`, async ({
    page,
  }, testInfo) => {
    test.setTimeout(180_000);
    const runtimeErrors = collectRuntimeErrors(page);
    const firstSeries = fixture.series[0];
    await page.goto(`${fixture.path}?mode=explore&series=${firstSeries}`);
    await expect(page.getByRole("heading", { name: fixture.title })).toBeVisible();

    for (const series of fixture.series) {
      if (series !== firstSeries) await seriesButton(page, series).click();
      await expect(seriesButton(page, series)).toHaveAttribute("aria-pressed", "true");

      await clickMode(page, "explore", series);
      const viewer = page.getByTestId("mri-stack-viewer");
      await expect(viewer).toBeVisible();
      await expectImageLoaded(viewer.locator("img"));
      const count = Number(await viewer.getAttribute("data-slice-count"));
      expect(count).toBeGreaterThan(1);
      await viewer.focus();
      await viewer.press("End");
      await expect(viewer).toHaveAttribute("data-slice-index", String(count - 1));
      await viewer.press("Home");
      await expect(viewer).toHaveAttribute("data-slice-index", "0");
      await page.getByRole("button", { name: "Next slice" }).click();
      await expect(viewer).toHaveAttribute("data-slice-index", "1");

      await clickMode(page, "tour", series);
      await inspectEveryTourStep(page);

      await clickMode(page, "check", series);
      await inspectKnowledgeCheck(page);
      await page.reload();
      await expect(seriesButton(page, series)).toHaveAttribute("aria-pressed", "true");
      await expect(modeButton(page, "check")).toHaveAttribute("aria-pressed", "true");

      await expectNoHorizontalOverflow(page);
      await expectControlsFit(page, testInfo.project.name === "mobile-chromium");
    }

    await inspectExtendedModes(page, fixture, fixture.series.at(-1)!, runtimeErrors);
    await expectPageScrolls(page);
    expect(runtimeErrors).toEqual([]);
  });
}
