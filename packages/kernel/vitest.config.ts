import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineProject, mergeConfig } from "vitest/config";

import { createNodeProject } from "../../vitest.shared";

const baseConfig = createNodeProject(import.meta.url, "@afenda/kernel");

/** Large kernel suite — reduce worker load timeouts (PAS-001-AUD-20 G-AUD20-03). */
export default mergeConfig(
  baseConfig,
  defineProject({
    root: dirname(fileURLToPath(import.meta.url)),
    test: {
      pool: "forks",
      fileParallelism: false,
      testTimeout: 20_000,
      hookTimeout: 20_000,
    },
  })
);
