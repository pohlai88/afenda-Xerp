/**
 * PAS §4.1 database enterprise-ID contract — static governance surface.
 */

import { tenantHumanReferenceUniqueIndexName } from "./id-index-policy.js";
import {
  LIVE_PLATFORM_ENTITY_TABLES,
  PLATFORM_ENTERPRISE_ID_UNIQUE_INDEXES,
  PLATFORM_TENANT_FK_INDEXES,
} from "./platform-entity-table-registry.js";
import { LIVE_TENANT_HUMAN_REFERENCE_TABLES } from "./tenant-human-reference-registry.js";

export {
  DEFERRED_PLATFORM_ENTITY_TABLES,
  LIVE_PLATFORM_ENTITY_TABLES,
  PLATFORM_ENTITY_TABLE_REGISTRY,
} from "./platform-entity-table-registry.js";

export {
  LIVE_TENANT_HUMAN_REFERENCE_TABLES,
  TENANT_HUMAN_REFERENCE_REGISTRY,
} from "./tenant-human-reference-registry.js";

/** @deprecated Use LIVE_PLATFORM_ENTITY_TABLES */
export const PILOT_ENTERPRISE_ID_TABLES = LIVE_PLATFORM_ENTITY_TABLES.map(
  (entry) => entry.tableName
);

export const PILOT_ENTERPRISE_ID_MIGRATION_TAG =
  "20260627120000_canonical_enterprise_id_pilot" as const;

export const PLATFORM_SLICE_E_MIGRATION_TAG =
  "20260627005456_luxuriant_luke_cage" as const;

export const PLATFORM_ROLLOUT_MIGRATION_TAG =
  "20260627120100_enterprise_id_platform_rollout" as const;

export { ENTERPRISE_ID_FORMAT_CHECKS_MIGRATION_TAG } from "./enterprise-id-check.registry.js";

/** @deprecated Use LIVE_PLATFORM_ENTITY_TABLES schema paths */
export const PILOT_SCHEMA_FILES = [
  "packages/database/src/schema/tenant.schema.ts",
  "packages/database/src/schema/product.schema.ts",
] as const;

export const LIVE_PLATFORM_SCHEMA_FILES = LIVE_PLATFORM_ENTITY_TABLES.map(
  (entry) => `packages/database/src/schema/${entry.schemaFile}`
);

export const REQUIRED_PILOT_IDS_HELPERS = [
  "enterpriseIdColumn",
  "enterpriseIdFormatCheck",
  "primaryId",
] as const;

export const PILOT_ENTERPRISE_ID_UNIQUE_INDEXES =
  PLATFORM_ENTERPRISE_ID_UNIQUE_INDEXES;

export const PILOT_TENANT_FK_INDEXES = PLATFORM_TENANT_FK_INDEXES;

export const PILOT_TENANT_HUMAN_REFERENCE = {
  table: LIVE_TENANT_HUMAN_REFERENCE_TABLES[0]?.tableName ?? "products",
  column: LIVE_TENANT_HUMAN_REFERENCE_TABLES[0]?.column ?? "sku",
  uniqueIndex:
    LIVE_TENANT_HUMAN_REFERENCE_TABLES[0]?.uniqueIndexName ??
    tenantHumanReferenceUniqueIndexName("products", "sku"),
} as const;

/** Banned in enterprise_id backfill migrations (ADR-0022). */
export const FORBIDDEN_ENTERPRISE_ID_BACKFILL_PATTERNS = [
  /concat\s*\(\s*['"][a-z]{3}_/i,
  /'\w{3}_'\s*\|\|/i,
  /format\s*\(\s*['"][a-z]{3}_/i,
] as const;

export interface IdExplainProbe {
  readonly expectedIndexFragment: string;
  readonly name: string;
  readonly sql: string;
}

export const ID_EXPLAIN_PROBES = [
  {
    name: "enterprise_id lookup",
    sql: `EXPLAIN (FORMAT JSON) SELECT "id" FROM "tenants" WHERE "enterprise_id" = $1`,
    expectedIndexFragment: "tenants_enterprise_id_unique",
  },
  {
    name: "tenant-scoped product list",
    sql: `EXPLAIN (FORMAT JSON) SELECT "id", "sku" FROM "products" WHERE "tenant_id" = $1 ORDER BY "sku"`,
    expectedIndexFragment: "products_tenant",
  },
  {
    name: "uuid FK join path",
    sql: `EXPLAIN (FORMAT JSON) SELECT p."id" FROM "products" p INNER JOIN "tenants" t ON p."tenant_id" = t."id" WHERE t."enterprise_id" = $1`,
    expectedIndexFragment: "tenants",
  },
] satisfies readonly IdExplainProbe[];
