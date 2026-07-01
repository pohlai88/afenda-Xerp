#!/usr/bin/env tsx
/**
 * PAS-API-001 — ERP API import authority guard.
 *
 * `meta-contracts/` is PAS-006 shadcn-studio L1 only.
 * ERP REST runtime and tests must import from `server/api/contracts/`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const ERP_API_IMPORT_AUTHORITY_GATE =
  "check:erp-api-import-authority" as const;

export const ERP_API_IMPORT_AUTHORITY_MESSAGE =
  "ERP must not import meta-contracts/ — use apps/erp/src/server/api/contracts/ (PAS-API-001). meta-contracts/ is PAS-006 shadcn-studio only.";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const erpRoot = join(repoRoot, "apps/erp");

const SKIP_DIRS = new Set([
  ".git",
  ".next",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);

const SOURCE_FILE_PATTERN = /\.(tsx?|jsx?|mts|mjs|cjs)$/;

export interface ErpApiImportAuthorityViolation {
  readonly file: string;
  readonly line: number;
  readonly message: string;
  readonly rule: "forbidden-meta-contracts-import";
}

function dirname(path: string): string {
  return path.slice(0, Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\")) + 1);
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/");
}

function collectSourceFiles(directory: string, files: string[] = []): string[] {
  if (!existsSync(directory)) {
    return files;
  }

  for (const name of readdirSync(directory)) {
    const absolute = join(directory, name);

    if (statSync(absolute).isDirectory()) {
      if (SKIP_DIRS.has(name)) {
        continue;
      }
      collectSourceFiles(absolute, files);
      continue;
    }

    if (SOURCE_FILE_PATTERN.test(name)) {
      files.push(absolute);
    }
  }

  return files;
}

export function scanErpApiImportAuthority(
  rootDirectory: string = erpRoot
): readonly ErpApiImportAuthorityViolation[] {
  const violations: ErpApiImportAuthorityViolation[] = [];
  const forbiddenPattern = /meta-contracts/;

  for (const absolutePath of collectSourceFiles(rootDirectory)) {
    const source = readFileSync(absolutePath, "utf8");

    if (!forbiddenPattern.test(source)) {
      continue;
    }

    const relativePath = normalizePath(relative(rootDirectory, absolutePath));
    const lines = source.split("\n");

    for (const [index, line] of lines.entries()) {
      if (forbiddenPattern.test(line)) {
        violations.push({
          rule: "forbidden-meta-contracts-import",
          file: relativePath,
          line: index + 1,
          message: ERP_API_IMPORT_AUTHORITY_MESSAGE,
        });
      }
    }
  }

  return violations;
}

export function checkErpApiImportAuthority(
  rootDirectory: string = erpRoot
): void {
  const violations = scanErpApiImportAuthority(rootDirectory);

  if (violations.length === 0) {
    console.log(`✓ ${ERP_API_IMPORT_AUTHORITY_GATE} passed`);
    return;
  }

  console.error(
    `✗ ${ERP_API_IMPORT_AUTHORITY_GATE} failed (${violations.length} violation(s)):`
  );

  for (const violation of violations) {
    console.error(
      `  [${violation.rule}] ${violation.file}:${violation.line} — ${violation.message}`
    );
  }

  process.exitCode = 1;
}

function main(): void {
  checkErpApiImportAuthority();
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  return entry.endsWith("check-erp-api-import-authority.mts");
})();

if (isDirectRun) {
  main();
}
