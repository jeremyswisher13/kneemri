import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, installPreviewSession } from "./helpers";

test.beforeEach(async ({ page }) => {
  await installPreviewSession(page);
});

test("knee search-pattern navigation keeps the teaching viewer in sync", async ({ page }) => {
  await page.goto("/courses/knee-mri/search-pattern?step=1");

  await expect(
    page.getByRole("button", { name: /Verify & Orient.*Sagittal PD-FS/ }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: "Sagittal PD-FS slice 14" })).toBeVisible();

  await page.getByRole("button", { name: "Next Step" }).click();

  await expect(
    page.getByRole("button", { name: /Bones & Marrow.*Coronal PD-FS/ }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: "Coronal PD-FS slice 8" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("knee case stays blind through commit and keeps images beside every step", async ({ page }) => {
  await page.goto("/courses/knee-mri/cases/acl-pivot-shift");

  await expect(page.getByRole("heading", { name: "Knee MRI Case", exact: true })).toBeVisible();
  await expect(page.getByText("ACL Tear + Pivot-Shift Pattern", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Complete ACL tear — abnormal angulation/i)).toHaveCount(0);
  await expect(page.getByText("acl", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("img", { name: "Case teaching image 1" })).toBeVisible();

  await page.getByRole("button", { name: /Begin Case Walkthrough/ }).click();
  await expect(page.getByRole("heading", { name: "Case images", exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Case teaching image 1" })).toBeVisible();

  for (let step = 1; step < 7; step += 1) {
    await page.getByRole("button", { name: /Next Step/ }).click();
    await expect(page.getByRole("heading", { name: "Case images", exact: true })).toBeVisible();
  }
  await page.getByRole("button", { name: /Commit your read/ }).click();

  await expect(page.getByRole("heading", { name: "Knee MRI Case", exact: true })).toBeVisible();
  await expect(page.getByText("ACL Tear + Pivot-Shift Pattern", { exact: true })).toHaveCount(0);
  await expect(page.getByPlaceholder(/Name the primary lesion/)).toBeVisible();
  await expectNoHorizontalOverflow(page);

  await page.getByRole("button", { name: "Skip and reveal" }).click();
  await expect(
    page.getByRole("heading", { name: "ACL Tear + Pivot-Shift Pattern", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Key Diagnoses", exact: true })).toBeVisible();
});
