#!/usr/bin/env tsx
/**
 * ADR-0024 — ensure createMockExecutionContext overrides use canonical enterprise IDs.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const CANONICAL_ID_PATTERN = /^[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}$/;

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  "dist",
  ".next",
  ".turbo",
  "coverage",
  ".git",
]);

const ID_FIELDS =
  /(?:actorId|companyId|correlationId|executionId|organizationId|tenantId):\s*["']([^"']+)["']/g;

const MOCK_CONTEXT_CALL =
  /createMockExecutionContext\s*\(\s*\{([\s\S]*?)\}\s*\)/g;

function walkSourceFiles(directory: string, files: string[] = []): string[] {
  for (const entry of readdirSync(directory)) {
    if (SKIP_DIR_NAMES.has(entry)) {
      continue;
    }

    const absolutePath = join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      walkSourceFiles(absolutePath, files);
      continue;
    }

    if (/\.(?:ts|tsx|mts)$/.test(entry)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function collectViolations(source: string, relativePath: string): string[] {
  const violations: string[] = [];

  for (const match of source.matchAll(MOCK_CONTEXT_CALL)) {
    const block = match[1] ?? "";

    for (const idMatch of block.matchAll(ID_FIELDS)) {
      const literal = idMatch[1] ?? "";

      if (CANONICAL_ID_PATTERN.test(literal)) {
        continue;
      }

      violations.push(
        `${relativePath}: createMockExecutionContext override "${literal}" is not canonical (use MOCK_EXECUTION_TEST_* exports).`
      );
    }
  }

  return violations;
}

function main(): void {
  const violations: string[] = [];

  for (const absolutePath of walkSourceFiles(repoRoot)) {
    const relativePath = relative(repoRoot, absolutePath).replace(/\\/g, "/");
    const source = readFileSync(absolutePath, "utf8");

    if (!source.includes("createMockExecutionContext")) {
      continue;
    }

    violations.push(...collectViolations(source, relativePath));
  }

  if (violations.length > 0) {
    console.error(
      "Mock execution context fixture gate failed (ADR-0024 / PAS-001 §4.1):\n"
    );

    for (const violation of violations) {
      console.error(`  - ${violation}`);
    }

    process.exit(1);
  }

  console.log(
    "Mock execution context fixture gate passed — no legacy createMockExecutionContext string overrides."
  );
}

main();
