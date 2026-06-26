/** Canonical tenant RLS defense-in-depth coverage across foundation + completion migrations. */

export type TenantRlsPolicyKind = "tenant_isolation" | "actor_isolation";

export interface TenantRlsPolicyRow {
  readonly kind: TenantRlsPolicyKind;
  readonly migrationTag: string;
  readonly policyName: string;
  readonly tableName: string;
}

export const TENANT_RLS_FOUNDATION_MIGRATION_TAG =
  "20260621110000_tenant_company_rls" as const;

export const TENANT_RLS_COMPLETION_MIGRATION_TAG =
  "20260624150000_tenant_rls_completion" as const;

export const TENANT_RLS_COMMERCIAL_PLANS_MIGRATION_TAG =
  "20260624115705_tenant_commercial_plans_rls" as const;

export const TENANT_RLS_TENANT_SETTINGS_MIGRATION_TAG =
  "20260625005454_tenant_settings_rls" as const;

export const TENANT_RLS_INVENTORY_MASTER_DATA_MIGRATION_TAG =
  "20260626170000_inventory_master_data_rls" as const;

export const TENANT_RLS_INVENTORY_STOCK_MIGRATION_TAG =
  "20260626183200_inventory_stock_rls" as const;

export const TENANT_RLS_FOUNDATION_POLICIES = [
  {
    tableName: "companies",
    policyName: "companies_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_FOUNDATION_MIGRATION_TAG,
  },
  {
    tableName: "organizations",
    policyName: "organizations_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_FOUNDATION_MIGRATION_TAG,
  },
  {
    tableName: "entity_groups",
    policyName: "entity_groups_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_FOUNDATION_MIGRATION_TAG,
  },
  {
    tableName: "legal_entity_ownership",
    policyName: "legal_entity_ownership_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_FOUNDATION_MIGRATION_TAG,
  },
  {
    tableName: "memberships",
    policyName: "memberships_actor_isolation",
    kind: "actor_isolation",
    migrationTag: TENANT_RLS_FOUNDATION_MIGRATION_TAG,
  },
] as const satisfies readonly TenantRlsPolicyRow[];

export const TENANT_RLS_COMPLETION_POLICIES = [
  {
    tableName: "audit_events",
    policyName: "audit_events_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "entitlement_grants",
    policyName: "entitlement_grants_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "execution_runs",
    policyName: "execution_runs_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "outbox_events",
    policyName: "outbox_events_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "policies",
    policyName: "policies_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "projects",
    policyName: "projects_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "roles",
    policyName: "roles_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "storage_objects",
    policyName: "storage_objects_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "teams",
    policyName: "teams_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
  {
    tableName: "usage_limit_counters",
    policyName: "usage_limit_counters_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
  },
] as const satisfies readonly TenantRlsPolicyRow[];

export const TENANT_RLS_COMMERCIAL_PLANS_POLICIES = [
  {
    tableName: "tenant_commercial_plans",
    policyName: "tenant_commercial_plans_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_COMMERCIAL_PLANS_MIGRATION_TAG,
  },
] as const satisfies readonly TenantRlsPolicyRow[];

export const TENANT_RLS_TENANT_SETTINGS_POLICIES = [
  {
    tableName: "tenant_settings",
    policyName: "tenant_settings_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_TENANT_SETTINGS_MIGRATION_TAG,
  },
] as const satisfies readonly TenantRlsPolicyRow[];

export const TENANT_RLS_INVENTORY_MASTER_DATA_POLICIES = [
  {
    tableName: "products",
    policyName: "products_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_INVENTORY_MASTER_DATA_MIGRATION_TAG,
  },
  {
    tableName: "warehouses",
    policyName: "warehouses_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_INVENTORY_MASTER_DATA_MIGRATION_TAG,
  },
] as const satisfies readonly TenantRlsPolicyRow[];

export const TENANT_RLS_INVENTORY_STOCK_POLICIES = [
  {
    tableName: "stock_levels",
    policyName: "stock_levels_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_INVENTORY_STOCK_MIGRATION_TAG,
  },
  {
    tableName: "stock_movements",
    policyName: "stock_movements_tenant_isolation",
    kind: "tenant_isolation",
    migrationTag: TENANT_RLS_INVENTORY_STOCK_MIGRATION_TAG,
  },
] as const satisfies readonly TenantRlsPolicyRow[];

/** Full defense-in-depth registry — foundation, completion, and gap-close migrations. */
export const TENANT_RLS_ISOLATION_POLICIES = [
  ...TENANT_RLS_FOUNDATION_POLICIES,
  ...TENANT_RLS_COMPLETION_POLICIES,
  ...TENANT_RLS_COMMERCIAL_PLANS_POLICIES,
  ...TENANT_RLS_TENANT_SETTINGS_POLICIES,
  ...TENANT_RLS_INVENTORY_MASTER_DATA_POLICIES,
  ...TENANT_RLS_INVENTORY_STOCK_POLICIES,
] as const satisfies readonly TenantRlsPolicyRow[];

export type TenantRlsIsolationPolicy = TenantRlsPolicyRow;

export type TenantRlsIsolationPolicyName =
  (typeof TENANT_RLS_ISOLATION_POLICIES)[number]["policyName"];

export const TENANT_RLS_MIGRATION_POLICY_GROUPS = [
  {
    migrationTag: TENANT_RLS_FOUNDATION_MIGRATION_TAG,
    policies: TENANT_RLS_FOUNDATION_POLICIES,
  },
  {
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
    policies: TENANT_RLS_COMPLETION_POLICIES,
  },
  {
    migrationTag: TENANT_RLS_COMMERCIAL_PLANS_MIGRATION_TAG,
    policies: TENANT_RLS_COMMERCIAL_PLANS_POLICIES,
  },
  {
    migrationTag: TENANT_RLS_TENANT_SETTINGS_MIGRATION_TAG,
    policies: TENANT_RLS_TENANT_SETTINGS_POLICIES,
  },
  {
    migrationTag: TENANT_RLS_INVENTORY_MASTER_DATA_MIGRATION_TAG,
    policies: TENANT_RLS_INVENTORY_MASTER_DATA_POLICIES,
  },
  {
    migrationTag: TENANT_RLS_INVENTORY_STOCK_MIGRATION_TAG,
    policies: TENANT_RLS_INVENTORY_STOCK_POLICIES,
  },
] as const;
