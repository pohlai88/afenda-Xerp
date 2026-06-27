/**
 * PAS §4.1 / ADR-0023 — tenant human reference column registry.
 */

import { tenantHumanReferenceUniqueIndexName } from "./id-index-policy.js";
import type { TenantHumanReferenceScope } from "./tenant-human-reference-column.js";

export type TenantHumanReferencePersistenceStatus = "live" | "deferred";

export interface TenantHumanReferenceTableEntry {
  readonly column: TenantHumanReferenceScope;
  readonly persistenceStatus: TenantHumanReferencePersistenceStatus;
  readonly schemaFile: string | null;
  readonly tableName: string;
  readonly uniqueIndexName: string;
}

export const TENANT_HUMAN_REFERENCE_REGISTRY = [
  {
    tableName: "products",
    column: "sku",
    schemaFile: "product.schema.ts",
    persistenceStatus: "live",
    uniqueIndexName: tenantHumanReferenceUniqueIndexName("products", "sku"),
  },
  {
    tableName: "warehouses",
    column: "warehouse_code",
    schemaFile: "warehouse.schema.ts",
    persistenceStatus: "live",
    uniqueIndexName: tenantHumanReferenceUniqueIndexName(
      "warehouses",
      "warehouse_code"
    ),
  },
  {
    tableName: "employees",
    column: "employee_no",
    schemaFile: null,
    persistenceStatus: "deferred",
    uniqueIndexName: tenantHumanReferenceUniqueIndexName(
      "employees",
      "employee_no"
    ),
  },
  {
    tableName: "customers",
    column: "customer_no",
    schemaFile: null,
    persistenceStatus: "deferred",
    uniqueIndexName: tenantHumanReferenceUniqueIndexName(
      "customers",
      "customer_no"
    ),
  },
  {
    tableName: "suppliers",
    column: "supplier_no",
    schemaFile: null,
    persistenceStatus: "deferred",
    uniqueIndexName: tenantHumanReferenceUniqueIndexName(
      "suppliers",
      "supplier_no"
    ),
  },
  {
    tableName: "assets",
    column: "asset_no",
    schemaFile: null,
    persistenceStatus: "deferred",
    uniqueIndexName: tenantHumanReferenceUniqueIndexName("assets", "asset_no"),
  },
  {
    tableName: "documents",
    column: "document_no",
    schemaFile: null,
    persistenceStatus: "deferred",
    uniqueIndexName: tenantHumanReferenceUniqueIndexName(
      "documents",
      "document_no"
    ),
  },
] as const satisfies readonly TenantHumanReferenceTableEntry[];

export type TenantHumanReferenceRegistryEntry =
  (typeof TENANT_HUMAN_REFERENCE_REGISTRY)[number];

export const LIVE_TENANT_HUMAN_REFERENCE_TABLES =
  TENANT_HUMAN_REFERENCE_REGISTRY.filter(
    (
      entry
    ): entry is TenantHumanReferenceRegistryEntry & {
      schemaFile: string;
      persistenceStatus: "live";
    } => entry.persistenceStatus === "live" && entry.schemaFile !== null
  );
