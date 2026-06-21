import { defineConfig } from "vitest/config";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  test: {
    pool: "forks",
    maxWorkers: isCI ? 2 : 4,
    fileParallelism: false,
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
      "apps/storybook/vitest.storybook.config.ts",
    ],
  },
});
