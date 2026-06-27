/**
 * PAS §4.1.12 / ADR-0022 — split-ID persistence governance scanner.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { LIVE_PLATFORM_ENTITY_TABLES } from "./platform-entity-table-registry.js";
import {
  FORBIDDEN_ENTERPRISE_ID_FK_PATTERNS,
  FORBIDDEN_ENTERPRISE_ID_PK_PATTERNS,
  FORBIDDEN_HUMAN_REFERENCE_FK_PATTERNS,
  FORBIDDEN_TEXT_ENTITY_PK_PATTERN,
  REQUIRED_SPLIT_ID_HELPERS,
  SPLIT_ID_PK_EXEMPT_SCHEMA_FILES,
} from "./split-id-persistence.contract.js";

export interface SplitIdPersistenceViolation {
  readonly file: string;
  readonly message: string;
  readonly rule: string;
}

function listSchemaFiles(schemaDir: string): string[] {
  return readdirSync(schemaDir)
    .filter((name) => name.endsWith(".schema.ts"))
    .sort();
}

function isPkExemptSchema(fileName: string): boolean {
  return (SPLIT_ID_PK_EXEMPT_SCHEMA_FILES as readonly string[]).includes(
    fileName
  );
}

export function checkSplitIdPersistenceContract(
  schemaDir: string
): SplitIdPersistenceViolation[] {
  const violations: SplitIdPersistenceViolation[] = [];

  if (!existsSync(schemaDir)) {
    return [
      {
        rule: "schema-dir-missing",
        file: schemaDir,
        message: "Schema directory not found",
      },
    ];
  }

  const platformByFile = new Map<
    string,
    (typeof LIVE_PLATFORM_ENTITY_TABLES)[number]
  >(LIVE_PLATFORM_ENTITY_TABLES.map((entry) => [entry.schemaFile, entry]));

  for (const fileName of listSchemaFiles(schemaDir)) {
    const filePath = join(schemaDir, fileName);
    const relativePath = `packages/database/src/schema/${fileName}`;
    const source = readFileSync(filePath, "utf8");
    const platformEntry = platformByFile.get(fileName);

    for (const pattern of FORBIDDEN_ENTERPRISE_ID_PK_PATTERNS) {
      if (pattern.test(source)) {
        violations.push({
          rule: "enterprise-id-primary-key",
          file: relativePath,
          message: "enterprise_id / enterpriseId must not be primary key",
        });
      }
    }

    for (const pattern of FORBIDDEN_ENTERPRISE_ID_FK_PATTERNS) {
      if (pattern.test(source)) {
        violations.push({
          rule: "enterprise-id-foreign-key",
          file: relativePath,
          message: "Foreign keys must reference uuid id, not enterprise_id",
        });
      }
    }

    for (const pattern of FORBIDDEN_HUMAN_REFERENCE_FK_PATTERNS) {
      if (pattern.test(source)) {
        violations.push({
          rule: "human-reference-foreign-key",
          file: relativePath,
          message:
            "Tenant human reference columns must not be FK targets (ADR-0023)",
        });
      }
    }

    if (platformEntry) {
      if (!source.includes(`${REQUIRED_SPLIT_ID_HELPERS.internalPk}(`)) {
        violations.push({
          rule: "platform-uuid-primary-key",
          file: relativePath,
          message: `${platformEntry.tableName} must use primaryId() for internal PK`,
        });
      }

      if (
        !source.includes(
          `${REQUIRED_SPLIT_ID_HELPERS.canonicalEnterpriseId}("${platformEntry.family}")`
        )
      ) {
        violations.push({
          rule: "platform-enterprise-id-column",
          file: relativePath,
          message: `${platformEntry.tableName} must use enterpriseIdColumn("${platformEntry.family}")`,
        });
      }

      if (FORBIDDEN_TEXT_ENTITY_PK_PATTERN.test(source)) {
        violations.push({
          rule: "text-primary-key",
          file: relativePath,
          message: "Platform entity tables prohibit text primary keys",
        });
      }
    } else if (
      !isPkExemptSchema(fileName) &&
      FORBIDDEN_TEXT_ENTITY_PK_PATTERN.test(source)
    ) {
      violations.push({
        rule: "text-primary-key",
        file: relativePath,
        message:
          "text('id').primaryKey() prohibited — use primaryId() or document exemption",
      });
    }
  }

  return violations;
}
