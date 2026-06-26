import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

import { resolveErpAdminAuthStoragePath } from "@afenda/testing/e2e/auth-paths";

const erpRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(erpRoot, "../..");
loadEnv({ path: path.join(repoRoot, ".env") });
loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
loadEnv({ path: path.join(erpRoot, ".env.local"), override: true });

const port = process.env["PLAYWRIGHT_PORT"] ?? "3000";
const baseURL =
  process.env["PLAYWRIGHT_BASE_URL"] ?? `http://localhost:${port}`;
const e2eDefaultTenantSlug =
  process.env["AFENDA_E2E_DEFAULT_TENANT_SLUG"] ?? "dev-local";
const authFile = resolveErpAdminAuthStoragePath(erpRoot);
const isCI = Boolean(process.env["CI"]);
const productionWebServer = isCI && !process.env["PLAYWRIGHT_SKIP_WEBSERVER"];
const prebuiltProductionServer = process.env["PLAYWRIGHT_PREBUILT"] === "true";

const webServer = process.env["PLAYWRIGHT_SKIP_WEBSERVER"]
  ? null
  : productionWebServer
    ? {
        command: prebuiltProductionServer
          ? `pnpm next start --port ${port}`
          : `pnpm build && pnpm next start --port ${port}`,
        env: {
          NODE_ENV: "production",
          PLAYWRIGHT_CSP_PRODUCTION_AUDIT: "true",
          AFENDA_E2E_DEFAULT_TENANT_SLUG: e2eDefaultTenantSlug,
        },
        reuseExistingServer: false,
        timeout: 300_000,
        url: baseURL,
      }
    : {
        command: "pnpm dev",
        env: {
          PLAYWRIGHT_CSP_PRODUCTION_AUDIT: "false",
          AFENDA_E2E_DEFAULT_TENANT_SLUG: e2eDefaultTenantSlug,
          AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR:
            process.env["AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR"] ?? "enforce-all",
          AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS:
            process.env["AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS"] ?? "true",
        },
        reuseExistingServer: true,
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
  tsconfig: path.join(erpRoot, "tsconfig.playwright.json"),
  ...(isCI ? { workers: 1 } : {}),
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "chromium-smoke",
      dependencies: ["setup"],
      grep: /@smoke/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
    },
    {
      name: "chromium-staging",
      dependencies: ["setup"],
      grep: /@staging/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
      },
    },
    {
      name: "chromium-full",
      dependencies: ["setup"],
      grepInvert: /@smoke/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
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
