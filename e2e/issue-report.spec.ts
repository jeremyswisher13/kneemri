import { expect, test } from "@playwright/test";
import {
  LOCAL_ISSUE_REPORTS_KEY,
  LOCAL_PREVIEW_ROLE_KEY,
  collectRuntimeErrors,
  expectNoHorizontalOverflow,
  loginThroughPreviewButton,
} from "./helpers";

test("a fellow can report exact MRI context and an admin can resolve it", async ({ page }) => {
  const runtimeErrors = collectRuntimeErrors(page);
  const workstation =
    "/courses/elbow-mri/normal-elbow-mri?mode=tour&series=sag-ir";
  await loginThroughPreviewButton(page, workstation);
  await expect(page.getByText(/Step 1 of \d+/)).toBeVisible();

  await page.getByTestId("report-issue-button").click();
  const dialog = page.getByRole("dialog", { name: "Report an issue" });
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Cancel" })).toBeFocused();
  await expect(dialog).toContainText("Guided Tour");
  await expect(dialog).toContainText("Sagittal IR");
  await expect(dialog).toContainText(/Slice \d+/);
  await dialog.getByText("Marker location", { exact: true }).click();
  await dialog.getByRole("button", { name: "Send report" }).click();
  await expect(dialog.getByText("Report received", { exact: true })).toBeVisible();

  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) || "[]"), LOCAL_ISSUE_REPORTS_KEY);
  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({
    category: "marker-location",
    courseId: "elbow-mri",
    mode: "Guided Tour",
    seriesId: "sag-ir",
    pageKind: "normal-mri",
    status: "open",
  });
  for (const forbidden of ["uid", "email", "name", "freeText", "notes", "userAgent"]) {
    expect(Object.prototype.hasOwnProperty.call(stored[0], forbidden), forbidden).toBe(false);
  }
  await dialog.getByRole("button", { name: "Done" }).click();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");

  await page.evaluate((roleKey) => sessionStorage.setItem(roleKey, "admin"), LOCAL_PREVIEW_ROLE_KEY);
  await page.goto("/admin");
  await page.getByRole("button", { name: "Elbow MRI" }).click();
  await page.getByRole("button", { name: "Issue Reports" }).click();
  const row = page.getByTestId("issue-report-row");
  await expect(row).toContainText("Marker location");
  await expect(row).toContainText("Guided Tour");
  await expect(row).toContainText("Sagittal IR");
  await expect(row.getByRole("link", { name: "Open screen" })).toHaveAttribute("href", workstation);

  const status = row.getByRole("combobox", { name: /Status for Marker location/ });
  await status.selectOption("resolved");
  await page.getByRole("button", { name: "Resolved (1)" }).click();
  await expect(page.getByTestId("issue-report-row")).toContainText("Resolved");

  await expectNoHorizontalOverflow(page);
  expect(runtimeErrors).toEqual([]);
});
