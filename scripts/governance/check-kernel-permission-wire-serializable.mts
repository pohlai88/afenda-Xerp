#!/usr/bin/env tsx
/**
 * Kernel permission wire serializability gate (PAS-001 §8).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const requiredFiles = [
  "packages/kernel/src/permission/permission-model.contract.ts",
  "packages/kernel/src/permission/permission-model.assert.ts",
  "packages/kernel/src/permission/permission-model.parser.ts",
  "packages/kernel/src/permission/index.ts",
  "packages/kernel/src/permission/__tests__/permission-model.parser.test.ts",
  "packages/kernel/src/permission/__tests__/permission-vocabulary.contract.test.ts",
] as const;

const forbiddenPatterns = [
  /:\s*Function\b/,
  /\bDate\b(?!Format)/,
  /\bMap\b/,
  /\bSet\b/,
  /\bSymbol\b/,
] as const;

const violations: string[] = [];

for (const relativePath of requiredFiles) {
  const absolutePath = join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) {
    violations.push(`missing file: ${relativePath}`);
    continue;
  }

  if (!relativePath.includes("__tests__")) {
    const source = readFileSync(absolutePath, "utf8");
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(source)) {
        violations.push(
          `${relativePath} contains forbidden wire type pattern ${pattern}`
        );
      }
    }
  }
}

const packageJson = JSON.parse(
  readFileSync(join(repoRoot, "packages/kernel/package.json"), "utf8")
) as { exports?: Record<string, unknown> };

if (!packageJson.exports?.["./permission"]) {
  violations.push("packages/kernel/package.json missing ./permission export");
}

if (violations.length > 0) {
  console.error("Kernel permission wire serializable gate failed:");
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log("Kernel permission wire serializable gate passed.");
