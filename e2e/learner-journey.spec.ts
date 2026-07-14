import { expect, test } from "@playwright/test";
import {
  ELBOW_PATH,
  collectRuntimeErrors,
  expectNoHorizontalOverflow,
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
