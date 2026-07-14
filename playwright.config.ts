import { defineConfig, devices } from "@playwright/test";

const PORT = 4190;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "audit-output/playwright-results",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["line"],
    ["html", { outputFolder: "audit-output/playwright-report", open: "never" }],
  ],
  expect: { timeout: 10_000 },
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["iPhone 13"],
        browserName: "chromium",
      },
    },
  ],
  webServer: {
    command: "npm run e2e:serve",
    url: `http://127.0.0.1:${PORT}/__e2e/health`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
