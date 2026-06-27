/**
 * PAS §4.1 Slice E — platform entity table registry (ADR-0021 / ADR-0022).
 *
 * Maps kernel enterprise ID families to PostgreSQL tables.
 * `deferred` rows are governed by promotion checklist until domain FDR lands schema.
 */

import type { EnterpriseIdFamilyKey } from "./enterprise-id-patterns.js";
import { enterpriseIdUniqueIndexName } from "./id-index-policy.js";

export type PlatformEntityPersistenceStatus = "live" | "deferred";

export interface PlatformEntityTableEntry {
  readonly family: EnterpriseIdFamilyKey;
  readonly persistenceStatus: PlatformEntityPersistenceStatus;
  readonly requiresTenantIdIndex: boolean;
  readonly schemaFile: string | null;
  readonly tableName: string;
}

export const PLATFORM_ENTITY_TABLE_REGISTRY = [
  {
    family: "tenant",
    tableName: "tenants",
    schemaFile: "tenant.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: false,
  },
  {
    family: "entityGroup",
    tableName: "entity_groups",
    schemaFile: "entity-group.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "company",
    tableName: "companies",
    schemaFile: "company.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "organization",
    tableName: "organizations",
    schemaFile: "organization.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "team",
    tableName: "teams",
    schemaFile: "team.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "project",
    tableName: "projects",
    schemaFile: "project.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "user",
    tableName: "users",
    schemaFile: "user.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: false,
  },
  {
    family: "role",
    tableName: "roles",
    schemaFile: "role.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "membership",
    tableName: "memberships",
    schemaFile: "membership.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "permission",
    tableName: "permissions",
    schemaFile: "permission.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: false,
  },
  {
    family: "policy",
    tableName: "policies",
    schemaFile: "policy.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "auditEvent",
    tableName: "audit_events",
    schemaFile: "audit.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "execution",
    tableName: "execution_runs",
    schemaFile: "execution.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "ownershipInterest",
    tableName: "legal_entity_ownership",
    schemaFile: "legal-entity-ownership.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "product",
    tableName: "products",
    schemaFile: "product.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "warehouse",
    tableName: "warehouses",
    schemaFile: "warehouse.schema.ts",
    persistenceStatus: "live",
    requiresTenantIdIndex: true,
  },
  {
    family: "customer",
    tableName: "customers",
    schemaFile: null,
    persistenceStatus: "deferred",
    requiresTenantIdIndex: true,
  },
  {
    family: "supplier",
    tableName: "suppliers",
    schemaFile: null,
    persistenceStatus: "deferred",
    requiresTenantIdIndex: true,
  },
  {
    family: "employee",
    tableName: "employees",
    schemaFile: null,
    persistenceStatus: "deferred",
    requiresTenantIdIndex: true,
  },
  {
    family: "document",
    tableName: "documents",
    schemaFile: null,
    persistenceStatus: "deferred",
    requiresTenantIdIndex: true,
  },
  {
    family: "asset",
    tableName: "assets",
    schemaFile: null,
    persistenceStatus: "deferred",
    requiresTenantIdIndex: true,
  },
] as const satisfies readonly PlatformEntityTableEntry[];

export type PlatformEntityTableRegistryEntry =
  (typeof PLATFORM_ENTITY_TABLE_REGISTRY)[number];

export const LIVE_PLATFORM_ENTITY_TABLES =
  PLATFORM_ENTITY_TABLE_REGISTRY.filter(
    (
      entry
    ): entry is PlatformEntityTableRegistryEntry & { schemaFile: string } =>
      entry.persistenceStatus === "live" && entry.schemaFile !== null
  );

export const DEFERRED_PLATFORM_ENTITY_TABLES =
  PLATFORM_ENTITY_TABLE_REGISTRY.filter(
    (entry) => entry.persistenceStatus === "deferred"
  );

export const PLATFORM_ENTERPRISE_ID_UNIQUE_INDEXES =
  LIVE_PLATFORM_ENTITY_TABLES.map((entry) =>
    enterpriseIdUniqueIndexName(entry.tableName)
  );

export const PLATFORM_TENANT_FK_INDEXES = LIVE_PLATFORM_ENTITY_TABLES.filter(
  (entry) => entry.requiresTenantIdIndex
).map((entry) => ({
  table: entry.tableName,
  column: "tenant_id" as const,
  indexName: `${entry.tableName}_tenant_id_idx`,
}));
