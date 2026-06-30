/**
 * Shared constants and helpers for ERP module foundation governance gates (PAS-001C).
 */

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROCUREMENT_FOUNDATION_BUNDLE } from "../../packages/erp-module-foundation/src/reference/build-procurement-foundation-bundle.ts";
import { ERP_RUNTIME_MODULE_REGISTRY as PROCUREMENT_REGISTRY } from "../../packages/erp-module-foundation/src/reference/erp-runtime-module-registry.ts";
import { ERP_DOMAIN_MODULE_KV_IDS } from "../../packages/kernel/src/erp-domain/erp-domain-layout.contract.ts";

export const ERP_MODULE_FOUNDATION_GATE =
  "check:erp-module-foundation" as const;

export const ERP_MODULE_FOUNDATION_SUB_GATES = [
  "check:erp-module-ownership",
  "check:erp-module-knowledge-alignment",
  "check:erp-module-context-spine-consumer",
  "check:erp-module-permission-binding",
  "check:erp-module-audit-outbox",
  "check:erp-module-metadata-binding",
  "check:erp-module-database-boundary",
  "check:erp-module-no-kernel-runtime-leak",
  "check:erp-module-runtime-package-reserved",
  "check:procurement-runtime-foundation",
  "check:erp-module-readiness",
  "check:erp-module-registry-readiness",
] as const;

export const ERP_MODULE_FOUNDATION_PACKAGE_ROOT =
  "packages/erp-module-foundation" as const;

export const ERP_MODULE_FOUNDATION_PROHIBITED_DEPENDENCIES = [
  "@afenda/kernel",
  "@afenda/database",
  "@afenda/architecture-authority",
  "@afenda/ui",
  "@afenda/appshell",
  "@afenda/metadata-ui",
  "@afenda/ui-composition",
] as const;

export interface ErpModuleFoundationViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

export function getRepoRoot(): string {
  return fileURLToPath(new URL("../../", import.meta.url)).replace(
    /[/\\]$/,
    ""
  );
}

export function pathExists(relativePath: string): boolean {
  return existsSync(join(getRepoRoot(), relativePath));
}

export function validateEvidencePath(relativePath: string): boolean {
  return pathExists(relativePath);
}

/** Production registry bundle — procurement foundation authorized. */
export function buildReferenceRegistryBundle() {
  return {
    registry: PROCUREMENT_REGISTRY,
    erpDomainModuleKvIds: ERP_DOMAIN_MODULE_KV_IDS,
    bundles: [PROCUREMENT_FOUNDATION_BUNDLE],
    requireFullCatalogCoverage: false,
  } as const;
}

export function reportViolations(
  gate: string,
  violations: readonly ErpModuleFoundationViolation[]
): void {
  if (violations.length === 0) {
    console.log(`✓ ${gate} passed`);
    return;
  }

  console.error(`✗ ${gate} failed (${violations.length} violation(s)):`);
  for (const violation of violations) {
    console.error(
      `  [${violation.rule}] ${violation.file}: ${violation.message}`
    );
  }
  process.exitCode = 1;
}

export {
  ERP_DOMAIN_MODULE_KV_IDS,
  type ERP_RUNTIME_MODULE_REGISTRY,
  PROCUREMENT_FOUNDATION_BUNDLE,
};
