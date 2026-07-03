#!/usr/bin/env node
/**
 * Gate — forbid dynamic noir CSS loaders in Storybook stories (Vitest browser regression).
 *
 * Per-theme noir CSS must use a static import at the top of a dedicated story file
 * (see presentation-lab-login-*-stories.tsx). Dynamic `await import()` in loaders
 * fails under @storybook/addon-vitest browser with ESM fetch errors.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const STORY_ROOTS = [
  join(repoRoot, "apps/storybook"),
  join(repoRoot, "packages/shadcn-studio/src"),
];

const FORBIDDEN_PATTERNS = [
  {
    id: "dynamic-side-effect-loader",
    re: /await\s+import\s*\(\s*["'][^"']*presentation-lab-login-styles\/[^"']*side-effect/,
    message:
      "Use static CSS import in a dedicated story file (see presentation-lab-login-styles/README.md).",
  },
  {
    id: "dynamic-noir-css-loader",
    re: /await\s+import\s*\(\s*["'][^"']*docs\/(?:swiss|verdant)-noir\.css/,
    message:
      "Import noir CSS statically at the story file top — dynamic CSS imports break Vitest browser.",
  },
];

function collectStoryFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === "node_modules" || entry === "dist") {
        continue;
      }
      collectStoryFiles(fullPath, acc);
      continue;
    }

    if (/\.stories\.tsx$/.test(entry)) {
      acc.push(fullPath);
    }
  }

  return acc;
}

const files = STORY_ROOTS.flatMap((root) => collectStoryFiles(root));

const violations = [];

for (const filePath of files) {
  const source = readFileSync(filePath, "utf8");
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.re.test(source)) {
      violations.push({
        file: relative(repoRoot, filePath),
        rule: pattern.id,
        message: pattern.message,
      });
    }
  }
}

if (violations.length > 0) {
  console.error("check-storybook-noir-css-imports: FAIL\n");
  for (const v of violations) {
    console.error(`  ${v.file}`);
    console.error(`    [${v.rule}] ${v.message}\n`);
  }
  process.exit(1);
}

console.log(
  `check-storybook-noir-css-imports: OK (${files.length} story file(s) scanned)`
);
