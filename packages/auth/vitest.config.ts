import { mergeConfig } from "vitest/config";

import { createNodeProject } from "../../vitest.shared";

const base = createNodeProject(import.meta.url, "@afenda/auth");

export default mergeConfig(base, {
  test: {
    coverage: {
      thresholds: {
        lines: 73,
        statements: 73,
        functions: 83,
        branches: 78,
      },
    },
  },
});
