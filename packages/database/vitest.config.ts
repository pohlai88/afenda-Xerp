import { mergeConfig } from "vitest/config";

import { createDatabaseProject } from "../../vitest.shared";

const base = createDatabaseProject(import.meta.url, "@afenda/database");

export default mergeConfig(base, {
  test: {
    coverage: {
      thresholds: {
        lines: 61,
        statements: 61,
        functions: 52,
        branches: 73,
      },
    },
  },
});
