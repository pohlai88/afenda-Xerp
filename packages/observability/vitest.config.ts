import { mergeConfig } from "vitest/config";

import { createNodeProject } from "../../vitest.shared";

const base = createNodeProject(import.meta.url, "@afenda/observability");

export default mergeConfig(base, {
  test: {
    coverage: {
      thresholds: {
        lines: 90,
        statements: 90,
        functions: 90,
        branches: 80,
      },
    },
  },
});
