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
  "20260623100000_outbox_foundation": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
        AND table_name = 'outbox_events'
        AND constraint_name = 'outbox_events_tenant_id_tenants_id_fk'
    ) AS ok`,
    partialProbe: `
    SELECT (
      to_regclass('public.outbox_events') IS NOT NULL
      OR to_regtype('public.outbox_status') IS NOT NULL
    ) AS partial`,
    partialCleanup: [
      `DROP TABLE IF EXISTS "outbox_events" CASCADE`,
      `DROP TYPE IF EXISTS "public"."outbox_status"`,
    ],
  },
  "20260624100000_entity_group_membership_scope": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'memberships'
        AND column_name = 'entity_group_id'
    ) AS ok`,
    partialProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'membership_scope'
        AND e.enumlabel = 'entity_group'
    ) AS partial`,
    partialCleanup: [
      `DROP INDEX IF EXISTS "memberships_entity_group_scope_unique"`,
      `DROP INDEX IF EXISTS "memberships_entity_group_id_idx"`,
      `ALTER TABLE "memberships" DROP CONSTRAINT IF EXISTS "memberships_entity_group_id_entity_groups_id_fk"`,
      `ALTER TABLE "memberships" DROP COLUMN IF EXISTS "entity_group_id"`,
    ],
  },
  "20260624120000_project_team_foundation": {
    completeProbe: `
    SELECT (
      to_regclass('public.projects') IS NOT NULL
      AND to_regclass('public.teams') IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'memberships'
          AND column_name = 'project_id'
      )
    ) AS ok`,
    partialProbe: `
    SELECT (
      to_regtype('public.project_lifecycle_status') IS NOT NULL
      OR to_regclass('public.projects') IS NOT NULL
    ) AS partial`,
    partialCleanup: [
      `DROP INDEX IF EXISTS "memberships_project_scope_unique"`,
      `DROP INDEX IF EXISTS "memberships_project_id_idx"`,
      `ALTER TABLE "memberships" DROP CONSTRAINT IF EXISTS "memberships_project_id_projects_id_fk"`,
      `ALTER TABLE "memberships" DROP COLUMN IF EXISTS "project_id"`,
      `DROP TABLE IF EXISTS "teams" CASCADE`,
      `DROP TABLE IF EXISTS "projects" CASCADE`,
      `DROP TYPE IF EXISTS "public"."project_lifecycle_status"`,
    ],
  },
  "20260624140000_team_membership_scope": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'memberships'
        AND column_name = 'team_id'
    ) AS ok`,
    partialProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON e.enumtypid = t.oid
      WHERE t.typname = 'membership_scope'
        AND e.enumlabel = 'team'
    ) AS partial`,
    partialCleanup: [
      `DROP INDEX IF EXISTS "memberships_team_scope_unique"`,
      `DROP INDEX IF EXISTS "memberships_team_id_idx"`,
      `ALTER TABLE "memberships" DROP CONSTRAINT IF EXISTS "memberships_team_id_teams_id_fk"`,
      `ALTER TABLE "memberships" DROP COLUMN IF EXISTS "team_id"`,
    ],
  },
  "20260624150000_tenant_rls_completion": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'projects'
        AND policyname = 'projects_tenant_isolation'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
  "20260624115705_tenant_commercial_plans_rls": {
    completeProbe: `
    SELECT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'tenant_commercial_plans'
        AND policyname = 'tenant_commercial_plans_tenant_isolation'
    ) AS ok`,
    partialProbe: "SELECT false AS partial",
    partialCleanup: [],
  },
};
