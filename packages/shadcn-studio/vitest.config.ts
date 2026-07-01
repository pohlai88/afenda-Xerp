import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createReactProject,
  GATE_TEST_PATTERN,
  INTERACTION_TEST_PATTERN,
  TEST_FILE_PATTERN,
} from "../../vitest.shared";

const packageRoot = dirname(fileURLToPath(import.meta.url));

const PRIMITIVE_CONTRACT_TEST_PATTERN = "src/**/*.contract.test.{ts,tsx}";

export default createReactProject(import.meta.url, "@afenda/shadcn-studio", {
  alias: {
    // ADR-0038 prefixed buckets
    "@/components-ui": resolve(packageRoot, "src/components-ui"),
    "@/components-layouts": resolve(packageRoot, "src/components-layouts"),
    "@/components-auth-shell": resolve(packageRoot, "src/components-auth-shell"),
    "@/components-app-shell": resolve(packageRoot, "src/components-app-shell"),
    "@/components-assets": resolve(packageRoot, "src/components-assets"),
    // MCP / legacy import paths (components.json + migrated blocks)
    "@/components/ui": resolve(packageRoot, "src/components-ui"),
    "@/components/shadcn-studio": resolve(packageRoot, "src/components-layouts"),
    "@/lib/utils": resolve(packageRoot, "src/utils/utils.ts"),
    "@/utils/utils": resolve(packageRoot, "src/utils/utils.ts"),
    "@": resolve(packageRoot, "src"),
  },
  testInclude: [
    TEST_FILE_PATTERN,
    GATE_TEST_PATTERN,
    PRIMITIVE_CONTRACT_TEST_PATTERN,
    INTERACTION_TEST_PATTERN,
  ],
});
