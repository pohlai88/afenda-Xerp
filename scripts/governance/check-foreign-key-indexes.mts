#!/usr/bin/env tsx
/**
 * PAS §4.1 — tenant FK column index coverage gate (Supabase btree guidance).
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { PLATFORM_TENANT_FK_INDEXES } from "../../packages/database/src/ids/platform-entity-table-registry.ts";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url)).replace(
  /[/\\]$/,
  ""
);

const schemaDir = join(repoRoot, "packages/database/src/schema");
const migrationsDir = join(repoRoot, "packages/database/src/migrations");

export interface ForeignKeyIndexViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function listSchemaFiles(): string[] {
  if (!existsSync(schemaDir)) {
    return [];
  }

  return readdirSync(schemaDir)
    .filter((name) => name.endsWith(".schema.ts"))
    .map((name) => join(schemaDir, name));
}

export function checkForeignKeyIndexes(): ForeignKeyIndexViolation[] {
  const violations: ForeignKeyIndexViolation[] = [];
  const schemaSources = listSchemaFiles().map((file) => ({
    file,
    source: readFileSync(file, "utf8"),
  }));

  for (const { table, column, indexName } of PLATFORM_TENANT_FK_INDEXES) {
    const schemaFile = schemaSources.find(({ source }) =>
      source.includes(`"${table}"`)
    );

    if (!schemaFile) {
      violations.push({
        rule: "pilot-table-schema-missing",
        file: schemaDir,
        message: `Missing schema for pilot table ${table}`,
      });
      continue;
    }

    if (
      !(
        schemaFile.source.includes(indexName) ||
        schemaFile.source.includes(`tenantForeignKeyIndexName("${table}")`)
      )
    ) {
      violations.push({
        rule: "tenant-fk-index-missing",
        file: schemaFile.file,
        message: `Table ${table} must index ${column} via ${indexName}`,
      });
    }
  }

  const pilotMigration = join(
    migrationsDir,
    "20260627120000_canonical_enterprise_id_pilot.sql"
  );
  if (existsSync(pilotMigration)) {
    const migrationSql = readFileSync(pilotMigration, "utf8");
    for (const { indexName } of PLATFORM_TENANT_FK_INDEXES) {
      if (
        !migrationSql.includes(indexName) &&
        indexName === "products_tenant_id_idx"
      ) {
        // Index may pre-exist from master-data migration — verify in any migration
        const migrationFiles = readdirSync(migrationsDir).filter((name) =>
          name.endsWith(".sql")
        );
        const indexed = migrationFiles.some((name) =>
          readFileSync(join(migrationsDir, name), "utf8").includes(indexName)
        );
        if (!indexed) {
          violations.push({
            rule: "tenant-fk-index-migration-missing",
            file: migrationsDir,
            message: `No migration creates index ${indexName}`,
          });
        }
      }
    }
  }

  for (const { file, source } of schemaSources) {
    if (
      !(source.includes("tenantIdRef") || source.includes('idRef("tenant_id")'))
    ) {
      continue;
    }

    if (/references\s*\(\s*\(\)\s*=>\s*\w+\.enterpriseId/.test(source)) {
      violations.push({
        rule: "uuid-fk-only",
        file,
        message: "Foreign keys must reference uuid id, never enterprise_id",
      });
    }
  }

  return violations;
}

function main(): void {
  const violations = checkForeignKeyIndexes();

  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(
        `[${violation.rule}] ${violation.file}: ${violation.message}`
      );
    }
    process.exit(1);
  }

  console.log("Foreign key index gate passed (PAS §4.1).");
}

const isDirectRun = (() => {
  const entry = process.argv[1];
  if (!entry) {
    return false;
  }
  try {
    return (
      fileURLToPath(import.meta.url) === entry.replace(/\\/g, "/") ||
      entry.endsWith("check-foreign-key-indexes.mts")
    );
  } catch {
    return entry.endsWith("check-foreign-key-indexes.mts");
  }
})();

if (isDirectRun) {
  main();
}
