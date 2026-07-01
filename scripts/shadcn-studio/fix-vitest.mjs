import { readFileSync, writeFileSync } from "node:fs";

const pkg = "packages/shadcn-studio";
writeFileSync(
  `${pkg}/vitest.config.ts`,
  `import { dirname, resolve } from "node:path";
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
    "@/components/ui": resolve(packageRoot, "src/components-ui"),
    "@/components/shadcn-studio": resolve(packageRoot, "src/components-layouts"),
    "@/components-auth-shell": resolve(packageRoot, "src/components-auth-shell"),
    "@/components-app-shell": resolve(packageRoot, "src/components-app-shell"),
    "@/components-assets": resolve(packageRoot, "src/components-assets"),
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
`
);
let lib = readFileSync(`${pkg}/src/lib/_lib-inventory.registry.ts`, "utf8");
lib = lib.replace(/ {2}\{\n {4}file: "utils\.ts",[\s\S]*? {2}\},\n/, "");
writeFileSync(`${pkg}/src/lib/_lib-inventory.registry.ts`, lib);
let uiTest = readFileSync(
  `${pkg}/src/meta-gates/__tests__/ui-primitive-metadata.registry.test.ts`,
  "utf8"
);
uiTest = uiTest.replace("../../components/ui", "../../components-ui");
writeFileSync(
  `${pkg}/src/meta-gates/__tests__/ui-primitive-metadata.registry.test.ts`,
  uiTest
);
console.log("done");
