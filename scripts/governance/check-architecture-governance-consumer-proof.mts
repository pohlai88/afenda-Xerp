#!/usr/bin/env tsx
/**
 * PAS-002A §4.3 / B40 — governance consumer import proof gate.
 *
 * Validates scripts/governance/check-*.mts and scripts/quality/*.mjs import
 * @afenda/architecture-authority through approved root or /surface barrels only.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const governanceDir = join(repoRoot, "scripts/governance");
const qualityDir = join(repoRoot, "scripts/quality");

const FORBIDDEN_DEEP_IMPORT_PATTERN =
  /@afenda\/architecture-authority\/(?!surface["'])[^"']+/;

const RELATIVE_DEEP_IMPORT_PATTERN =
  /packages\/architecture-authority\/src\/(?!index\.ts|surface\/)[^"'`]+/;

const GOVERNANCE_ALLOWLIST = new Set([
  "check-architecture-authority-surface.mts",
  "check-architecture-governance-consumer-proof.mts",
  "check-architecture-kernel-non-duplication.mts",
]);

const errors: string[] = [];

function collectFiles(directory: string, predicate: (name: string) => boolean): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isFile()) {
      continue;
    }
    if (predicate(entry.name)) {
      files.push(join(directory, entry.name));
    }
  }
  return files;
}

function extractImportSpecifiers(content: string): string[] {
  const specifiers: string[] = [];
  const importPattern = /\bfrom\s+["']([^"']+)["']/g;
  for (const match of content.matchAll(importPattern)) {
    if (match[1]) {
      specifiers.push(match[1]);
    }
  }
  return specifiers;
}

function scanFile(filePath: string, allowlisted: boolean): void {
  const content = readFileSync(filePath, "utf8");
  const relativePath = filePath.replace(/\\/g, "/").slice(repoRoot.length + 1);

  for (const specifier of extractImportSpecifiers(content)) {
    if (FORBIDDEN_DEEP_IMPORT_PATTERN.test(specifier)) {
      errors.push(
        `${relativePath}: deep @afenda/architecture-authority import (${specifier}) — use root or /surface only`
      );
    }

    if (
      !allowlisted &&
      RELATIVE_DEEP_IMPORT_PATTERN.test(specifier)
    ) {
      errors.push(
        `${relativePath}: deep relative architecture-authority import (${specifier}) — use src/index.ts or src/surface/ only`
      );
    }
  }
}

for (const filePath of collectFiles(
  governanceDir,
  (name) => name.startsWith("check-") && name.endsWith(".mts")
)) {
  scanFile(filePath, GOVERNANCE_ALLOWLIST.has(filePath.split(/[/\\]/).pop() ?? ""));
}

for (const filePath of collectFiles(qualityDir, (name) => name.endsWith(".mjs"))) {
  scanFile(filePath, false);
}

const qualitySources = collectFiles(qualityDir, (name) => name.endsWith(".mjs"))
  .map((filePath) => readFileSync(filePath, "utf8"))
  .join("\n");

if (
  !qualitySources.includes("validateArchitecture") &&
  !qualitySources.includes("quality:architecture") &&
  !qualitySources.includes("loadArchitectureAuthority")
) {
  errors.push(
    "scripts/quality/*.mjs must reference validateArchitecture, loadArchitectureAuthority, or quality:architecture"
  );
}

if (errors.length > 0) {
  console.error("architecture-governance-consumer-proof: FAIL");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("architecture-governance-consumer-proof: PASS");
