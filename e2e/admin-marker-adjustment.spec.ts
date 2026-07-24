import { expect, test } from "@playwright/test";
import {
  collectRuntimeErrors,
  expectNoHorizontalOverflow,
  installPreviewSession,
} from "./helpers";

const WORKSTATIONS = [
  {
    name: "knee",
    path: "/courses/knee-mri/normal-knee-mri",
  },
  {
    name: "shoulder",
    path: "/courses/shoulder-mri/normal-shoulder-mri",
  },
  {
    name: "hip",
    path: "/courses/hip-mri/normal-hip-mri",
  },
  {
    name: "elbow",
    path: "/courses/elbow-mri/normal-elbow-mri",
  },
];

test.describe("administrator marker adjustment", () => {
  test.beforeEach(async ({ context }) => {
    await installPreviewSession(context, "admin");
  });

  test("admins can open every workbench without cross-course draft collisions", async ({
    page,
  }) => {
    const runtimeErrors = collectRuntimeErrors(page);

    for (const [index, workstation] of WORKSTATIONS.entries()) {
      await page.goto(workstation.path);

      const adjustMode = page.locator('[data-normal-mode="adjust"]');
      await expect(adjustMode).toHaveText("Adjust (admin)");
      await adjustMode.click();

      await expect(page.getByRole("heading", { name: /^Adjust markers/ })).toBeVisible();
      await expect(page.getByText(/Your draft is saved on this device as you go/)).toBeVisible();
      await expect(page.getByRole("button", { name: "Copy marker changes" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Reset to committed" })).toBeVisible();

      await page.getByRole("button", { name: "Reset to committed" }).click();
      const draftKeys = await page.evaluate(() =>
        Object.keys(localStorage).filter((key) =>
          key.startsWith("uclaSportsMri.normalMriAdjustment:"),
        ),
      );
      expect(
        draftKeys,
        `${workstation.name} should retain its own marker-adjustment draft`,
      ).toHaveLength(index + 1);

      await expectNoHorizontalOverflow(page);
    }

    expect(runtimeErrors).toEqual([]);
  });
});

test.describe("learner marker adjustment boundary", () => {
  test.beforeEach(async ({ context }) => {
    await installPreviewSession(context, "fellow");
  });

  test("fellows do not receive the authoring controls", async ({ page }) => {
    for (const workstation of WORKSTATIONS) {
      await page.goto(workstation.path);
      await expect(page.locator('[data-normal-mode="adjust"]')).toHaveCount(0);
      await expect(page.getByRole("heading", { name: /^Adjust markers/ })).toHaveCount(0);
    }
  });
});
