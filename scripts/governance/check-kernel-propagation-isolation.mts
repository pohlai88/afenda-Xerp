#!/usr/bin/env tsx
/**
 * Kernel async propagation isolation gate (PAS-001 §4.10).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const requiredFiles = [
  "packages/kernel/src/propagation/kernel-context-frame.contract.ts",
  "packages/kernel/src/propagation/kernel-context.ts",
  "packages/kernel/src/propagation/index.ts",
  "packages/kernel/src/__tests__/kernel-context.test.ts",
] as const;

const violations: string[] = [];

for (const relativePath of requiredFiles) {
  if (!existsSync(join(repoRoot, relativePath))) {
    violations.push(`missing file: ${relativePath}`);
  }
}

const frameContractPath = join(
  repoRoot,
  "packages/kernel/src/propagation/kernel-context-frame.contract.ts"
);
if (existsSync(frameContractPath)) {
  const source = readFileSync(frameContractPath, "utf8");
  const allowedFrameKeys = [
    "correlationId",
    "executionContext",
    "tenantId",
  ] as const;

  const propertyMatches = source.matchAll(/^\s*readonly\s+(\w+):/gm);
  for (const match of propertyMatches) {
    const key = match[1];
    if (
      key &&
      !allowedFrameKeys.includes(key as (typeof allowedFrameKeys)[number])
    ) {
      violations.push(
        `kernel-context-frame.contract.ts has unexpected frame property: ${key}`
      );
    }
  }
}

const propagationTestPath = join(
  repoRoot,
  "packages/kernel/src/__tests__/kernel-context.test.ts"
);
if (existsSync(propagationTestPath)) {
  const testSource = readFileSync(propagationTestPath, "utf8");
  if (!(/fork\(/.test(testSource) && /isolat/i.test(testSource))) {
    violations.push(
      "kernel-context.test.ts must include fork() isolation coverage"
    );
  }
}

const packageJson = JSON.parse(
  readFileSync(join(repoRoot, "packages/kernel/package.json"), "utf8")
) as { exports?: Record<string, unknown> };

if (!packageJson.exports?.["./propagation"]) {
  violations.push("packages/kernel/package.json missing ./propagation export");
}

if (violations.length > 0) {
  console.error("Kernel propagation isolation gate failed:");
  for (const violation of violations) {
    console.error(`  - ${violation}`);
  }
  process.exit(1);
}

console.log("Kernel propagation isolation gate passed.");
