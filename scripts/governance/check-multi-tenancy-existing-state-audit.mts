#!/usr/bin/env tsx
/**
 * Multi-tenancy existing-state audit gate (multi-tenancy.md Step 2, §502–511).
 *
 * Authoritative for pre-modification baseline tables across schema, kernel context,
 * permissions, AppShell, tenant subdomain, and API/action authority surfaces.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { MULTI_TENANCY_DOC_REFERENCE } from "./delivery-evidence-surface-registry.mts";
import {
  collectExistingStateAuditViolations,
  type ExistingStateAuditEnforcementViolation,
} from "./lib/multi-tenancy-existing-state-audit-enforcement.mts";
import {
  MULTI_TENANCY_DOC_EXISTING_STATE_AUDIT_MARKERS,
  MULTI_TENANCY_EXISTING_STATE_AUDIT_ENFORCEMENT_LIB,
  MULTI_TENANCY_EXISTING_STATE_AUDIT_GATE,
  MULTI_TENANCY_EXISTING_STATE_AUDIT_SURFACE_RULE,
} from "./multi-tenancy-existing-state-audit-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const registryPath = join(
  repoRoot,
  "scripts/governance/multi-tenancy-existing-state-audit-registry.mts"
);
const multiTenancyDocPath = join(repoRoot, MULTI_TENANCY_DOC_REFERENCE);
const packageJsonPath = join(repoRoot, "package.json");

export type MultiTenancyExistingStateAuditViolation =
  ExistingStateAuditEnforcementViolation;

function readText(path: string): string | null {
  if (!existsSync(path)) {
    return null;
  }

  return readFileSync(path, "utf8");
}

export function checkMultiTenancyExistingStateAudit(): MultiTenancyExistingStateAuditViolation[] {
  const violations: MultiTenancyExistingStateAuditViolation[] = [];

  if (!existsSync(registryPath)) {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "multi-tenancy-existing-state-audit-registry.mts is required",
    });
    return violations;
  }

  const registrySource = readFileSync(registryPath, "utf8");
  if (
    !registrySource.includes(MULTI_TENANCY_EXISTING_STATE_AUDIT_SURFACE_RULE)
  ) {
    violations.push({
      rule: "registry-surface-rule-missing",
      file: registryPath,
      message: `Registry must export ${MULTI_TENANCY_EXISTING_STATE_AUDIT_SURFACE_RULE}`,
    });
  }

  const enforcementLibPath = join(
    repoRoot,
    MULTI_TENANCY_EXISTING_STATE_AUDIT_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, MULTI_TENANCY_EXISTING_STATE_AUDIT_GATE);

  if (!existsSync(enforcementLibPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementLibPath,
      message: `${MULTI_TENANCY_EXISTING_STATE_AUDIT_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${MULTI_TENANCY_EXISTING_STATE_AUDIT_GATE} is required`,
    });
  }

  const multiTenancyContent = readText(multiTenancyDocPath);
  if (multiTenancyContent === null) {
    violations.push({
      rule: "multi-tenancy-doc-missing",
      file: multiTenancyDocPath,
      message: `${MULTI_TENANCY_DOC_REFERENCE} is required`,
    });
  } else {
    for (const marker of MULTI_TENANCY_DOC_EXISTING_STATE_AUDIT_MARKERS) {
      if (!multiTenancyContent.includes(marker)) {
        violations.push({
          rule: "doc-marker-missing",
          file: multiTenancyDocPath,
          message: `Missing Step 2 marker: ${marker}`,
        });
      }
    }
  }

  const packageJsonContent = readText(packageJsonPath);
  if (packageJsonContent === null) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required",
    });
  } else {
    if (
      !packageJsonContent.includes("check:multi-tenancy-existing-state-audit")
    ) {
      violations.push({
        rule: "check-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define check:multi-tenancy-existing-state-audit",
      });
    }

    if (
      !packageJsonContent.includes("quality:multi-tenancy-existing-state-audit")
    ) {
      violations.push({
        rule: "quality-script-missing",
        file: packageJsonPath,
        message:
          "package.json must define quality:multi-tenancy-existing-state-audit",
      });
    }

    const qualityChainMatch = packageJsonContent.match(
      /"quality":\s*"([^"]+)"/
    );
    const qualityChain = qualityChainMatch?.[1] ?? "";
    const glossaryIndex = qualityChain.indexOf(
      "quality:multi-tenancy-glossary-first"
    );
    const auditIndex = qualityChain.indexOf(
      "quality:multi-tenancy-existing-state-audit"
    );
    const authorityIndex = qualityChain.indexOf(
      "quality:multi-tenancy-authority-design"
    );
    const dosIndex = qualityChain.indexOf(
      "quality:multi-tenancy-dos-prohibitions"
    );

    if (
      glossaryIndex === -1 ||
      auditIndex === -1 ||
      authorityIndex === -1 ||
      dosIndex === -1 ||
      glossaryIndex > auditIndex ||
      auditIndex > authorityIndex ||
      authorityIndex > dosIndex
    ) {
      violations.push({
        rule: "quality-chain-order",
        file: packageJsonPath,
        message:
          "quality:multi-tenancy-glossary-first → existing-state-audit → authority-design → dos-prohibitions order required in pnpm quality",
      });
    }
  }

  violations.push(...collectExistingStateAuditViolations(repoRoot));

  return violations;
}

export function formatMultiTenancyExistingStateAuditViolations(
  violations: readonly MultiTenancyExistingStateAuditViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  const violations = checkMultiTenancyExistingStateAudit();
  if (violations.length > 0) {
    console.error(formatMultiTenancyExistingStateAuditViolations(violations));
    process.exit(1);
  }

  console.log("Multi-tenancy existing-state audit gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-multi-tenancy-existing-state-audit.mts")
    );
  } catch {
    return entry.endsWith("check-multi-tenancy-existing-state-audit.mts");
  }
})();

if (isDirectRun) {
  main();
}
