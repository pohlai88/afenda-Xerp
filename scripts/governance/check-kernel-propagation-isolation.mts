#!/usr/bin/env tsx
/**
 * Kernel async propagation isolation gate (PAS-001 §4.10 / §4.11).
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
  "packages/kernel/src/propagation/kernel-context-frame.assert.ts",
  "packages/kernel/src/propagation/kernel-context-frame.parser.ts",
  "packages/kernel/src/propagation/kernel-context.ts",
  "packages/kernel/src/propagation/index.ts",
] as const;

const propagationTestPaths = [
  "packages/kernel/src/propagation/__tests__/kernel-context.test.ts",
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

  const frameInterfaceMatch = source.match(
    /export interface KernelContextFrame\s*\{([\s\S]*?)\n\}/
  );
  const frameInterfaceBody = frameInterfaceMatch?.[1] ?? "";

  const propertyMatches = frameInterfaceBody.matchAll(
    /^\s*readonly\s+(\w+):/gm
  );
  for (const match of propertyMatches) {
    const key = match[1];
    if (
      key &&
      !allowedFrameKeys.includes(key as (typeof allowedFrameKeys)[number])
    ) {
      violations.push(
        `KernelContextFrame has unexpected frame property: ${key}`
      );
    }
  }
}

const propagationTestPath = propagationTestPaths.find((relativePath) =>
  existsSync(join(repoRoot, relativePath))
);

if (propagationTestPath === undefined) {
  violations.push(
    "missing propagation test: expected packages/kernel/src/propagation/__tests__/kernel-context.test.ts (legacy root path also accepted)"
  );
} else {
  const testSource = readFileSync(join(repoRoot, propagationTestPath), "utf8");
  if (!(/fork\(/.test(testSource) && /isolat/i.test(testSource))) {
    violations.push(
      `${propagationTestPath} must include fork() isolation coverage`
    );
  }
  if (
    !/serializeKernelContextFrame|normalizeKernelContextFrameForWire/.test(
      testSource
    )
  ) {
    violations.push(
      `${propagationTestPath} must include kernel context frame wire serialization coverage`
    );
  }
}

const propagationIndexPath = join(
  repoRoot,
  "packages/kernel/src/propagation/index.ts"
);
if (existsSync(propagationIndexPath)) {
  const indexSource = readFileSync(propagationIndexPath, "utf8");
  for (const symbol of [
    "serializeKernelContextFrame",
    "normalizeKernelContextFrameForWire",
    "assertKernelContextFrame",
    "assertWireKernelContextFrame",
  ] as const) {
    if (!indexSource.includes(symbol)) {
      violations.push(
        `packages/kernel/src/propagation/index.ts missing export: ${symbol}`
      );
    }
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
