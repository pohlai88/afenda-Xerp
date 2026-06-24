#!/usr/bin/env tsx
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { checkErpObservabilityGovernance } from "./erp-observability-governance.mjs";
import { collectAllGovernedMutationAuditViolations } from "./lib/governed-mutation-audit-enforcement.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);
const erpSrcRoot = join(repoRoot, "apps/erp/src");
const erpPackagePath = join(repoRoot, "apps/erp/package.json");

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "__tests__") {
        continue;
      }
      files.push(...collectSourceFiles(absolutePath));
      continue;
    }

    if (/\.(?:tsx?|jsx?)$/.test(entry.name)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function validateErpAppVersion(): string[] {
  const erpPackage = JSON.parse(readFileSync(erpPackagePath, "utf8")) as {
    version?: string;
  };
  const defaultsSource = readFileSync(
    join(erpSrcRoot, "lib/observability/erp-diagnostic-defaults.ts"),
    "utf8"
  );

  if (
    typeof erpPackage.version !== "string" ||
    erpPackage.version.length === 0
  ) {
    return ["apps/erp/package.json must define a semver version string."];
  }

  if (!defaultsSource.includes("ERP_APP_VERSION")) {
    return [
      "erp-diagnostic-defaults.ts must derive version from ERP_APP_VERSION.",
    ];
  }

  return [];
}

async function main(): Promise<void> {
  const violations: string[] = [...validateErpAppVersion()];

  for (const filePath of collectSourceFiles(erpSrcRoot)) {
    const source = readFileSync(filePath, "utf8");
    const relativePath = relative(repoRoot, filePath).replaceAll("\\", "/");
    const fileViolations = checkErpObservabilityGovernance(
      source,
      relativePath
    );

    for (const violation of fileViolations) {
      violations.push(`${relativePath}: ${violation}`);
    }
  }

  const auditViolations =
    await collectAllGovernedMutationAuditViolations(repoRoot);

  for (const violation of auditViolations) {
    violations.push(`${violation.file}: ${violation.message}`);
  }

  if (violations.length > 0) {
    console.error("ERP observability governance failed:\n");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("ERP observability governance passed");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
