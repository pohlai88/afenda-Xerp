#!/usr/bin/env tsx
/**
 * Kernel policy wire serializability gate (PAS-001 §4.9).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const requiredFiles = [
  "packages/kernel/src/policy/policy-decision.contract.ts",
  "packages/kernel/src/policy/policy-decision.assert.ts",
  "packages/kernel/src/policy/policy-decision.parser.ts",
  "packages/kernel/src/policy/index.ts",
  "packages/kernel/src/policy/__tests__/policy-decision.parser.test.ts",
  "packages/kernel/src/policy/__tests__/policy-vocabulary.contract.test.ts",
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

if (!packageJson.exports?.["./policy"]) {
  violations.push("packages/kernel/package.json missing ./policy export");
}

if (violations.length > 0) {
  console.error("Kernel policy wire serializable gate failed:");
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log("Kernel policy wire serializable gate passed.");
