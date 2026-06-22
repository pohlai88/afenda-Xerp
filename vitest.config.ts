import { defineConfig } from "vitest/config";

const isCI = Boolean(process.env.CI);

/** Workspace unit/integration tests. Browser Storybook tests run via `pnpm test:run:storybook`. */
export default defineConfig({
  test: {
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    testTimeout: 10_000,
    hookTimeout: 10_000,
    reporters: isCI ? ["default", "github-actions", "junit"] : ["default"],
    outputFile: isCI ? { junit: "./test-results/junit.xml" } : undefined,
    projects: [
      "packages/*/vitest.config.ts",
      "apps/*/vitest.config.ts",
      "scripts/vitest.config.ts",
    ],
  },
});
