import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const storybookPlugins = await storybookTest({
  configDir: path.join(dirname, ".storybook"),
  storybookScript: "pnpm --filter @afenda/storybook storybook -- --no-open",
  storybookUrl: "http://localhost:6006",
});

export default defineConfig({
  define: {
    "import.meta.env.VITEST_STORYBOOK": JSON.stringify(true),
  },
  plugins: [...storybookPlugins],
  test: {
    name: "storybook",
    env: {
      AFENDA_GOVERNANCE_RUNTIME: "off",
      VITEST_STORYBOOK: "true",
    },
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
    setupFiles: [path.join(dirname, ".storybook/vitest.setup.ts")],
  },
});
