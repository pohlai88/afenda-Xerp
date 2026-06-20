import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tokenNameToCssVariable } from "../src/css/token-css-variable.js";
import { tokenRegistry } from "../src/tokens/registry.js";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = join(scriptDirectory, "../dist/css/tokens.css");

const lines = tokenRegistry.tokens.map((token) => {
  const variable = tokenNameToCssVariable(token.name);
  return `  ${variable}: ${token.value};`;
});

const css = `/**
 * @generated — do not edit manually.
 * Source: packages/design-system/src/tokens/registry.ts
 * Regenerate: pnpm --filter @afenda/design-system build
 */
:root {
${lines.join("\n")}
}
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, css, "utf8");
