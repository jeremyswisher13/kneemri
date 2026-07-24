import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, installPreviewSession } from "./helpers";

const NORMAL_KNEE_CHUNK = /\/assets\/NormalKneeMriPage-[^/]+\.js(?:\?.*)?$/;
const NORMAL_KNEE_ROUTE = "/courses/knee-mri/normal-knee-mri?mode=explore&series=sag-pdfs";

test.beforeEach(async ({ context }) => {
  await installPreviewSession(context);
});

test("a slow page load becomes actionable instead of looking frozen", async ({ page }) => {
  let releaseChunk = () => {};
  const chunkGate = new Promise<void>((resolve) => {
    releaseChunk = resolve;
  });
  await page.route(NORMAL_KNEE_CHUNK, async (route) => {
    await chunkGate;
    await route.continue();
  });

  const navigation = page.goto(NORMAL_KNEE_ROUTE);
  const loader = page.getByRole("status", { name: "Opening this page..." });
  await expect(loader).toBeVisible();
  await expect(loader.getByText("Taking longer than expected")).toBeVisible({
    timeout: 5_000,
  });
  await expect(loader.getByRole("button", { name: "Try again" })).toBeVisible();
  await expectNoHorizontalOverflow(page);

  releaseChunk();
  await navigation;
  await expect(page.getByRole("heading", { name: "Interactive Normal Knee MRI" })).toBeVisible();
});

test("a failed page download offers clear recovery paths", async ({ page }) => {
  await page.route(NORMAL_KNEE_CHUNK, (route) => route.abort("failed"));
  await page.goto(NORMAL_KNEE_ROUTE);

  const fallback = page.getByRole("alert");
  await expect(fallback.getByRole("heading", { name: "This page needs a quick refresh" })).toBeVisible();
  await expect(fallback.getByRole("button", { name: "Reload app" })).toBeVisible();
  await expect(fallback.getByRole("link", { name: "Return to courses" })).toHaveAttribute("href", "/");
  await expect(fallback.getByRole("link", { name: "Get support" })).toHaveAttribute("href", "/support");
  await expect(fallback).toContainText("Any progress already recorded to your account remains saved.");
  await expectNoHorizontalOverflow(page);
});
