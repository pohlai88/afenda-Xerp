import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineProject, mergeConfig } from "vitest/config";

import { createReactProject } from "../../vitest.shared";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const portableStoriesSetup = path.join(
  dirname,
  "src/__tests__/setup/portable-stories.tsx"
);

/** Heavy ApplicationShell renders need longer timeouts under parallel workspace load. */
export default mergeConfig(
  createReactProject(import.meta.url, "@afenda/appshell", {
    setupFiles: [portableStoriesSetup],
  }),
  defineProject({
    test: {
      testTimeout: 60_000,
      hookTimeout: 60_000,
    },
  })
);
