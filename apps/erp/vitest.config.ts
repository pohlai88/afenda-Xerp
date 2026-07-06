import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { mergeConfig } from "vitest/config";

import { createNodeProject } from "../../vitest.shared";

const root = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(root, "../..");
const testingRoot = resolve(monorepoRoot, "packages/testing/src");
const base = createNodeProject(import.meta.url, "@afenda/erp");

export default mergeConfig(base, {
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(root, "src"),
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
        find: "@afenda/shadcn-studio-v2/metadata",
        replacement: resolve(
          monorepoRoot,
          "packages/shadcn-studio-v2/src/metadata.ts"
        ),
      },
      {
        find: "@afenda/shadcn-studio-v2",
        replacement: resolve(
          monorepoRoot,
          "packages/shadcn-studio-v2/src/index.ts"
        ),
      },
    ],
  },
  test: {
    environmentMatchGlobs: [
      ["src/**/*.client.test.tsx", "jsdom"],
      ["src/**/*.interaction.test.tsx", "jsdom"],
    ],
    setupFiles: [
      resolve(monorepoRoot, "packages/testing/src/setup/node.ts"),
      resolve(testingRoot, "setup/react.ts"),
    ],
  },
});
