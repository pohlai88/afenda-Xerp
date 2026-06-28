#!/usr/bin/env tsx
/**
 * PAS-002A §4.1 / B38 — kernel boundary non-duplication gate.
 *
 * Scans packages/architecture-authority/src/ for forbidden ID family / parser /
 * assert duplication that belongs in @afenda/kernel (PAS-001 §4.1 / ADR-0021).
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import {
  type ArchitectureKernelScanTarget,
  scanArchitectureKernelNonDuplication,
} from "../../packages/architecture-authority/src/policy/architecture-kernel-non-duplication.policy.ts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const scanRoot = join(repoRoot, "packages/architecture-authority/src");

function collectSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }
    if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      files.push(absolutePath);
    }
  }

  return files;
}

const targets: ArchitectureKernelScanTarget[] = collectSourceFiles(
  scanRoot
).map((absolutePath) => ({
  relativePath: relative(repoRoot, absolutePath),
  content: readFileSync(absolutePath, "utf8"),
}));

const violations = scanArchitectureKernelNonDuplication(targets);

if (violations.length > 0) {
  console.error("architecture-kernel-non-duplication: FAIL");
  for (const violation of violations) {
    console.error(`  - ${violation.relativePath}: ${violation.message}`);
  }
  process.exit(1);
}

console.log("architecture-kernel-non-duplication: PASS");
