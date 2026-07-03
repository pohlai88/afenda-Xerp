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
    include: ["lab-smoke"],
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
  },
  plugins: [...storybookPlugins],
  resolve: {
    alias: {
      "storybook/test": storybookTestEntry,
    },
  },
  test: {
    name: "storybook",
    passWithNoTests: false,
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
    },
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
      // Default 63315 sits in Windows Hyper-V excluded range 63267–63366 (EACCES).
      // Pin IPv4 + a safe port so Storybook browser tests can bind locally.
      api: {
        host: "127.0.0.1",
        port: 49_152,
        strictPort: false,
      },
    },
    setupFiles: [path.join(dirname, ".storybook/vitest.setup.ts")],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage/storybook",
      reporter: ["text", "json-summary", "lcov"],
      include: ["../../packages/shadcn-studio/src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.stories.tsx",
        "**/storybook/**",
        "**/__tests__/**",
        "**/*.test.{ts,tsx}",
      ],
    },
  },
});
