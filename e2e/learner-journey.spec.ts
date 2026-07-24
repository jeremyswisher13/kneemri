import { expect, test } from "@playwright/test";
import {
  ELBOW_PATH,
  collectRuntimeErrors,
  expectNoHorizontalOverflow,
  installPreviewSession,
  loginThroughPreviewButton,
  setPreviewProgress,
} from "./helpers";

test("login to certificate follows the five-step elbow curriculum", async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page);
  await loginThroughPreviewButton(page);

  await setPreviewProgress(page, "empty");
  await page.reload();
  await expect(page.getByText("Next up | Step 1 of 5")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capture your baseline" })).toBeVisible();

  await setPreviewProgress(page, "baseline");
  await page.reload();
  await expect(page.getByText("Next up | Step 2 of 5")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Master the Normal Elbow MRI" })).toBeVisible();

  await setPreviewProgress(page, "normal");
  await page.reload();
  await expect(page.getByText("Next up | Step 3 of 5")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Module 1:/ })).toBeVisible();

  await setPreviewProgress(page, "modules");
  await page.reload();
  await expect(page.getByText("Next up | Step 4 of 5")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Complete 3 more core cases" })).toBeVisible();

  await setPreviewProgress(page, "cases");
  await page.reload();
  await expect(page.getByText("Next up | Step 5 of 5")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Measure your growth" })).toBeVisible();

  await setPreviewProgress(page, "complete");
  await page.reload();
  await expect(page.getByText("Congratulations, Local Preview!", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /View Certificate/i }).click();
  await expect(page).toHaveURL(new RegExp(`${ELBOW_PATH}/certificate$`));
  await expect(page.getByRole("heading", { name: "Certificate of Completion" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Local Preview", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /Download PDF/i })).toBeVisible();

  await expectNoHorizontalOverflow(page);
  expect(runtimeErrors).toEqual([]);
});

test("client-side navigation resets the active fellow scroll surface", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop regression for the persistent course layout.");
  await installPreviewSession(page);
  await page.goto("/courses/knee-mri/reference");

  await expect(page.getByRole("heading", { name: "Quick Reference" })).toBeVisible();
  const surface = await page.evaluate(() => {
    const main = document.querySelector<HTMLElement>("#main-content");
    const documentScroller = document.scrollingElement;
    if (!main || !documentScroller) return null;
    const target = main.scrollHeight > main.clientHeight ? main : documentScroller;
    target.scrollTop = Math.min(500, target.scrollHeight - target.clientHeight);
    return {
      kind: target === main ? "main" : "document",
      moved: target.scrollTop > 0,
    };
  });
  expect(surface).not.toBeNull();
  expect(surface?.moved).toBe(true);

  await page.locator("aside").getByRole("link", { name: /^Modules\b/ }).click();
  await expect(page).toHaveURL(/\/courses\/knee-mri\/modules$/);
  await expect
    .poll(() =>
      page.evaluate((kind) => {
        const target =
          kind === "main"
            ? document.querySelector<HTMLElement>("#main-content")
            : document.scrollingElement;
        return target?.scrollTop ?? -1;
      }, surface!.kind),
    )
    .toBe(0);
});
