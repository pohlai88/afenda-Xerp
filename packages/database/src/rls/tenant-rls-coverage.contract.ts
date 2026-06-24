/** Canonical tenant RLS defense-in-depth coverage (migration 20260624150000). */
export interface TenantRlsIsolationPolicy {
  readonly policyName: string;
  readonly tableName: string;
}

export const TENANT_RLS_COMPLETION_MIGRATION_TAG =
  "20260624150000_tenant_rls_completion" as const;

export const TENANT_RLS_ISOLATION_POLICIES = [
  { tableName: "audit_events", policyName: "audit_events_tenant_isolation" },
  {
    tableName: "entitlement_grants",
    policyName: "entitlement_grants_tenant_isolation",
  },
  {
    tableName: "execution_runs",
    policyName: "execution_runs_tenant_isolation",
  },
  { tableName: "outbox_events", policyName: "outbox_events_tenant_isolation" },
  { tableName: "policies", policyName: "policies_tenant_isolation" },
  { tableName: "projects", policyName: "projects_tenant_isolation" },
  { tableName: "roles", policyName: "roles_tenant_isolation" },
  {
    tableName: "storage_objects",
    policyName: "storage_objects_tenant_isolation",
  },
  { tableName: "teams", policyName: "teams_tenant_isolation" },
  {
    tableName: "usage_limit_counters",
    policyName: "usage_limit_counters_tenant_isolation",
  },
] as const satisfies readonly TenantRlsIsolationPolicy[];

export type TenantRlsIsolationPolicyName =
  (typeof TENANT_RLS_ISOLATION_POLICIES)[number]["policyName"];
