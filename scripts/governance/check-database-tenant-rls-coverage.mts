#!/usr/bin/env tsx
/**
 * Tenant RLS defense-in-depth coverage gate (Foundation phase 07/012 DoD #16, Phase 4).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { MIGRATION_GOVERNANCE_RULES } from "../../packages/database/src/migrations/migration-governance.contract.ts";
import { TENANT_RLS_MIGRATION_POLICY_GROUPS } from "../../packages/database/src/rls/tenant-rls-coverage.contract.ts";
import { collectTenantRlsRegistryInvariantViolations } from "../../packages/database/src/rls/tenant-rls-registry-invariants.contract.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const migrationsDir = join(repoRoot, "packages/database/src/migrations");

export interface TenantRlsCoverageViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function migrationPathForTag(tag: string): string {
  return join(migrationsDir, `${tag}.sql`);
}

export function checkDatabaseTenantRlsCoverage(): TenantRlsCoverageViolation[] {
  const violations: TenantRlsCoverageViolation[] = [];

  for (const violation of collectTenantRlsRegistryInvariantViolations()) {
    violations.push({
      rule: violation.rule,
      file: "packages/database/src/rls/tenant-rls-registry-invariants.contract.ts",
      message: violation.message,
    });
  }

  for (const { migrationTag, policies } of TENANT_RLS_MIGRATION_POLICY_GROUPS) {
    const migrationPath = migrationPathForTag(migrationTag);

    if (!existsSync(migrationPath)) {
      violations.push({
        rule: "migration-missing",
        file: migrationPath,
        message: `Missing tenant RLS migration ${migrationTag}.sql`,
      });
      continue;
    }

    const probe = MIGRATION_GOVERNANCE_RULES[migrationTag];
    if (!probe) {
      violations.push({
        rule: "governance-probe-missing",
        file: migrationPath,
        message: `Missing migration governance probe for ${migrationTag}`,
      });
    }

    const migrationSql = readFileSync(migrationPath, "utf8");

    for (const { tableName, policyName } of policies) {
      const enablePattern = `ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY`;
      if (!migrationSql.includes(enablePattern)) {
        violations.push({
          rule: "rls-enable-missing",
          file: migrationPath,
          message: `Migration ${migrationTag} must enable RLS on ${tableName}`,
        });
      }

      const policyPattern = `CREATE POLICY "${policyName}" ON "${tableName}"`;
      if (!migrationSql.includes(policyPattern)) {
        violations.push({
          rule: "rls-policy-missing",
          file: migrationPath,
          message: `Migration ${migrationTag} must create policy ${policyName} on ${tableName}`,
        });
      }
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
