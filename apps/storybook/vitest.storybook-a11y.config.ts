import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const storybookTestEntry = path.join(
  dirname,
  "node_modules/storybook/dist/test/index.js"
);

const storybookPlugins = await storybookTest({
  configDir: path.join(dirname, ".storybook"),
  storybookScript: "pnpm --filter @afenda/storybook storybook -- --no-open",
  storybookUrl: "http://localhost:6006",
  tags: {
    include: ["a11y-smoke"],
    exclude: ["skip-test"],
  },
});

export default defineConfig({
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-dom/client",
      "@afenda/shadcn-studio",
    ],
  },
  define: {
    "import.meta.env.VITEST_STORYBOOK": JSON.stringify(true),
    __AFENDA_VITEST_STORYBOOK__: JSON.stringify("true"),
    __AFENDA_VITEST_STORYBOOK_A11Y__: JSON.stringify("true"),
  },
  plugins: [...storybookPlugins],
  resolve: {
    alias: {
      "storybook/test": storybookTestEntry,
    },
  },
  test: {
    name: "storybook-a11y",
    pool: "forks",
    fileParallelism: false,
    maxWorkers: 1,
    testTimeout: 60_000,
    hookTimeout: 60_000,
    server: {
      deps: {
        inline: [/@afenda\//],
      },
    },
    env: {
      AFENDA_GOVERNANCE_RUNTIME: "off",
      VITEST_STORYBOOK: "true",
      VITEST_STORYBOOK_A11Y: "true",
    },
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
      api: {
        host: "127.0.0.1",
        port: 49_153,
        strictPort: false,
      },
    },
    setupFiles: [path.join(dirname, ".storybook/vitest-a11y.setup.ts")],
  },
});
