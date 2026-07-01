import { readFileSync, writeFileSync } from "node:fs";
writeFileSync(
  "packages/shadcn-studio/src/lib/__tests__/utils.test.ts",
  readFileSync("packages/shadcn-studio/src/lib/__tests__/utils.test.ts", "utf8").replace(
    'from "../utils.js"',
    'from "../../utils/utils.js"'
  )
);
let t = readFileSync(
  "packages/shadcn-studio/src/components-layouts/__tests__/metadata-bound-blocks.render.test.tsx",
  "utf8"
);
t = t.replace("../login-page-04/", "../../components-auth-shell/login-page-04/");
t = t.replace("../../../../meta-gates/", "../../../meta-gates/");
writeFileSync(
  "packages/shadcn-studio/src/components-layouts/__tests__/metadata-bound-blocks.render.test.tsx",
  t
);
const vitest = JSON.parse(readFileSync("packages/shadcn-studio/tsconfig.vitest.json", "utf8"));
vitest.include = [
  "src/**/gate/**/*",
  "src/**/__tests__/**/*",
  "src/**/__mocks__/**/*",
  "src/**/*.contract.test.ts",
  "src/**/*.interaction.test.tsx",
  "src/**/*.d.ts",
  "src/**/*.tsx",
];
writeFileSync("packages/shadcn-studio/tsconfig.vitest.json", JSON.stringify(vitest, null, 2) + "\n");
