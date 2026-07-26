import { expect, test } from "@playwright/test";
import {
  expectNoHorizontalOverflow,
  installPreviewSession,
  LOCAL_PREVIEW_PROGRESS_KEY,
} from "./helpers";

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

test("knee case list keeps unopened diagnoses out of cards and search", async ({ page }) => {
  await page.goto("/courses/knee-mri/cases");

  await expect(page.getByText("acl", { exact: true })).toHaveCount(0);
  await expect(page.getByText("root-tear", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText("Diagnosis hidden until you complete the case.", { exact: true }),
  ).toHaveCount(13);

  await page
    .getByRole("searchbox", { name: "Search cases by clinical presentation" })
    .fill("root-tear");
  await expect(
    page.getByRole("link", { name: "Start case 4: Intermediate Knee MRI case" }),
  ).toHaveCount(0);
});

test("knee case stays blind through commit and keeps images beside every step", async ({ page }) => {
  await page.goto("/courses/knee-mri/cases/acl-pivot-shift");

  await expect(page.getByRole("heading", { name: "Knee MRI Case", exact: true })).toBeVisible();
  await expect(page.getByText("ACL Tear + Pivot-Shift Pattern", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Complete ACL tear — abnormal angulation/i)).toHaveCount(0);
  await expect(page.getByText("acl", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("img", { name: "Case teaching image 1" })).toBeVisible();
  await expect(page.locator('a[href*="radiopaedia.org"]')).toHaveCount(0);
  await expect(page.getByTestId("external-case-locked")).toContainText(
    "Unlocks after you commit your read or choose Skip and reveal.",
  );

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
  await page.getByRole("button", { name: "Clinical", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /Open the full scrollable MRI on Radiopaedia/ }),
  ).toHaveAttribute(
    "href",
    "https://radiopaedia.org/cases/pivot-shift-injury-with-acl-tear?lang=us",
  );
});

// The blinding test above can only exercise cases that HAVE embedded images.
// Cases without them (multiligament, post-repair-retear, acl-graft-evaluation)
// render a different branch that used to print the expectedFindings answer key
// on the opening screen, before any commit.
test("image-less knee case does not leak its findings before commit", async ({ page }) => {
  await page.goto("/courses/knee-mri/cases/multiligament");

  await expect(page.getByRole("heading", { name: "Knee MRI Case", exact: true })).toBeVisible();
  // The branch is reached at all (i.e. this case really has no embedded images).
  await expect(page.getByTestId("image-review-focus-locked")).toContainText(
    "Unlocks after you commit your read or choose Skip and reveal.",
  );
  await expect(page.getByTestId("image-review-focus")).toHaveCount(0);

  // The specific answer-key strings that used to render here.
  await expect(page.getByText(/ACL complete tear/i)).toHaveCount(0);
  await expect(page.getByText(/PCL complete tear/i)).toHaveCount(0);
  await expect(page.getByText(/LCL tear \(PLC disruption\)/i)).toHaveCount(0);
  await expect(page.getByText("Multiligament Knee Injury", { exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: /Begin Case Walkthrough/ }).click();
  for (let step = 1; step < 7; step += 1) {
    await page.getByRole("button", { name: /Next Step/ }).click();
  }
  await page.getByRole("button", { name: /Commit your read/ }).click();
  await page.getByRole("button", { name: "Skip and reveal" }).click();

  // After the commit gate the same block is expected to appear.
  await expect(page.getByRole("button", { name: "Clinical", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clinical", exact: true }).click();
  await expect(page.getByTestId("image-review-focus")).toBeVisible();
  await expect(page.getByTestId("image-review-focus-locked")).toHaveCount(0);
});

// `committed` used to be visit-only component state, so a fellow reopening a case
// they finished last week saw it fully re-blinded — generic heading, no diagnosis,
// external MRI link locked — while the cases list, keyed off the same persisted
// attempt, already showed that case's diagnoses.
test("a completed knee case reopens revealed, and Try Again re-blinds it", async ({ page }) => {
  await page.goto("/courses/knee-mri/cases");
  await page.evaluate(
    ({ key, caseId }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          quizAttempts: [],
          surveyResponses: [],
          moduleProgress: {},
          caseAttempts: [
            {
              id: "e2e-completed-knee-case",
              courseId: "knee-mri",
              caseId,
              searchPatternChecklist: {},
              report: "",
              completedAt: { seconds: Math.floor(Date.now() / 1000) },
            },
          ],
          normalPlanes: {},
          reviewCards: {},
        }),
      );
      window.dispatchEvent(new Event("uclaSportsMri:localPreviewProgress"));
    },
    { key: LOCAL_PREVIEW_PROGRESS_KEY, caseId: "acl-pivot-shift" },
  );

  // The list surface treats it as done...
  await expect(
    page.getByRole("link", { name: "Review case: ACL Tear + Pivot-Shift Pattern" }),
  ).toBeVisible();

  // ...so the case page has to agree instead of starting over from blinded.
  await page.goto("/courses/knee-mri/cases/acl-pivot-shift");
  await expect(
    page.getByRole("heading", { name: "ACL Tear + Pivot-Shift Pattern", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Knee MRI Case", exact: true })).toHaveCount(0);
  await expect(page.getByTestId("external-case-locked")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Open the full scrollable MRI on Radiopaedia/ }),
  ).toBeVisible();

  // Reaching the review step goes straight to the answer key: the commit gate
  // would be theatre once the diagnosis is already on screen.
  await page.getByRole("button", { name: /Begin Case Walkthrough/ }).click();
  for (let step = 1; step < 7; step += 1) {
    await page.getByRole("button", { name: /Next Step/ }).click();
  }
  await page.getByRole("button", { name: /Commit your read/ }).click();
  await expect(page.getByRole("heading", { name: "Key Diagnoses", exact: true })).toBeVisible();
  await expect(page.getByPlaceholder(/Name the primary lesion/)).toHaveCount(0);

  // Try Again still hands back a genuinely blinded second pass, even though the
  // saved attempt for this case never goes away.
  await page.getByRole("button", { name: "Try Again" }).click();
  await page.getByRole("button", { name: "Start Over" }).click();
  await expect(page.getByRole("heading", { name: "Knee MRI Case", exact: true })).toBeVisible();
  await expect(
    page.getByText("ACL Tear + Pivot-Shift Pattern", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId("external-case-locked")).toBeVisible();
});
