import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const developerRoot = path.dirname(fileURLToPath(import.meta.url));
const port = process.env["PLAYWRIGHT_PORT"] ?? "3002";
const baseURL =
  process.env["PLAYWRIGHT_BASE_URL"] ?? `http://127.0.0.1:${port}`;
const isCI = Boolean(process.env["CI"]);
const nextCliPath = path.join(developerRoot, "node_modules/next/dist/bin/next");

const webServer = process.env["PLAYWRIGHT_SKIP_WEBSERVER"]
  ? null
  : {
      command: `"${process.execPath}" "${nextCliPath}" dev --port ${port}`,
      cwd: developerRoot,
      env: {
        NODE_ENV: "development",
      },
      reuseExistingServer: !isCI,
      timeout: 120_000,
      url: baseURL,
    };

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  // Route-lab smoke runs against a local Next dev server on port 3002.
  // Serializing the suite avoids Fast Refresh contention across parallel contexts.
  fullyParallel: false,
  forbidOnly: isCI,
  outputDir: "test-results/artifacts",
  tsconfig: path.join(developerRoot, "tsconfig.playwright.json"),
  workers: 1,
  projects: [
    {
      name: "chromium-smoke",
      grep: /@smoke/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  reporter: isCI
    ? [["blob"], ["github"]]
    : [
        ["list"],
        [
          "html",
          {
            open: "on-failure",
            outputFolder: "test-results/playwright-report",
          },
        ],
      ],
  retries: isCI ? 2 : 0,
  testMatch: "**/*.spec.ts",
  testDir: "./src/app",
  timeout: 60_000,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: isCI ? "retain-on-failure" : "on-first-retry",
    video: "retain-on-failure",
    viewport: { width: 1440, height: 900 },
  },
  ...(webServer ? { webServer } : {}),
});
