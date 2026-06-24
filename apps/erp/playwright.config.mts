import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
loadEnv({ path: path.join(repoRoot, ".env") });
loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
loadEnv({ path: path.join(repoRoot, "apps/erp/.env.local"), override: true });

const port = process.env.PLAYWRIGHT_PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  outputDir: "e2e/test-results",
  tsconfig: path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "tsconfig.playwright.json"
  ),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: process.env.CI ? "github" : "list",
  retries: process.env.CI ? 2 : 0,
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : process.env.CI
      ? {
          command: `pnpm build && pnpm next start --port ${port}`,
          reuseExistingServer: false,
          timeout: 300_000,
          url: baseURL,
        }
      : {
          command: "pnpm dev",
          reuseExistingServer: true,
          timeout: 120_000,
          url: baseURL,
        },
});
