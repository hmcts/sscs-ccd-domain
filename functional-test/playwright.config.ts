import { defineConfig, devices } from "@playwright/test";
import {urls} from "./config/config";
import path from 'path';


module.exports = defineConfig({
  testDir: "./e2e/",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 2, // Set the number of retries for all projects
  timeout: 3 * 30 * 1000,
  expect: {
    timeout: 60 * 1000,
  },

  /* Opt out of parallel tests on CI. */
  workers: process.env.FUNCTIONAL_TESTS_WORKERS ? 5 : undefined,
  reporter: [["html", { open: 'never',
    outputDir: 'playwright-report',
    host: '0.0.0.0',
    port: 9223,  printSteps: true}]],
  use: {
    baseURL: urls.xuiUrl,
    trace: "on-first-retry",
    screenshot: 'only-on-failure',
    launchOptions: {
      // 1
      args: ["--start-maximized"]
    },
  },
  // globalSetup: '../src/tests/e2e/global.setup.ts',
  projects: [
    {
      name: "chromium",
      use: {
        // ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1040 }
      }
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // {
    //   name: "MobileChrome",
    //   use: { ...devices["Pixel 5"] },
    // },
    // {
    //   name: "MobileSafari",
    //   use: { ...devices["iPhone 12"] },
    // },
    // {
    //   name: "MicrosoftEdge",
    //   use: { ...devices["Desktop Edge"], channel: "msedge" },
    // },
  ],
});
