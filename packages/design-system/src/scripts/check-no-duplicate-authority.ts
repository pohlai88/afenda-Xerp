/**
 * Governance script: verify no duplicate design authority exists outside the
 * approved registries in packages/design-system.
 *
 * Detects files that declare local token/variant/recipe registries outside
 * the approved `src/registries/` folder, which would create split authority.
 *
 * Exit code 0 = pass, exit code 1 = fail.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = join(fileURLToPath(import.meta.url), "../../");
const APPROVED_REGISTRY_DIR = join(srcDir, "registries");

// Patterns that indicate a local authority registry
const DUPLICATE_AUTHORITY_PATTERNS = [
  "tokenRegistry =",
  "variantRegistry =",
  "recipeRegistry =",
  "AFENDA_TOKEN_REGISTRY =",
  "AFENDA_VARIANT_REGISTRY =",
  "AFENDA_RECIPE_REGISTRY =",
];

const errors: string[] = [];

function walkDir(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = walkDir(srcDir);

for (const file of allFiles) {
  if (extname(file) !== ".ts") continue;
  if (file.includes("__tests__")) continue;
  // Files in the approved registries folder are fine
  if (file.startsWith(APPROVED_REGISTRY_DIR)) continue;

  const content = readFileSync(file, "utf8");
  const rel = relative(srcDir, file);

  for (const pattern of DUPLICATE_AUTHORITY_PATTERNS) {
    // Allow re-export shims (lines with just `export { ... } from ...`)
    if (content.includes(pattern) && !content.includes(`export {`)) {
      errors.push(
        `  ✗ Duplicate authority pattern "${pattern}" in ${rel} — registries must live in src/registries/`
      );
    }
  }
}

if (errors.length > 0) {
  process.stderr.write(
    `check:no-duplicate-authority FAILED — ${errors.length} violation(s):\n${errors.join("\n")}\n`
  );
  process.exit(1);
} else {
  process.stdout.write(
    `check:no-duplicate-authority PASSED — no duplicate registry authority detected outside src/registries/.\n`
  );
}
