import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createReactProject } from "../../vitest.shared";

const packageRoot = dirname(fileURLToPath(import.meta.url));

export default createReactProject(import.meta.url, "@afenda/shadcn-studio", {
  alias: {
    "@": resolve(packageRoot, "src"),
  },
});
