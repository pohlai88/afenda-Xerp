import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineProject } from "vitest/config";

const MONOREPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)));

export const TEST_FILE_PATTERN = "src/**/__tests__/**/*.{test,spec}.{ts,tsx}";

const NODE_SETUP = resolve(MONOREPO_ROOT, "packages/testing/src/setup/node.ts");
const REACT_SETUP = resolve(
  MONOREPO_ROOT,
  "packages/testing/src/setup/react.ts"
);

function coverageOptions(root: string) {
  return {
    provider: "v8" as const,
    reporter: ["text", "html"] as const,
    include: ["src/**/*.{ts,tsx}"],
    exclude: ["src/**/__tests__/**", "**/*.d.ts", "**/dist/**", "**/.next/**"],
    reportsDirectory: resolve(root, "coverage"),
  };
}

export function createNodeProject(importMetaUrl: string, name: string) {
  const root = dirname(fileURLToPath(importMetaUrl));

  return defineProject({
    root,
    test: {
      name,
      environment: "node",
      globals: false,
      include: [TEST_FILE_PATTERN],
      passWithNoTests: true,
      setupFiles: [NODE_SETUP],
      coverage: coverageOptions(root),
    },
  });
}

export function createReactProject(importMetaUrl: string, name: string) {
  const root = dirname(fileURLToPath(importMetaUrl));

  return defineProject({
    root,
    plugins: [react()],
    test: {
      name,
      environment: "jsdom",
      globals: false,
      include: [TEST_FILE_PATTERN],
      passWithNoTests: true,
      setupFiles: [REACT_SETUP],
      coverage: coverageOptions(root),
    },
  });
}
