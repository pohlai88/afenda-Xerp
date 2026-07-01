import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineProject } from "vitest/config";

const MONOREPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)));

export const TEST_FILE_PATTERN = "src/**/__tests__/**/*.{test,spec}.{ts,tsx}";

/** Convention for Radix / user-event interaction suites (subset of TEST_FILE_PATTERN). */
export const INTERACTION_TEST_PATTERN = "**/*.interaction.test.{ts,tsx}";

/** Convention for server/DB integration suites (subset of TEST_FILE_PATTERN). */
export const INTEGRATION_TEST_PATTERN = "**/*.integration.test.{ts,tsx}";

/** CLI path filter for interaction-only runs — matches filenames containing `.interaction.test`. */
export const INTERACTION_CLI_PATH_FILTER = ".interaction.test";

/** Vitest project names that host interaction suites. */
export const INTERACTION_VITEST_PROJECTS = [
  "@afenda/testing",
  "@afenda/shadcn-studio",
] as const;

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
  testInclude?: string[];
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

export function createNodeProject(
  importMetaUrl: string,
  name: string,
  testOverrides: Record<string, unknown> = {}
) {
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
      ...testOverrides,
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

export function createReactProject(
  importMetaUrl: string,
  name: string,
  options: ReactProjectOptions = {}
) {
  const root = dirname(fileURLToPath(importMetaUrl));
  const shadcnStudioSrcRoot = resolve(
    MONOREPO_ROOT,
    "packages/shadcn-studio/src"
  );

  return defineProject({
    root,
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: "@/components/shadcn-studio",
          replacement: resolve(shadcnStudioSrcRoot, "components-layouts"),
        },
        {
          find: "@/components-auth-shell",
          replacement: resolve(shadcnStudioSrcRoot, "components-auth-shell"),
        },
        {
          find: "@/components/ui",
          replacement: resolve(shadcnStudioSrcRoot, "components-ui"),
        },
        {
          find: "@/lib/utils",
          replacement: resolve(shadcnStudioSrcRoot, "utils/utils.ts"),
        },
        {
          find: "@afenda/shadcn-studio",
          replacement: resolve(
            MONOREPO_ROOT,
            "packages/shadcn-studio/src/index.ts"
          ),
        },
        { find: "@", replacement: shadcnStudioSrcRoot },
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
      include: options.testInclude ?? [TEST_FILE_PATTERN],
      environment: "jsdom",
      setupFiles: [REACT_SETUP, ...(options.setupFiles ?? [])],
      env: {
        AFENDA_GOVERNANCE_RUNTIME: "strict",
        NODE_ENV: "test",
      },
    },
  });
}
