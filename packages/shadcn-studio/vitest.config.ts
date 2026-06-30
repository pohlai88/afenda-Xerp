import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createReactProject,
  INTERACTION_TEST_PATTERN,
  TEST_FILE_PATTERN,
} from "../../vitest.shared";

const packageRoot = dirname(fileURLToPath(import.meta.url));

const PRIMITIVE_CONTRACT_TEST_PATTERN = "src/**/*.contract.test.{ts,tsx}";

export default createReactProject(import.meta.url, "@afenda/shadcn-studio", {
  alias: {
    "@": resolve(packageRoot, "src"),
  },
  testInclude: [
    TEST_FILE_PATTERN,
    PRIMITIVE_CONTRACT_TEST_PATTERN,
    INTERACTION_TEST_PATTERN,
  ],
});
