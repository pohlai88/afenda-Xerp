#!/usr/bin/env tsx
/**
 * PAS-001A B74 — metadata context authorization bridge gate.
 *
 * Proves metadata workspace consumes verified OperatingContext from ERP spine.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const erpSrcRoot = join(repoRoot, "apps/erp/src");
const metadataWorkspacePage = join(
  erpSrcRoot,
  "app/(protected)/metadata-workspace/page.tsx"
);
const metadataLibRoot = join(erpSrcRoot, "lib/metadata");
const parseProtectedActionInput = join(
  erpSrcRoot,
  "lib/server-actions/parse-protected-action-input.ts"
);

const FORBIDDEN_METADATA_DATABASE_IMPORTS = [
  /@afenda\/database\/dist\//,
  /@afenda\/database\/src\//,
  /@afenda\/database\/(company|organization|rls|workspace|membership)\//,
] as const;

export interface MetadataContextAuthorizationBridgeViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function listSourceFiles(directory: string): string[] {
  if (!existsSync(directory)) {
    return [];
  }

  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue;
      }
      files.push(...listSourceFiles(fullPath));
      continue;
    }

    if (
      /\.(ts|tsx|mts)$/.test(entry.name) &&
      !/\.(test|spec)\./.test(entry.name)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

export function checkMetadataContextAuthorizationBridge(): MetadataContextAuthorizationBridgeViolation[] {
  const violations: MetadataContextAuthorizationBridgeViolation[] = [];

  if (!existsSync(metadataWorkspacePage)) {
    violations.push({
      rule: "metadata-workspace-page-missing",
      file: metadataWorkspacePage,
      message: "metadata-workspace/page.tsx is required",
    });
  } else {
    const pageSource = readFileSync(metadataWorkspacePage, "utf8");
    if (!pageSource.includes("resolveOperatingContextFromHeaders")) {
      violations.push({
        rule: "metadata-spine-resolver-missing",
        file: metadataWorkspacePage,
        message:
          "metadata-workspace/page.tsx must delegate to resolveOperatingContextFromHeaders",
      });
    }
  }

  if (existsSync(parseProtectedActionInput)) {
    const actionSource = readFileSync(parseProtectedActionInput, "utf8");
    if (!actionSource.includes("rejectUntrustedAuthorityFields")) {
      violations.push({
        rule: "metadata-action-authority-guard-missing",
        file: parseProtectedActionInput,
        message:
          "Protected action ingress must reject untrusted authority fields",
      });
    }
  }

  for (const file of listSourceFiles(metadataLibRoot)) {
    const source = readFileSync(file, "utf8");
    for (const pattern of FORBIDDEN_METADATA_DATABASE_IMPORTS) {
      if (pattern.test(source)) {
        violations.push({
          rule: "forbidden-database-deep-import",
          file,
          message:
            "metadata ERP lib must not deep-import @afenda/database paths",
        });
      }
    }
  }

  return violations;
}

function main(): void {
  const violations = checkMetadataContextAuthorizationBridge();
  if (violations.length > 0) {
    for (const violation of violations) {
      process.stderr.write(
        `[${violation.rule}] ${violation.file}\n  ${violation.message}\n`
      );
    }
    process.exit(1);
  }

  process.stdout.write(
    "Metadata context authorization bridge gate passed (PAS-001A B74).\n"
  );
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-metadata-context-authorization-bridge.mts")
    );
  } catch {
    return entry.endsWith("check-metadata-context-authorization-bridge.mts");
  }
})();

if (isDirectRun) {
  main();
}
