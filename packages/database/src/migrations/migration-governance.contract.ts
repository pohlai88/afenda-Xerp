/** Schema probes and partial-artifact cleanup for migration repair/normalization. */

export interface MigrationGovernanceRule {
  /** SQL returning a single `ok` boolean when the migration is fully applied. */
  readonly completeProbe: string;
  /** Idempotent SQL statements to remove partial artifacts before retrying. */
  readonly partialCleanup: readonly string[];
  /** SQL returning a single `partial` boolean when failed mid-migration artifacts remain. */
  readonly partialProbe: string;
}

export const MIGRATION_GOVERNANCE_RULES: Record<
  string,
  MigrationGovernanceRule
> = {
  "20260619181744_great_robbie_robertson": {
    completeProbe: `
    SELECT to_regclass('public.tenants') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619195805_mushy_kronos": {
    completeProbe: `
    SELECT to_regclass('public.users') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619204304_sweet_kingpin": {
    completeProbe: `
    SELECT to_regclass('public.audit_events') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619210000_auth_schema_enterprise": {
    completeProbe: `
    SELECT to_regclass('public.auth_user') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619213000_company_governance": {
    completeProbe: `
    SELECT to_regclass('public.companies') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619220000_organization_governance": {
    completeProbe: `
    SELECT to_regclass('public.organizations') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619230000_membership_governance": {
    completeProbe: `
    SELECT to_regclass('public.memberships') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619240000_role_governance": {
    completeProbe: `
    SELECT to_regclass('public.roles') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260619250000_policy_governance": {
    completeProbe: `
    SELECT to_regclass('public.policies') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260620050000_role_permissions": {
    completeProbe: `
    SELECT to_regclass('public.role_permissions') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260620060000_entitlement_governance": {
    completeProbe: `
    SELECT to_regclass('public.entitlement_grants') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260620070000_platform_rollout_store": {
    completeProbe: `
    SELECT to_regclass('public.platform_feature_flags') IS NOT NULL AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260620080000_observability_audit_baseline": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'audit_events'
        AND column_name = 'actor_id'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260620090000_storage_metadata": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'storage_objects'
        AND constraint_name = 'storage_objects_tenant_id_tenants_id_fk'
    ) AS ok`,
    partialProbe: `
    SELECT (
      to_regclass('public.storage_objects') IS NOT NULL
      OR to_regtype('public.storage_provider') IS NOT NULL
    ) AS partial`,
    partialCleanup: [
      `DROP TABLE IF EXISTS "storage_objects" CASCADE`,
      `DROP TYPE IF EXISTS "public"."storage_provider"`,
    ],
  },
  "20260620100000_execution_foundation": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'execution_runs'
        AND constraint_name = 'execution_runs_tenant_id_tenants_id_fk'
    ) AS ok`,
    partialProbe: `
    SELECT (
      to_regclass('public.execution_runs') IS NOT NULL
      OR to_regtype('public.execution_status') IS NOT NULL
    ) AS partial`,
    partialCleanup: [
      `DROP TABLE IF EXISTS "execution_runs" CASCADE`,
      `DROP TYPE IF EXISTS "public"."execution_status"`,
    ],
  },
  "20260621100000_entity_group_foundation": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'entity_groups'
        AND constraint_name = 'entity_groups_tenant_id_tenants_id_fk'
    ) AS ok`,
    partialProbe: `
    SELECT (
      to_regclass('public.entity_groups') IS NOT NULL
      OR to_regclass('public.legal_entity_ownership') IS NOT NULL
      OR to_regtype('public.ownership_control_type') IS NOT NULL
    ) AS partial`,
    partialCleanup: [
      `DROP TABLE IF EXISTS "legal_entity_ownership" CASCADE`,
      `DROP TABLE IF EXISTS "entity_groups" CASCADE`,
      `DROP TYPE IF EXISTS "public"."consolidation_method"`,
      `DROP TYPE IF EXISTS "public"."ownership_relationship_type"`,
      `DROP TYPE IF EXISTS "public"."ownership_control_type"`,
    ],
  },
  "20260621110000_tenant_company_rls": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'companies'
        AND policyname = 'companies_tenant_isolation'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260621120000_rls_app_session_fallback": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'companies'
        AND policyname = 'companies_tenant_isolation'
        AND qual LIKE '%app.tenant_id%'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260621130000_legal_entity_company_authority": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'companies'
        AND column_name = 'company_type'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260621140000_ownership_interest_authority": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'legal_entity_ownership'
        AND column_name = 'non_controlling_interest_applicable'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260621150000_organization_unit_authority": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'organizations'
        AND column_name = 'effective_from'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
};
