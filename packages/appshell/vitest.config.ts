import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineProject, mergeConfig } from "vitest/config";

import { createReactProject } from "../../vitest.shared";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const portableStoriesSetup = path.join(
  dirname,
  "src/__tests__/setup/portable-stories.tsx"
);

/** Heavy ApplicationShell renders need headroom when Storybook browser tests run in parallel. */
export default mergeConfig(
  createReactProject(import.meta.url, "@afenda/appshell", {
    setupFiles: [portableStoriesSetup],
  }),
  defineProject({
    test: {
      pool: "forks",
      fileParallelism: false,
      testTimeout: 60_000,
      hookTimeout: 60_000,
    },
  })
);
