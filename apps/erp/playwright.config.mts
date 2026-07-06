/**
 * ERP Playwright E2E — deferred post ADR-0027 skeleton reset.
 * No specs under apps/erp/e2e/ yet. Re-expand when @smoke suite returns.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const erpRoot = path.dirname(fileURLToPath(import.meta.url));
const port = process.env["PLAYWRIGHT_PORT"] ?? "3000";
const baseURL =
  process.env["PLAYWRIGHT_BASE_URL"] ?? `http://localhost:${port}`;
const isCI = Boolean(process.env["CI"]);

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
});
