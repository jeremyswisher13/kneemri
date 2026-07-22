import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, installPreviewSession } from "./helpers";

test.beforeEach(async ({ page }) => {
  await installPreviewSession(page, "admin");
});

test("Friday faculty session is projector-safe and preserves the run-sheet", async ({ page }) => {
  await page.goto("/admin/session");

  await expect(
    page.getByRole("heading", { name: "Knee MRI — Fellows Teaching Session" }),
  ).toBeVisible();
  await expect(page.getByText("Friday, July 24, 2026 · 1:00 – 3:00 PM")).toBeVisible();
  await expect(page.getByText(/Dr. Jeremy Swisher.*Dr. Kimberly Burbank/)).toBeVisible();

  const roomNetworkCheck = page.getByRole("checkbox", {
    name: /Presenter and fellow devices load the sagittal knee stack/,
  });
  await expect(roomNetworkCheck).not.toBeChecked();
  await roomNetworkCheck.check();
  await page.reload();
  await expect(roomNetworkCheck).toBeChecked();

  const caseOneLink = page.getByRole("link", { name: /Open case 1/ });
  await expect(caseOneLink).toHaveAttribute("target", "_blank");
  await expect(caseOneLink).toHaveAttribute(
    "href",
    "/courses/knee-mri/cases/acl-pivot-shift",
  );

  const projectorToggle = page.getByRole("button", { name: "Projector-safe: OFF" });
  await projectorToggle.click();
  await expect(page.getByRole("button", { name: "Projector-safe: ON" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByText("ACL Tear + Pivot-Shift Pattern", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/Teaching focus — faculty only/)).toHaveCount(0);
  await expect(page.getByText(/22\/29/)).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});
