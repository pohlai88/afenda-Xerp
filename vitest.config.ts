import { defineConfig } from "vitest/config";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  test: {
    pool: "threads",
    restoreMocks: true,
    clearMocks: true,
    mockReset: true,
    testTimeout: 10_000,
    hookTimeout: 10_000,
    reporters: isCI ? ["default", "github-actions", "junit"] : ["default"],
    outputFile: isCI ? { junit: "./test-results/junit.xml" } : undefined,
    projects: [
      "packages/*/vitest.config.ts",
      "packages/ui/vitest.storybook.config.ts",
      "apps/*/vitest.config.ts",
    ],
  },
});
