import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const developerRoot = path.dirname(fileURLToPath(import.meta.url));
const port = process.env["PLAYWRIGHT_PORT"] ?? "3002";
const baseURL =
  process.env["PLAYWRIGHT_BASE_URL"] ?? `http://127.0.0.1:${port}`;
const isCI = Boolean(process.env["CI"]);

const webServer = process.env["PLAYWRIGHT_SKIP_WEBSERVER"]
  ? null
  : {
      command: "pnpm dev",
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
  fullyParallel: true,
  forbidOnly: isCI,
  outputDir: "e2e/test-results",
  tsconfig: path.join(developerRoot, "tsconfig.playwright.json"),
  ...(isCI ? { workers: 1 } : {}),
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
        ["html", { open: "on-failure", outputFolder: "e2e/playwright-report" }],
      ],
  retries: isCI ? 2 : 0,
  testDir: "./e2e",
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
