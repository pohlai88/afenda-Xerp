#!/usr/bin/env tsx
/**
 * Tenant RLS defense-in-depth coverage gate (TIP-007/012 DoD #16, Phase 4).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { MIGRATION_GOVERNANCE_RULES } from "../../packages/database/src/migrations/migration-governance.contract.ts";
import {
  TENANT_RLS_COMPLETION_MIGRATION_TAG,
  TENANT_RLS_ISOLATION_POLICIES,
} from "../../packages/database/src/rls/tenant-rls-coverage.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const migrationPath = join(
  repoRoot,
  "packages/database/src/migrations",
  `${TENANT_RLS_COMPLETION_MIGRATION_TAG}.sql`
);

export interface TenantRlsCoverageViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

export function checkDatabaseTenantRlsCoverage(): TenantRlsCoverageViolation[] {
  const violations: TenantRlsCoverageViolation[] = [];

  if (!existsSync(migrationPath)) {
    violations.push({
      rule: "migration-missing",
      file: migrationPath,
      message: `Missing tenant RLS completion migration ${TENANT_RLS_COMPLETION_MIGRATION_TAG}.sql`,
    });
    return violations;
  }

  const migrationSql = readFileSync(migrationPath, "utf8");
  const probe = MIGRATION_GOVERNANCE_RULES[TENANT_RLS_COMPLETION_MIGRATION_TAG];

  if (!probe) {
    violations.push({
      rule: "governance-probe-missing",
      file: migrationPath,
      message: `Missing migration governance probe for ${TENANT_RLS_COMPLETION_MIGRATION_TAG}`,
    });
  } else if (!probe.completeProbe.includes("projects_tenant_isolation")) {
    violations.push({
      rule: "governance-probe-incomplete",
      file: migrationPath,
      message: `Governance probe for ${TENANT_RLS_COMPLETION_MIGRATION_TAG} must reference projects_tenant_isolation`,
    });
  }

  for (const { tableName, policyName } of TENANT_RLS_ISOLATION_POLICIES) {
    const enablePattern = `ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY`;
    if (!migrationSql.includes(enablePattern)) {
      violations.push({
        rule: "rls-enable-missing",
        file: migrationPath,
        message: `Migration must enable RLS on ${tableName}`,
      });
    }

    const policyPattern = `CREATE POLICY "${policyName}" ON "${tableName}"`;
    if (!migrationSql.includes(policyPattern)) {
      violations.push({
        rule: "rls-policy-missing",
        file: migrationPath,
        message: `Migration must create policy ${policyName} on ${tableName}`,
      });
    }
  }

  return violations;
}

function main(): void {
  const violations = checkDatabaseTenantRlsCoverage();

  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(
        `[${violation.rule}] ${violation.file}: ${violation.message}`
      );
    }
    process.exit(1);
  }

  console.log("Database tenant RLS coverage gate passed.");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-database-tenant-rls-coverage.mts")
    );
  } catch {
    return entry.endsWith("check-database-tenant-rls-coverage.mts");
  }
})();

if (isDirectRun) {
  main();
}
