import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vitest/config";

import { createNodeProject } from "../../vitest.shared";

const root = dirname(fileURLToPath(import.meta.url));
const base = createNodeProject(import.meta.url, "@afenda/erp");

export default mergeConfig(base, {
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
