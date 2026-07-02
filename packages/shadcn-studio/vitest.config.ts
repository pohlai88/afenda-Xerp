import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createReactProject } from "../../vitest.shared";

const packageRoot = dirname(fileURLToPath(import.meta.url));

/** All package tests live under src/__tests__/ (repo convention). */
const STUDIO_TEST_PATTERN = "src/__tests__/**/*.{test,spec}.{ts,tsx}";

export default createReactProject(import.meta.url, "@afenda/shadcn-studio", {
  alias: {
    "@/components/ui": resolve(packageRoot, "src/components-ui"),
    "@/components/shadcn-studio": resolve(
      packageRoot,
      "src/components-layouts"
    ),
    "@/lib/utils": resolve(packageRoot, "src/utils/utils.ts"),
    "@/utils/utils": resolve(packageRoot, "src/utils/utils.ts"),
    "@": resolve(packageRoot, "src"),
  },
  testInclude: [STUDIO_TEST_PATTERN],
});
