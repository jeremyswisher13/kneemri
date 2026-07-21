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

test("knee case remains diagnostically blind before review", async ({ page }) => {
  await page.goto("/courses/knee-mri/cases/patellar-tendon-rupture");

  await expect(page.getByRole("heading", { name: "Knee MRI Case", exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /patellar tendon/i }),
  ).toHaveCount(0);
});
