import { expect, test } from "@playwright/test";
import { collectRuntimeErrors, installPreviewSession } from "./helpers";

const MODULE_PATH = "/courses/elbow-mri/modules/elbow-mri-orientation";

test("unfinished module answers survive a cancelled cross-app navigation", async ({ context, page }) => {
  await installPreviewSession(context);
  const runtimeErrors = collectRuntimeErrors(page);

  await page.goto(MODULE_PATH);
  await page.getByRole("button", { name: "Take Module Quiz" }).click();
  await page.getByRole("radio").first().click();

  const searchPatternLink = page.getByRole("link", {
    name: /Step 1 of the systematic search pattern/i,
  });

  await searchPatternLink.click();
  await expect(page.getByRole("dialog", { name: "Leave this quiz?" })).toBeVisible();
  await page.getByRole("button", { name: "Stay on quiz" }).click();
  await expect(page).toHaveURL(new RegExp(`${MODULE_PATH}$`));
  await expect(page.getByRole("radio").first()).toHaveAttribute("aria-checked", "true");

  await searchPatternLink.click();
  await expect(page.getByRole("dialog", { name: "Leave this quiz?" })).toBeVisible();
  await page.getByRole("button", { name: "Leave quiz" }).click();
  await expect(page).toHaveURL(/\/courses\/elbow-mri\/search-pattern\?step=1$/);

  expect(runtimeErrors).toEqual([]);
});

test("unfinished assessment answers cannot be discarded by sidebar navigation", async ({
  context,
  page,
}, testInfo) => {
  await installPreviewSession(context);
  await page.goto("/courses/elbow-mri/pre-assessment/quiz");
  const firstAnswer = page.getByRole("radio").first();
  await firstAnswer.click();

  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  const modulesLink = page.locator("aside").getByRole("link", { name: /^Modules\b/ });
  await modulesLink.click();

  await expect(page.getByRole("dialog", { name: "Leave this assessment?" })).toBeVisible();
  await page.getByRole("button", { name: "Stay here" }).click();
  await expect(page).toHaveURL(/\/courses\/elbow-mri\/pre-assessment\/quiz$/);
  await expect(firstAnswer).toHaveAttribute("aria-checked", "true");

  if (testInfo.project.name === "mobile-chromium") {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  await modulesLink.click();
  await page.getByRole("button", { name: "Leave and discard" }).click();
  await expect(page).toHaveURL(/\/courses\/elbow-mri\/modules$/);
});
