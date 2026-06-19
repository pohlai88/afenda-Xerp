import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createReactProject } from "../../vitest.shared";

const root = dirname(fileURLToPath(import.meta.url));

export default createReactProject(import.meta.url, "@afenda/erp", {
  alias: {
    "@": resolve(root, "src"),
  },
});
