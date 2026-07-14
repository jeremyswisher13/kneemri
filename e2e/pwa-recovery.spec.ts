import { expect, test } from "@playwright/test";
import {
  LOCAL_PREVIEW_PROGRESS_KEY,
  buildElbowPreviewProgress,
  collectRuntimeErrors,
  expectLoadedImages,
  expectNoHorizontalOverflow,
  installPreviewSession,
} from "./helpers";

const WORKSTATION = "/courses/elbow-mri/normal-elbow-mri?mode=explore&series=sag-ir";

async function waitForControlledServiceWorker(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (navigator.serviceWorker.controller) return;
    await new Promise<void>((resolve) => {
      navigator.serviceWorker.addEventListener("controllerchange", () => resolve(), { once: true });
    });
  });
}

async function activeWorkerVersion(page: import("@playwright/test").Page) {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (!worker) return null;
    return new Promise<string | null>((resolve) => {
      const channel = new MessageChannel();
      const timeout = window.setTimeout(() => resolve(null), 3_000);
      channel.port1.onmessage = (event) => {
        window.clearTimeout(timeout);
        resolve(event.data?.cacheVersion ?? null);
      };
      worker.postMessage({ type: "GET_VERSION" }, [channel.port2]);
    });
  });
}

test("installed app recovers progress, route, media, connectivity, and updates", async ({
  context,
  page,
}) => {
  test.setTimeout(120_000);
  await installPreviewSession(context);
  const runtimeErrors = collectRuntimeErrors(page);

  await page.goto(WORKSTATION);
  await expect(page.getByRole("heading", { name: "Interactive Normal Elbow MRI" })).toBeVisible();
  await expectLoadedImages(page);
  await waitForControlledServiceWorker(page);

  const initialVersion = await activeWorkerVersion(page);
  expect(initialVersion).toMatch(/^ucla-sports-mri-v6-e2e-\d+$/);
  const cachedShell = await page.evaluate(async () => {
    const keys = await caches.keys();
    const cache = await caches.open(keys.find((key) => key.startsWith("ucla-sports-mri-v6")) || keys[0]);
    const requests = await cache.keys();
    return requests.map((request) => new URL(request.url).pathname);
  });
  expect(cachedShell).toContain("/index.html");
  expect(cachedShell.some((path) => /^\/assets\/.*\.js$/.test(path))).toBe(true);
  expect(cachedShell.some((path) => /^\/assets\/.*\.css$/.test(path))).toBe(true);

  const progress = buildElbowPreviewProgress("normal");
  await page.evaluate(
    ({ progressKey, value }) => localStorage.setItem(progressKey, JSON.stringify(value)),
    { progressKey: LOCAL_PREVIEW_PROGRESS_KEY, value: progress },
  );
  await page.getByRole("button", { name: "Next slice" }).click();
  const sliceBeforeReload = await page.getByTestId("mri-stack-viewer").getAttribute("data-slice-index");
  expect(Number(sliceBeforeReload)).toBeGreaterThan(14);

  await page.reload();
  await expect(page).toHaveURL(new RegExp("mode=explore&series=sag-ir"));
  await expect(page.getByRole("heading", { name: "Interactive Normal Elbow MRI" })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), LOCAL_PREVIEW_PROGRESS_KEY)).not.toBeNull();
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const keys = await caches.keys();
        const cacheName = keys.find((key) => key.startsWith("ucla-sports-mri-v6"));
        if (!cacheName) return 0;
        const requests = await (await caches.open(cacheName)).keys();
        return requests.filter((request) =>
          new URL(request.url).pathname.startsWith("/images/teaching/stacks/normal-elbow-sagittal/"),
        ).length;
      }),
    )
    .toBe(30);

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText(/Offline mode: previously opened pages/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Interactive Normal Elbow MRI" })).toBeVisible();
  await expectLoadedImages(page);

  await context.setOffline(false);
  await expect.poll(() => page.evaluate(() => navigator.onLine)).toBe(true);
  await expect(page.getByText(/Offline mode: previously opened pages/i)).toBeHidden();

  await page.close();
  const reopened = await context.newPage();
  const reopenedErrors = collectRuntimeErrors(reopened);
  await reopened.goto("/?source=homescreen");
  await expect(reopened).toHaveURL(new RegExp("/courses/elbow-mri/normal-elbow-mri\\?mode=explore&series=sag-ir"));
  await expect(reopened.getByRole("heading", { name: "Interactive Normal Elbow MRI" })).toBeVisible();
  expect(await reopened.evaluate((key) => localStorage.getItem(key), LOCAL_PREVIEW_PROGRESS_KEY)).not.toBeNull();

  await reopened.evaluate(() => fetch("/__e2e/sw-version", { method: "POST" }).then((response) => response.json()));
  await reopened.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  });
  const updatePrompt = reopened.getByTestId("pwa-update-prompt");
  await expect(updatePrompt).toBeVisible({ timeout: 20_000 });
  await Promise.all([
    reopened.waitForEvent("framenavigated", (frame) => frame === reopened.mainFrame()),
    updatePrompt.getByRole("button", { name: "Update now" }).click(),
  ]);
  await reopened.waitForLoadState("domcontentloaded");
  await expect(reopened.getByRole("heading", { name: "Interactive Normal Elbow MRI" })).toBeVisible();
  await expect
    .poll(async () => {
      try {
        const version = await activeWorkerVersion(reopened);
        return version === initialVersion ? null : version;
      } catch {
        return null;
      }
    })
    .toMatch(/^ucla-sports-mri-v6-e2e-\d+$/);

  await expectNoHorizontalOverflow(reopened);
  const unexpectedRuntimeErrors = runtimeErrors.filter(
    (error) => !error.includes("Failed to load resource: net::ERR_INTERNET_DISCONNECTED"),
  );
  expect(unexpectedRuntimeErrors).toEqual([]);
  expect(reopenedErrors).toEqual([]);
});
