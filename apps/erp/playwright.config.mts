/**
 * ERP Playwright E2E — auth spine smoke against local Next dev server.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const erpRoot = path.dirname(fileURLToPath(import.meta.url));
const port = process.env["PLAYWRIGHT_PORT"] ?? "3000";
const baseURL =
  process.env["PLAYWRIGHT_BASE_URL"] ?? `http://127.0.0.1:${port}`;
const isCI = Boolean(process.env["CI"]);

const webServer = process.env["PLAYWRIGHT_SKIP_WEBSERVER"]
  ? null
  : {
      command: "pnpm dev",
      cwd: erpRoot,
      env: {
        NODE_ENV: "development",
      },
      reuseExistingServer: !isCI,
      timeout: 180_000,
      url: `${baseURL}/sign-in`,
    };

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  forbidOnly: isCI,
  outputDir: "e2e/test-results",
  projects: [
    {
      name: "chromium-smoke",
      grep: /@smoke/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  reporter: isCI ? [["blob"], ["github"]] : [["list"]],
  retries: isCI ? 2 : 0,
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  timeout: 60_000,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: isCI ? "retain-on-failure" : "on-first-retry",
    viewport: { width: 1440, height: 900 },
  },
  ...(webServer ? { webServer } : {}),
});
