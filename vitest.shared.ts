import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineProject } from "vitest/config";

const MONOREPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)));

export const TEST_FILE_PATTERN = "src/**/__tests__/**/*.{test,spec}.{ts,tsx}";

/** Convention for Radix / user-event interaction suites (subset of TEST_FILE_PATTERN). */
export const INTERACTION_TEST_PATTERN = "**/*.interaction.test.{ts,tsx}";

const NODE_SETUP = resolve(MONOREPO_ROOT, "packages/testing/src/setup/node.ts");
const REACT_SETUP = resolve(
  MONOREPO_ROOT,
  "packages/testing/src/setup/react.ts"
);
const NEXT_LINK_MOCK = resolve(
  MONOREPO_ROOT,
  "packages/testing/src/mocks/next-link.tsx"
);
const NEXT_IMAGE_MOCK = resolve(
  MONOREPO_ROOT,
  "packages/testing/src/mocks/next-image.tsx"
);

const WORKSPACE_DEPS = {
  inline: [/@afenda\//] as const,
};

export interface ReactProjectOptions {
  alias?: Record<string, string>;
  setupFiles?: string[];
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
    testTimeout: 10_000,
    hookTimeout: 10_000,
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
  const governanceRoot = resolve(srcRoot, "governance");

  return defineProject({
    root,
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: /^@afenda\/ui\/governance\/(.+)$/,
          replacement: `${governanceRoot}/$1`,
        },
        {
          find: "@afenda/ui/governance",
          replacement: resolve(governanceRoot, "index.ts"),
        },
        {
          find: "@afenda/ui/lib/utils",
          replacement: resolve(srcRoot, "lib/utils.ts"),
        },
        {
          find: "@afenda/ui",
          replacement: resolve(srcRoot, "index.ts"),
        },
        { find: "@", replacement: srcRoot },
        { find: "#", replacement: srcRoot },
        { find: "next/link", replacement: NEXT_LINK_MOCK },
        { find: "next/image", replacement: NEXT_IMAGE_MOCK },
      ],
    },
    server: {
      deps: WORKSPACE_DEPS,
    },
    test: {
      ...sharedTestOptions(name, root),
      environment: "jsdom",
      setupFiles: [REACT_SETUP],
      env: {
        AFENDA_GOVERNANCE_RUNTIME: "strict",
        NODE_ENV: "test",
      },
    },
  });
}

export function createReactProject(
  importMetaUrl: string,
  name: string,
  options: ReactProjectOptions = {}
) {
  const root = dirname(fileURLToPath(importMetaUrl));
  const uiSrcRoot = resolve(MONOREPO_ROOT, "packages/ui/src");
  const uiGovernanceRoot = resolve(uiSrcRoot, "governance");
  const appshellSrcRoot = resolve(MONOREPO_ROOT, "packages/appshell/src");

  return defineProject({
    root,
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: /^@afenda\/ui\/governance\/(.+)$/,
          replacement: `${uiGovernanceRoot}/$1`,
        },
        {
          find: "@afenda/ui/governance",
          replacement: resolve(uiGovernanceRoot, "index.ts"),
        },
        {
          find: "@afenda/ui/lib/utils",
          replacement: resolve(uiSrcRoot, "lib/utils.ts"),
        },
        {
          find: "@afenda/ui",
          replacement: resolve(uiSrcRoot, "index.ts"),
        },
        {
          find: "@afenda/appshell",
          replacement: resolve(appshellSrcRoot, "index.ts"),
        },
        { find: "next/link", replacement: NEXT_LINK_MOCK },
        { find: "next/image", replacement: NEXT_IMAGE_MOCK },
        ...Object.entries(options.alias ?? {}).map(([find, replacement]) => ({
          find,
          replacement,
        })),
      ],
    },
    server: {
      deps: WORKSPACE_DEPS,
    },
    test: {
      ...sharedTestOptions(name, root),
      environment: "jsdom",
      setupFiles: [REACT_SETUP, ...(options.setupFiles ?? [])],
      env: {
        AFENDA_GOVERNANCE_RUNTIME: "strict",
        NODE_ENV: "test",
      },
    },
  });
}
