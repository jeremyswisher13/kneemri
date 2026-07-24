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
      await expect(page.getByRole("heading", { name: "Adjust cross-plane markers" })).toBeVisible();
      await expect(page.getByLabel("Cross-plane correlation")).toBeVisible();
      await expect(page.locator('[data-cross-plane-marker="source"]')).toHaveCount(1);
      await expect(page.locator('[data-cross-plane-marker="correct-target"]')).toHaveCount(1);
      await expect(page.getByRole("button", { name: /^Move distractor 1 marker/ })).toHaveCount(1);
      await expect(page.getByRole("button", { name: "Copy cross-plane changes" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Reset cross-plane draft" })).toBeVisible();

      if (workstation.name === "knee") {
        await page.getByRole("button", { name: /^2\. Femoral condyle/ }).click();
        await page.getByRole("slider", { name: /^Slice for/ }).fill("12");
        const linkedDraft = await page.evaluate(() => {
          const key = Object.keys(localStorage).find((candidate) =>
            candidate.startsWith("uclaSportsMri.normalMriAdjustment:"),
          );
          return key ? JSON.parse(localStorage.getItem(key) ?? "{}") : null;
        });
        expect(linkedDraft?.tour?.[1]?.sliceIndex).toBe(12);
        expect(linkedDraft?.quiz?.[1]?.sliceIndex).toBe(12);

        await page.getByLabel("Cross-plane correlation").selectOption("8");
        const aclSourceMarker = page.getByRole("button", {
          name: "Move source marker for Anterior cruciate ligament",
        });
        await aclSourceMarker.focus();
        await aclSourceMarker.press("ArrowRight");
        await page.getByRole("slider", { name: "Source slice for Sagittal PD-FS" }).fill("15");
        await page.getByRole("slider", { name: "Target slice for Coronal PD-FS" }).fill("8");

        const crossPlaneDraft = await page.evaluate(() => {
          const key = Object.keys(localStorage).find((candidate) =>
            candidate.startsWith("uclaSportsMri.normalMriCrossPlaneAdjustment:knee-mri"),
          );
          return key ? JSON.parse(localStorage.getItem(key) ?? "{}") : null;
        });
        expect(crossPlaneDraft?.items?.[8]?.from?.x).toBe(49);
        expect(crossPlaneDraft?.items?.[8]?.from?.sliceIndex).toBe(15);
        expect(crossPlaneDraft?.items?.[8]?.to?.sliceIndex).toBe(8);
      }

      await page.getByRole("button", { name: "Reset to committed" }).click();
      await page.getByRole("button", { name: "Reset cross-plane draft" }).click();
      const draftKeys = await page.evaluate(() =>
        Object.keys(localStorage).filter((key) =>
          key.startsWith("uclaSportsMri.normalMriAdjustment:"),
        ),
      );
      expect(
        draftKeys,
        `${workstation.name} should retain its own marker-adjustment draft`,
      ).toHaveLength(index + 1);
      const crossPlaneDraftKeys = await page.evaluate(() =>
        Object.keys(localStorage).filter((key) =>
          key.startsWith("uclaSportsMri.normalMriCrossPlaneAdjustment:"),
        ),
      );
      expect(
        crossPlaneDraftKeys,
        `${workstation.name} should retain its own cross-plane draft`,
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
      await expect(page.getByRole("heading", { name: "Adjust cross-plane markers" })).toHaveCount(0);
    }
  });
});
