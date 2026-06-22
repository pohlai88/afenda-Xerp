/**
 * Governance script: verify that @afenda/design-system has no React, Radix,
 * shadcn, CSS files, or .tsx component implementation files in `src/`.
 *
 * Exit code 0 = pass, exit code 1 = fail.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const srcDir = join(fileURLToPath(import.meta.url), "../../");

const PROHIBITED_IMPORTS = [
  '"react"',
  "'react'",
  '"react-dom"',
  "'react-dom'",
  '"@radix-ui/',
  "'@radix-ui/",
  '"@/components/ui',
  "'@/components/ui",
];

const PROHIBITED_EXTENSIONS = [".css"];

/**
 * CSS files that are explicitly permitted in src/.
 * `afenda-tokens.css` and `afenda-design-system.css` are @generated build
 * artifacts (gitignored) written by `scripts/generate-tokens-css.ts` for
 * local-dev @import convenience. They are not hand-authored CSS — the source of
 * truth is token.registry.ts. (Never named globals.css — that is app-only.)
 */
const ALLOWED_CSS_FILES = new Set([
  "css\\afenda-tokens.css",
  "css/afenda-tokens.css",
  "css\\afenda-design-system.css",
  "css/afenda-design-system.css",
]);

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
  const ext = extname(file);
  const rel = relative(srcDir, file);

  // No CSS files (except the generated afenda-tokens.css snapshot)
  if (PROHIBITED_EXTENSIONS.includes(ext) && !ALLOWED_CSS_FILES.has(rel)) {
    errors.push(`  ✗ CSS file in src/: ${rel}`);
    continue;
  }

  // No .tsx component implementation files (test files are allowed)
  if (ext === ".tsx" && !rel.includes("__tests__")) {
    errors.push(
      `  ✗ TSX component file in src/: ${rel} — React components belong in @afenda/ui`
    );
    continue;
  }

  // No prohibited imports in .ts files
  if (ext === ".ts" && !rel.includes("__tests__")) {
    const content = readFileSync(file, "utf8");
    for (const imp of PROHIBITED_IMPORTS) {
      if (content.includes(`from ${imp}`)) {
        errors.push(`  ✗ Prohibited import "${imp}" in ${rel}`);
      }
    }
  }
}

if (errors.length > 0) {
  process.stderr.write(
    `check:no-runtime-ui FAILED — ${errors.length} violation(s):\n${errors.join("\n")}\n`
  );
  process.exit(1);
} else {
  process.stdout.write(
    "check:no-runtime-ui PASSED — no React, Radix, shadcn, CSS, or component TSX files found in src/.\n"
  );
}
