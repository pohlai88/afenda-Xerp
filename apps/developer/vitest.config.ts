import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const appRoot = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(appRoot, "../..");
const testingRoot = resolve(monorepoRoot, "packages/testing/src");

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(appRoot, "src"),
      },
      {
        find: "@afenda/shadcn-studio-v2/clients",
        replacement: resolve(
          monorepoRoot,
          "packages/shadcn-studio-v2/src/clients.ts"
        ),
      },
      {
        find: "@afenda/shadcn-studio-v2/theme",
        replacement: resolve(
          monorepoRoot,
          "packages/shadcn-studio-v2/src/contexts/theme-boundary.ts"
        ),
      },
      {
        find: "@afenda/shadcn-studio-v2",
        replacement: resolve(
          monorepoRoot,
          "packages/shadcn-studio-v2/src/index.ts"
        ),
      },
      {
        find: "next/link",
        replacement: resolve(testingRoot, "mocks/next-link.tsx"),
      },
      {
        find: "next/image",
        replacement: resolve(testingRoot, "mocks/next-image.tsx"),
      },
      {
        find: "next/navigation",
        replacement: resolve(appRoot, "src/test/mocks/next-navigation.ts"),
      },
    ],
  },
  test: {
    coverage: {
      exclude: [
        "src/**/__tests__/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/**",
        "**/.next/**",
      ],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text", "html", "json", "json-summary"],
      reportsDirectory: resolve(appRoot, "coverage"),
    },
    env: {
      AFENDA_GOVERNANCE_RUNTIME: "strict",
      NODE_ENV: "test",
    },
    environment: "jsdom",
    globals: false,
    hookTimeout: 10_000,
    include: ["src/**/__tests__/**/*.test.{ts,tsx}"],
    isolate: true,
    passWithNoTests: true,
    setupFiles: [resolve(testingRoot, "setup/react.ts")],
    testTimeout: 10_000,
  },
});
