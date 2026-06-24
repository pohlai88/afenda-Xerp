/**
 * Shared system-admin mutation audit enforcement (PKG007_ADMIN).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES,
  SYSTEM_ADMIN_MUTATION_AUDIT_COVERAGE_TEST,
  SYSTEM_ADMIN_MUTATION_AUDIT_ERP_REGISTRY_MARKERS,
  SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE,
  SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES,
  SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES,
} from "../system-admin-mutation-audit-registry.mts";

export interface SystemAdminMutationAuditViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function readRepoFile(repoRoot: string, relativePath: string): string | null {
  const absolutePath = join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) {
    return null;
  }

  return readFileSync(absolutePath, "utf8");
}

function collectApiMutationAuditViolations(
  repoRoot: string
): SystemAdminMutationAuditViolation[] {
  const violations: SystemAdminMutationAuditViolation[] = [];

  for (const entry of SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES) {
    const source = readRepoFile(repoRoot, entry.contractModule);
    if (source === null) {
      violations.push({
        rule: "api-contract-module-missing",
        file: join(repoRoot, entry.contractModule),
        message: `System-admin API contract module missing: ${entry.contractModule}`,
      });
      continue;
    }

    const exportPattern = new RegExp(
      `export const ${entry.contractExport}\\s*=\\s*\\{[\\s\\S]*?\\}\\s*as const`,
      "u"
    );
    const exportMatch = exportPattern.exec(source);

    if (exportMatch === null) {
      violations.push({
        rule: "api-contract-export-missing",
        file: join(repoRoot, entry.contractModule),
        message: `Missing contract export: ${entry.contractExport}`,
      });
      continue;
    }

    const contractBlock = exportMatch[0];

    if (
      !(
        contractBlock.includes("audit:") &&
        contractBlock.includes("enabled: true")
      )
    ) {
      violations.push({
        rule: "api-mutation-audit-disabled",
        file: join(repoRoot, entry.contractModule),
        message: `${entry.contractExport} must declare audit.enabled: true`,
      });
    }

    if (!contractBlock.includes(`action: "${entry.auditAction}"`)) {
      violations.push({
        rule: "api-mutation-audit-action-mismatch",
        file: join(repoRoot, entry.contractModule),
        message: `${entry.contractExport} must declare audit.action "${entry.auditAction}"`,
      });
    }
  }

  return violations;
}

function collectServerActionAuditViolations(
  repoRoot: string
): SystemAdminMutationAuditViolation[] {
  const violations: SystemAdminMutationAuditViolation[] = [];

  for (const entry of SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES) {
    const source = readRepoFile(repoRoot, entry.actionModule);
    if (source === null) {
      violations.push({
        rule: "server-action-module-missing",
        file: join(repoRoot, entry.actionModule),
        message: `System-admin server action missing: ${entry.actionModule}`,
      });
      continue;
    }

    if (!source.includes('"use server"')) {
      violations.push({
        rule: "server-action-directive-missing",
        file: join(repoRoot, entry.actionModule),
        message: `${entry.actionModule} must be a server action`,
      });
    }

    if (!source.includes("resolveActionOperatingContext")) {
      violations.push({
        rule: "server-action-context-missing",
        file: join(repoRoot, entry.actionModule),
        message: `${entry.actionModule} must resolve operating context before mutation`,
      });
    }

    if (!source.includes("recordActionAudit")) {
      violations.push({
        rule: "server-action-audit-missing",
        file: join(repoRoot, entry.actionModule),
        message: `${entry.actionModule} must emit audit via recordActionAudit`,
      });
    }

    if (!source.includes(`"${entry.id}"`)) {
      violations.push({
        rule: "server-action-id-missing",
        file: join(repoRoot, entry.actionModule),
        message: `${entry.actionModule} must declare action id ${entry.id}`,
      });
    }
  }

  return violations;
}

function collectSupplementaryAuditViolations(
  repoRoot: string
): SystemAdminMutationAuditViolation[] {
  const violations: SystemAdminMutationAuditViolation[] = [];

  for (const entry of SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES) {
    const source = readRepoFile(repoRoot, entry.module);
    if (source === null) {
      violations.push({
        rule: "supplementary-audit-module-missing",
        file: join(repoRoot, entry.module),
        message: `Supplementary audit module missing: ${entry.module}`,
      });
      continue;
    }

    if (!source.includes("recordErpAuditEvent")) {
      violations.push({
        rule: "supplementary-audit-emission-missing",
        file: join(repoRoot, entry.module),
        message: `${entry.module} must emit audit via recordErpAuditEvent`,
      });
    }

    if (!source.includes(`"${entry.auditAction}"`)) {
      violations.push({
        rule: "supplementary-audit-action-missing",
        file: join(repoRoot, entry.module),
        message: `${entry.module} must declare audit action ${entry.auditAction}`,
      });
    }
  }

  return violations;
}

export function collectSystemAdminMutationAuditViolations(
  repoRoot: string
): SystemAdminMutationAuditViolation[] {
  const violations: SystemAdminMutationAuditViolation[] = [];

  const erpRegistryPath = join(
    repoRoot,
    "apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts"
  );
  const erpRegistrySource = readRepoFile(
    repoRoot,
    "apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts"
  );

  if (erpRegistrySource === null) {
    violations.push({
      rule: "erp-registry-missing",
      file: erpRegistryPath,
      message: "system-admin-mutation-audit.registry.ts is required",
    });
    return violations;
  }

  if (!erpRegistrySource.includes(SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE)) {
    violations.push({
      rule: "erp-registry-surface-rule-missing",
      file: erpRegistryPath,
      message: `ERP registry must export ${SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE}`,
    });
  }

  for (const marker of SYSTEM_ADMIN_MUTATION_AUDIT_ERP_REGISTRY_MARKERS) {
    if (!erpRegistrySource.includes(marker)) {
      violations.push({
        rule: "erp-registry-marker-missing",
        file: erpRegistryPath,
        message: `ERP registry missing marker: ${marker}`,
      });
    }
  }

  const coverageTestPath = join(
    repoRoot,
    SYSTEM_ADMIN_MUTATION_AUDIT_COVERAGE_TEST
  );
  if (!existsSync(coverageTestPath)) {
    violations.push({
      rule: "coverage-test-missing",
      file: coverageTestPath,
      message: `${SYSTEM_ADMIN_MUTATION_AUDIT_COVERAGE_TEST} is required`,
    });
  }

  violations.push(...collectApiMutationAuditViolations(repoRoot));
  violations.push(...collectServerActionAuditViolations(repoRoot));
  violations.push(...collectSupplementaryAuditViolations(repoRoot));

  return violations;
}
