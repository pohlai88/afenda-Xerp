import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

const docsRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(docsRoot, "../..");

loadEnv({ path: path.join(repoRoot, ".env") });
loadEnv({ path: path.join(repoRoot, ".env.local"), override: true });
loadEnv({ path: path.join(docsRoot, ".env.local"), override: true });

const port = process.env["PLAYWRIGHT_DOCS_PORT"] ?? "3017";
const baseURL =
  process.env["PLAYWRIGHT_DOCS_BASE_URL"] ?? `http://localhost:${port}`;
const isCI = Boolean(process.env["CI"]);

const webServer = process.env["PLAYWRIGHT_SKIP_WEBSERVER"]
  ? null
  : {
      command: `pnpm exec next start --port ${port}`,
      cwd: docsRoot,
      env: {
        ...process.env,
        NODE_ENV: "production",
      },
      reuseExistingServer: process.env["PLAYWRIGHT_REUSE_SERVER"] === "true",
      timeout: 120_000,
      url: baseURL,
    };

export default defineConfig({
  expect: {
    timeout: 15_000,
  },
  forbidOnly: isCI,
  outputDir: "e2e/test-results",
  tsconfig: path.join(docsRoot, "tsconfig.playwright.json"),
  projects: [
    {
      name: "chromium-docs",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  reporter: isCI ? [["github"]] : [["list"]],
  retries: isCI ? 1 : 0,
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
  ...(webServer ? { webServer } : {}),
});
