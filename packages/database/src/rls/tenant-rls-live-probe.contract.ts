import {
  TENANT_RLS_COMPLETION_MIGRATION_TAG,
  TENANT_RLS_ISOLATION_POLICIES,
  type TenantRlsIsolationPolicy,
} from "./tenant-rls-coverage.contract.js";

const PUBLIC_SCHEMA = "public" as const;

export interface TenantRlsLiveProbeSql {
  readonly text: string;
  readonly values: readonly [string, string];
}

export interface TenantRlsLivePolicyProbeRow extends Record<string, unknown> {
  readonly policy_exists: boolean;
  readonly rls_enabled: boolean;
}

export type TenantRlsLivePolicyProbeStatus =
  | {
      readonly status: "ok";
      readonly tableName: string;
      readonly policyName: string;
    }
  | {
      readonly status: "rls-disabled";
      readonly tableName: string;
      readonly policyName: string;
    }
  | {
      readonly status: "policy-missing";
      readonly tableName: string;
      readonly policyName: string;
    }
  | {
      readonly status: "both-missing";
      readonly tableName: string;
      readonly policyName: string;
    };

export interface TenantRlsCompletionMigrationLiveProbe {
  readonly migrationTag: typeof TENANT_RLS_COMPLETION_MIGRATION_TAG;
  readonly text: string;
}

/** Read-only probe: RLS enabled on table and tenant isolation policy present. */
export function buildTenantRlsPolicyLiveProbeSql(
  policy: TenantRlsIsolationPolicy
): TenantRlsLiveProbeSql {
  return {
    text: `
      SELECT
        EXISTS (
          SELECT 1
          FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE n.nspname = '${PUBLIC_SCHEMA}'
            AND c.relname = $1
            AND c.relrowsecurity = true
        ) AS rls_enabled,
        EXISTS (
          SELECT 1
          FROM pg_policies p
          WHERE p.schemaname = '${PUBLIC_SCHEMA}'
            AND p.tablename = $1
            AND p.policyname = $2
        ) AS policy_exists`,
    values: [policy.tableName, policy.policyName],
  };
}

export function classifyTenantRlsPolicyProbeResult(
  policy: TenantRlsIsolationPolicy,
  row: TenantRlsLivePolicyProbeRow
): TenantRlsLivePolicyProbeStatus {
  const { tableName, policyName } = policy;

  if (row.rls_enabled && row.policy_exists) {
    return { status: "ok", tableName, policyName };
  }

  if (!(row.rls_enabled || row.policy_exists)) {
    return { status: "both-missing", tableName, policyName };
  }

  if (!row.rls_enabled) {
    return { status: "rls-disabled", tableName, policyName };
  }

  return { status: "policy-missing", tableName, policyName };
}

/**
 * Consolidated migration completion probe — mirrors migration governance
 * `completeProbe` for `20260624150000_tenant_rls_completion`.
 */
export function buildTenantRlsCompletionMigrationLiveProbe(): TenantRlsCompletionMigrationLiveProbe {
  return {
    migrationTag: TENANT_RLS_COMPLETION_MIGRATION_TAG,
    text: `
      SELECT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = '${PUBLIC_SCHEMA}'
          AND tablename = 'projects'
          AND policyname = 'projects_tenant_isolation'
      ) AS ok`,
  };
}

export const TENANT_RLS_LIVE_POLICY_PROBES = TENANT_RLS_ISOLATION_POLICIES.map(
  (policy) => ({
    policy,
    probe: buildTenantRlsPolicyLiveProbeSql(policy),
  })
);
