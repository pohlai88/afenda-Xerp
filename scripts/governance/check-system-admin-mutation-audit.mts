#!/usr/bin/env tsx
/**
 * System-admin mutation audit coverage gate (PKG007_ADMIN / ADR-0014).
 *
 * Proves every governed system-admin mutation emits audit evidence.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  collectSystemAdminMutationAuditViolations,
  type SystemAdminMutationAuditViolation,
} from "./lib/system-admin-mutation-audit-enforcement.mts";
import {
  SYSTEM_ADMIN_MUTATION_AUDIT_ENFORCEMENT_LIB,
  SYSTEM_ADMIN_MUTATION_AUDIT_ERP_REGISTRY,
  SYSTEM_ADMIN_MUTATION_AUDIT_GATE,
  SYSTEM_ADMIN_MUTATION_AUDIT_PACKAGE_SCRIPTS,
  SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE,
} from "./system-admin-mutation-audit-registry.mts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const SYSTEM_ADMIN_SURFACE_ROOT = join(
  repoRoot,
  "apps/erp/src/lib/system-admin"
);

export type { SystemAdminMutationAuditViolation };

export function isSystemAdminMutationAuditSurfacePresent(): boolean {
  return existsSync(SYSTEM_ADMIN_SURFACE_ROOT);
}

export function checkSystemAdminMutationAudit(): SystemAdminMutationAuditViolation[] {
  if (!isSystemAdminMutationAuditSurfacePresent()) {
    return [];
  }

  const violations: SystemAdminMutationAuditViolation[] = [];

  const registryPath = join(
    repoRoot,
    "scripts/governance/system-admin-mutation-audit-registry.mts"
  );
  const enforcementPath = join(
    repoRoot,
    SYSTEM_ADMIN_MUTATION_AUDIT_ENFORCEMENT_LIB
  );
  const gatePath = join(repoRoot, SYSTEM_ADMIN_MUTATION_AUDIT_GATE);
  const erpRegistryPath = join(
    repoRoot,
    SYSTEM_ADMIN_MUTATION_AUDIT_ERP_REGISTRY
  );
  const packageJsonPath = join(repoRoot, "package.json");

  if (existsSync(registryPath)) {
    const registrySource = readFileSync(registryPath, "utf8");
    if (!registrySource.includes(SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE)) {
      violations.push({
        rule: "registry-surface-rule-missing",
        file: registryPath,
        message: `Registry must export ${SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE}`,
      });
    }
  } else {
    violations.push({
      rule: "registry-missing",
      file: registryPath,
      message: "system-admin-mutation-audit-registry.mts is required",
    });
  }

  if (!existsSync(enforcementPath)) {
    violations.push({
      rule: "enforcement-lib-missing",
      file: enforcementPath,
      message: `${SYSTEM_ADMIN_MUTATION_AUDIT_ENFORCEMENT_LIB} is required`,
    });
  }

  if (!existsSync(gatePath)) {
    violations.push({
      rule: "gate-missing",
      file: gatePath,
      message: `${SYSTEM_ADMIN_MUTATION_AUDIT_GATE} is required`,
    });
  }

  if (!existsSync(erpRegistryPath)) {
    violations.push({
      rule: "erp-registry-missing",
      file: erpRegistryPath,
      message: `${SYSTEM_ADMIN_MUTATION_AUDIT_ERP_REGISTRY} is required`,
    });
  }

  const packageJsonContent = existsSync(packageJsonPath)
    ? readFileSync(packageJsonPath, "utf8")
    : null;

  if (packageJsonContent === null) {
    violations.push({
      rule: "package-json-missing",
      file: packageJsonPath,
      message: "root package.json is required",
    });
  } else {
    for (const scriptName of SYSTEM_ADMIN_MUTATION_AUDIT_PACKAGE_SCRIPTS) {
      if (!packageJsonContent.includes(`"${scriptName}"`)) {
        violations.push({
          rule: "package-script-missing",
          file: packageJsonPath,
          message: `package.json must define ${scriptName}`,
        });
      }
    }
  }

  violations.push(...collectSystemAdminMutationAuditViolations(repoRoot));

  return violations;
}

export function formatSystemAdminMutationAuditViolations(
  violations: readonly SystemAdminMutationAuditViolation[]
): string {
  if (violations.length === 0) {
    return "";
  }

  return violations
    .map((v) => `[${v.rule}] ${v.file}\n  ${v.message}`)
    .join("\n\n");
}

function main(): void {
  if (!isSystemAdminMutationAuditSurfacePresent()) {
    console.log(
      "System-admin mutation audit gate skipped (ADR-0027 skeleton — no apps/erp/src/lib/system-admin surface)."
    );
    return;
  }

  const violations = checkSystemAdminMutationAudit();
  if (violations.length > 0) {
    console.error(formatSystemAdminMutationAuditViolations(violations));
    process.exit(1);
  }

  console.log("System-admin mutation audit coverage gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }

  return entry.endsWith("check-system-admin-mutation-audit.mts");
})();

if (isDirectRun) {
  main();
}
