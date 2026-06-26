import { mergeConfig } from "vitest/config";

import { createNodeProject } from "../../vitest.shared";

const base = createNodeProject(import.meta.url, "@afenda/permissions");

export default mergeConfig(base, {
  test: {
    coverage: {
      thresholds: {
        lines: 85,
        statements: 85,
        functions: 90,
        branches: 79,
      },
    },
  },
});
