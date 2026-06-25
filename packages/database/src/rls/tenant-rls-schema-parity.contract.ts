import {
  TENANT_RLS_ISOLATION_POLICIES,
  type TenantRlsPolicyRow,
} from "./tenant-rls-coverage.contract.js";

/**
 * Drizzle tables carrying `tenant_id` — each must appear exactly once in
 * {@link TENANT_RLS_ISOLATION_POLICIES}.
 */
export const TENANT_SCOPED_TABLE_NAMES = [
  "audit_events",
  "companies",
  "entitlement_grants",
  "entity_groups",
  "execution_runs",
  "legal_entity_ownership",
  "memberships",
  "organizations",
  "outbox_events",
  "policies",
  "projects",
  "roles",
  "storage_objects",
  "teams",
  "tenant_commercial_plans",
  "tenant_settings",
  "usage_limit_counters",
] as const satisfies readonly string[];

export type TenantScopedTableName = (typeof TENANT_SCOPED_TABLE_NAMES)[number];

export interface TenantRlsSchemaParityGap {
  readonly kind: "registry-missing-table" | "schema-missing-table";
  readonly tableName: string;
}

export function collectTenantRlsSchemaParityGaps(
  registry: readonly TenantRlsPolicyRow[] = TENANT_RLS_ISOLATION_POLICIES
): TenantRlsSchemaParityGap[] {
  const gaps: TenantRlsSchemaParityGap[] = [];
  const registryTables = new Set(registry.map((row) => row.tableName));
  const schemaTables = new Set<string>(TENANT_SCOPED_TABLE_NAMES);

  for (const tableName of TENANT_SCOPED_TABLE_NAMES) {
    if (!registryTables.has(tableName)) {
      gaps.push({ kind: "registry-missing-table", tableName });
    }
  }

  for (const tableName of registryTables) {
    if (!schemaTables.has(tableName)) {
      gaps.push({ kind: "schema-missing-table", tableName });
    }
  }

  return gaps;
}
