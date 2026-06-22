import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineProject } from "vitest/config";

import { createNodeProject } from "../vitest.shared";

const root = dirname(fileURLToPath(import.meta.url));
const base = createNodeProject(import.meta.url, "scripts/governance");

export default defineProject({
  ...base,
  root,
  test: {
    ...base.test,
    include: ["governance/__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
});
