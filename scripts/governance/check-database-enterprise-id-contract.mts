#!/usr/bin/env tsx
/**
 * PAS §4.1 / ADR-0022 — database enterprise-ID contract gate (Slice E rollout).
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  ENTERPRISE_ID_FORMAT_CHECKS_MIGRATION_TAG,
  FORBIDDEN_ENTERPRISE_ID_BACKFILL_PATTERNS,
  LIVE_PLATFORM_SCHEMA_FILES,
  LIVE_TENANT_HUMAN_REFERENCE_TABLES,
  PILOT_ENTERPRISE_ID_MIGRATION_TAG,
  PLATFORM_ROLLOUT_MIGRATION_TAG,
  PLATFORM_SLICE_E_MIGRATION_TAG,
  REQUIRED_PILOT_IDS_HELPERS,
} from "../../packages/database/src/ids/database-enterprise-id.contract.ts";
import { LIVE_ENTERPRISE_ID_CHECK_REGISTRY } from "../../packages/database/src/ids/enterprise-id-check.registry.ts";
import { LIVE_PLATFORM_ENTITY_TABLES } from "../../packages/database/src/ids/platform-entity-table-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

export interface DatabaseEnterpriseIdViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function schemaPath(relativePath: string): string {
  return join(repoRoot, relativePath);
}

export function checkDatabaseEnterpriseIdContract(): DatabaseEnterpriseIdViolation[] {
  const violations: DatabaseEnterpriseIdViolation[] = [];

  for (const entry of LIVE_PLATFORM_ENTITY_TABLES) {
    const relativePath = `packages/database/src/schema/${entry.schemaFile}`;
    const filePath = schemaPath(relativePath);

    if (!existsSync(filePath)) {
      violations.push({
        rule: "live-schema-missing",
        file: relativePath,
        message: `Missing live platform schema for ${entry.tableName}`,
      });
      continue;
    }

    const source = readFileSync(filePath, "utf8");

    for (const helper of REQUIRED_PILOT_IDS_HELPERS) {
      if (!source.includes(helper)) {
        violations.push({
          rule: "ids-helper-missing",
          file: relativePath,
          message: `${entry.tableName} schema must use ids helper ${helper}()`,
        });
      }
    }

    if (!source.includes(`enterpriseIdColumn("${entry.family}")`)) {
      violations.push({
        rule: "enterprise-id-family-mismatch",
        file: relativePath,
        message: `Schema must declare enterpriseIdColumn("${entry.family}") for ${entry.tableName}`,
      });
    }

    const formatCheckPattern = new RegExp(
      `enterpriseIdFormatCheck\\([^,]+,\\s*"${entry.family}"\\)`
    );
    if (!formatCheckPattern.test(source)) {
      violations.push({
        rule: "enterprise-id-format-check-missing",
        file: relativePath,
        message: `Schema must declare enterpriseIdFormatCheck(..., "${entry.family}") for ${entry.tableName}`,
      });
    }

    if (/text\s*\(\s*["']id["']\s*\)\.primaryKey/.test(source)) {
      violations.push({
        rule: "text-primary-key",
        file: relativePath,
        message: "Text primary keys are prohibited (ADR-0022)",
      });
    }

    if (/references\s*\(\s*\(\)\s*=>\s*\w+\.enterpriseId/.test(source)) {
      violations.push({
        rule: "enterprise-id-fk",
        file: relativePath,
        message:
          "Foreign keys must reference uuid id columns, not enterprise_id",
      });
    }
  }

  for (const entry of LIVE_TENANT_HUMAN_REFERENCE_TABLES) {
    const relativePath = `packages/database/src/schema/${entry.schemaFile}`;
    const filePath = schemaPath(relativePath);

    if (!existsSync(filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");

    if (!source.includes("tenantHumanReferenceColumn")) {
      violations.push({
        rule: "tenant-human-reference-helper",
        file: relativePath,
        message: `${entry.tableName} must use tenantHumanReferenceColumn for ${entry.column}`,
      });
    }

    if (
      !(
        source.includes(entry.uniqueIndexName) ||
        source.includes(
          `tenantHumanReferenceUniqueIndexName("${entry.tableName}", "${entry.column}")`
        )
      )
    ) {
      violations.push({
        rule: "tenant-human-reference-index",
        file: relativePath,
        message: `Missing composite unique index ${entry.uniqueIndexName}`,
      });
    }
  }

  const idsDir = join(repoRoot, "packages/database/src/ids");
  for (const requiredFile of [
    "primary-id.ts",
    "enterprise-id-column.ts",
    "tenant-human-reference-column.ts",
    "foreign-key-ref.ts",
    "uuid-v7-default.ts",
    "id-check-constraint.ts",
    "id-index-policy.ts",
    "platform-entity-table-registry.ts",
    "tenant-human-reference-registry.ts",
    "enterprise-id-check.registry.ts",
    "split-id-persistence.contract.ts",
    "split-id-persistence.governance.ts",
    "database-enterprise-id.contract.ts",
    "index.ts",
  ]) {
    if (!existsSync(join(idsDir, requiredFile))) {
      violations.push({
        rule: "ids-module-file-missing",
        file: `packages/database/src/ids/${requiredFile}`,
        message: `Missing PAS §4.1 ids helper ${requiredFile}`,
      });
    }
  }

  for (const migrationTag of [
    PILOT_ENTERPRISE_ID_MIGRATION_TAG,
    PLATFORM_ROLLOUT_MIGRATION_TAG,
    PLATFORM_SLICE_E_MIGRATION_TAG,
    ENTERPRISE_ID_FORMAT_CHECKS_MIGRATION_TAG,
  ]) {
    const migrationPath = join(
      repoRoot,
      `packages/database/src/migrations/${migrationTag}.sql`
    );
    if (!existsSync(migrationPath)) {
      violations.push({
        rule: "enterprise-id-migration-missing",
        file: migrationPath,
        message: `Missing migration ${migrationTag}.sql`,
      });
      continue;
    }

    const migrationSql = readFileSync(migrationPath, "utf8");
    for (const pattern of FORBIDDEN_ENTERPRISE_ID_BACKFILL_PATTERNS) {
      if (pattern.test(migrationSql)) {
        violations.push({
          rule: "sql-concat-backfill",
          file: migrationPath,
          message: `Migration must not SQL-concat enterprise_id values (${pattern})`,
        });
      }
    }
  }

  const pilotMigration = join(
    repoRoot,
    `packages/database/src/migrations/${PILOT_ENTERPRISE_ID_MIGRATION_TAG}.sql`
  );
  if (existsSync(pilotMigration)) {
    const migrationSql = readFileSync(pilotMigration, "utf8");
    if (!migrationSql.includes("uuid_generate_v7()")) {
      violations.push({
        rule: "uuid-v7-default-missing",
        file: pilotMigration,
        message:
          "Pilot migration must install uuid_generate_v7() default strategy",
      });
    }
  }

  const formatChecksMigration = join(
    repoRoot,
    `packages/database/src/migrations/${ENTERPRISE_ID_FORMAT_CHECKS_MIGRATION_TAG}.sql`
  );
  if (existsSync(formatChecksMigration)) {
    const migrationSql = readFileSync(formatChecksMigration, "utf8");
    for (const entry of LIVE_ENTERPRISE_ID_CHECK_REGISTRY) {
      if (!migrationSql.includes(entry.constraintName)) {
        violations.push({
          rule: "enterprise-id-format-check-migration",
          file: formatChecksMigration,
          message: `Missing CHECK constraint ${entry.constraintName} for ${entry.tableName}`,
        });
      }
      if (!migrationSql.includes(entry.checkPattern)) {
        violations.push({
          rule: "enterprise-id-format-check-pattern",
          file: formatChecksMigration,
          message: `Missing pattern ${entry.checkPattern} for ${entry.tableName}`,
        });
      }
    }
  }

  if (
    LIVE_PLATFORM_SCHEMA_FILES.length !== LIVE_PLATFORM_ENTITY_TABLES.length
  ) {
    violations.push({
      rule: "live-schema-file-list",
      file: "packages/database/src/ids/database-enterprise-id.contract.ts",
      message:
        "LIVE_PLATFORM_SCHEMA_FILES must mirror LIVE_PLATFORM_ENTITY_TABLES",
    });
  }

  return violations;
}

function main(): void {
  const violations = checkDatabaseEnterpriseIdContract();

  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(
        `[${violation.rule}] ${violation.file}: ${violation.message}`
      );
    }
    process.exit(1);
  }

  console.log(
    "Database enterprise-ID contract gate passed (PAS §4.1 / ADR-0022)."
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
      entry.endsWith("check-database-enterprise-id-contract.mts")
    );
  } catch {
    return entry.endsWith("check-database-enterprise-id-contract.mts");
  }
})();

if (isDirectRun) {
  main();
}
