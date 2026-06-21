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
const NEXT_LINK_MOCK = resolve(
  MONOREPO_ROOT,
  "packages/testing/src/mocks/next-link.tsx"
);

const WORKSPACE_DEPS = {
  inline: [/@afenda\//] as const,
};

export interface ReactProjectOptions {
  alias?: Record<string, string>;
}

function coverageOptions(root: string) {
  return {
    provider: "v8" as const,
    reporter: ["text", "html", "json", "json-summary"] as const,
    include: ["src/**/*.{ts,tsx}"],
    exclude: [
      "src/**/__tests__/**",
      "**/*.d.ts",
      "**/*.config.*",
      "**/index.ts",
      "**/__fixtures__/**",
      "**/__mocks__/**",
      "**/dist/**",
      "**/.next/**",
      "**/generated/**",
      "**/drizzle/**",
      "**/supabase/**",
    ],
    reportsDirectory: resolve(root, "coverage"),
  };
}

function sharedTestOptions(name: string, root: string) {
  return {
    name,
    globals: false,
    isolate: true,
    include: [TEST_FILE_PATTERN],
    passWithNoTests: true,
    coverage: coverageOptions(root),
  };
}

export function createNodeProject(importMetaUrl: string, name: string) {
  const root = dirname(fileURLToPath(importMetaUrl));

  return defineProject({
    root,
    server: {
      deps: WORKSPACE_DEPS,
    },
    test: {
      ...sharedTestOptions(name, root),
      environment: "node",
      setupFiles: [NODE_SETUP],
    },
  });
}

export function createDatabaseProject(importMetaUrl: string, name: string) {
  const root = dirname(fileURLToPath(importMetaUrl));

  return defineProject({
    root,
    server: {
      deps: WORKSPACE_DEPS,
    },
    test: {
      ...sharedTestOptions(name, root),
      environment: "node",
      setupFiles: [NODE_SETUP],
      pool: "forks",
      fileParallelism: false,
      testTimeout: 20_000,
      hookTimeout: 20_000,
    },
  });
}

export function createUiProject(importMetaUrl: string, name: string) {
  const root = dirname(fileURLToPath(importMetaUrl));
  const srcRoot = resolve(root, "src");

  return defineProject({
    root,
    plugins: [react()],
    resolve: {
      alias: {
        "@": srcRoot,
        "#": srcRoot,
        "next/link": NEXT_LINK_MOCK,
      },
    },
    server: {
      deps: WORKSPACE_DEPS,
    },
    test: {
      ...sharedTestOptions(name, root),
      environment: "jsdom",
      setupFiles: [REACT_SETUP],
    },
  });
}

export function createReactProject(
  importMetaUrl: string,
  name: string,
  options: ReactProjectOptions = {}
) {
  const root = dirname(fileURLToPath(importMetaUrl));

  return defineProject({
    root,
    plugins: [react()],
    resolve: {
      alias: {
        "next/link": NEXT_LINK_MOCK,
        ...options.alias,
      },
    },
    server: {
      deps: WORKSPACE_DEPS,
    },
    test: {
      ...sharedTestOptions(name, root),
      environment: "jsdom",
      setupFiles: [REACT_SETUP],
    },
  });
}
