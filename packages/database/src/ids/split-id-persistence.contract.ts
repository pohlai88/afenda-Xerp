/**
 * PAS §4.1.12 / ADR-0022 — split-ID persistence contract.
 *
 * Three-layer column model on governed entity tables:
 * - `id uuid` — internal PK (UUID v7), all FKs and joins
 * - `enterprise_id text` — Kernel canonical ID (API / wire / audit)
 * - human reference columns — tenant-scoped admin numbers (ADR-0023), never FK
 */

import { LIVE_PLATFORM_ENTITY_TABLES } from "./platform-entity-table-registry.js";
import { TENANT_HUMAN_REFERENCE_REGISTRY } from "./tenant-human-reference-registry.js";

/** Column role vocabulary for documentation and governance probes. */
export const SPLIT_ID_COLUMN_ROLES = {
  internalPk: "id uuid primary key default uuid_generate_v7()",
  canonicalEnterpriseId:
    "enterprise_id text + family CHECK + unique lookup index",
  tenantHumanReference:
    "tenant-scoped varchar (sku, customer_no, …) — composite unique (tenant_id, column)",
} as const;

/**
 * Better Auth owns OAuth/login identity with text PKs (PAS §4.1.11).
 * ERP `users.id` (uuid) maps to Kernel `usr_*` — bridged via auth-identity-link.
 */
export const BETTER_AUTH_SCHEMA_FILES = [
  "auth.schema.ts",
  "auth-identity-link.schema.ts",
] as const;

/** Non-entity tables with intentional non-uuid PK shapes (not platform entities). */
export const SPLIT_ID_PK_EXEMPT_SCHEMA_FILES = [
  ...BETTER_AUTH_SCHEMA_FILES,
  "rollout.schema.ts",
] as const;

export const LIVE_PLATFORM_SCHEMA_FILES = LIVE_PLATFORM_ENTITY_TABLES.map(
  (entry) => entry.schemaFile
);

export const REQUIRED_SPLIT_ID_HELPERS = {
  internalPk: "primaryId",
  canonicalEnterpriseId: "enterpriseIdColumn",
  foreignKey: "idRef",
} as const;

/** Prohibited: canonical enterprise ID as primary key. */
export const FORBIDDEN_ENTERPRISE_ID_PK_PATTERNS = [
  /enterpriseId[^;\n]*\.primaryKey\s*\(/,
  /enterprise_id[^;\n]*\.primaryKey\s*\(/,
  /text\s*\(\s*["']enterprise_id["']\s*\)[^;\n]*\.primaryKey/,
] as const;

/** Prohibited: FK targets parent enterprise_id instead of uuid id. */
export const FORBIDDEN_ENTERPRISE_ID_FK_PATTERNS = [
  /references\s*\(\s*\(\)\s*=>\s*\w+\.enterpriseId/,
  /references\s*\(\s*\(\)\s*=>\s*\w+\.enterprise_id/,
] as const;

/** Prohibited: text PK on platform entity tables (ADR-0022). */
export const FORBIDDEN_TEXT_ENTITY_PK_PATTERN =
  /text\s*\(\s*["']id["']\s*\)\.primaryKey/;

/** Prohibited: tenant human reference used as FK target (ADR-0023). */
export const FORBIDDEN_HUMAN_REFERENCE_FK_PATTERNS =
  TENANT_HUMAN_REFERENCE_REGISTRY.flatMap((entry) => {
    const camelCase =
      entry.column === "warehouse_code"
        ? "warehouseCode"
        : entry.column.replace(/_([a-z])/g, (_, letter: string) =>
            letter.toUpperCase()
          );
    return [
      new RegExp(`\\.references\\(\\(\\)\\s*=>\\s*\\w+\\.${entry.column}\\)`),
      new RegExp(`\\.references\\(\\(\\)\\s*=>\\s*\\w+\\.${camelCase}\\)`),
    ];
  });

export interface SplitIdColumnExample {
  readonly enterpriseId: string;
  readonly entity: string;
  readonly humanReference?: string;
  readonly internalPk: string;
}

/** Reference examples for docs, tests, and onboarding (deferred rows are target state). */
export const SPLIT_ID_COLUMN_EXAMPLES = [
  {
    entity: "customers (deferred)",
    internalPk: "id uuid PK default uuid_generate_v7()",
    enterpriseId: "enterprise_id text — cus_01…",
    humanReference: "customer_no — CUST-000456",
  },
  {
    entity: "products (live)",
    internalPk: "id uuid PK default uuid_generate_v7()",
    enterpriseId: "enterprise_id text — prd_01…",
    humanReference: "sku — tenant-scoped catalog code",
  },
  {
    entity: "warehouses (live)",
    internalPk: "id uuid PK default uuid_generate_v7()",
    enterpriseId: "enterprise_id text — whs_01…",
    humanReference: "warehouse_code — WH-KL-01",
  },
] as const satisfies readonly SplitIdColumnExample[];
