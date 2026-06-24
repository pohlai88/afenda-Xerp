import {
  MissingMigrationDatabaseUrlError,
  resolveMigrationDatabaseUrl,
} from "../env.js";
import { TENANT_RLS_ISOLATION_POLICIES } from "./tenant-rls-coverage.contract.js";
import {
  buildTenantRlsPolicyLiveProbeSql,
  classifyTenantRlsPolicyProbeResult,
  type TenantRlsLivePolicyProbeRow,
} from "./tenant-rls-live-probe.contract.js";
import { TENANT_RLS_MIGRATION_LIVE_PROBES } from "./tenant-rls-migration-live-probe.contract.js";

export interface PgQueryable {
  query<T extends Record<string, unknown>>(
    text: string,
    values?: readonly unknown[]
  ): Promise<{ rows: T[] }>;
}

export type TenantRlsLiveViolationRule =
  | "rls-disabled"
  | "policy-missing"
  | "both-missing"
  | "probe-empty"
  | "migration-probe-failed";

export interface TenantRlsLiveViolation {
  readonly message: string;
  readonly policyName: string;
  readonly rule: TenantRlsLiveViolationRule;
  readonly tableName: string;
}

export function isLiveTenantRlsVerificationAvailable(
  env: NodeJS.ProcessEnv = process.env
): boolean {
  try {
    resolveMigrationDatabaseUrl(env);
    return true;
  } catch (error) {
    if (error instanceof MissingMigrationDatabaseUrlError) {
      return false;
    }

    throw error;
  }
}

function violationMessage(
  rule: TenantRlsLiveViolationRule,
  tableName: string,
  policyName: string
): string {
  switch (rule) {
    case "rls-disabled":
      return `Row level security is not enabled on public.${tableName}`;
    case "policy-missing":
      return `Policy ${policyName} is missing on public.${tableName}`;
    case "both-missing":
      return `RLS and policy ${policyName} are missing on public.${tableName}`;
    case "probe-empty":
      return `Live probe returned no rows for public.${tableName} / ${policyName}`;
    case "migration-probe-failed":
      return `Tenant RLS migration ${tableName} live probe failed for policy ${policyName}`;
    default: {
      const exhaustive: never = rule;
      return exhaustive;
    }
  }
}

export async function verifyTenantRlsLive(
  pool: PgQueryable
): Promise<TenantRlsLiveViolation[]> {
  const violations: TenantRlsLiveViolation[] = [];

  for (const policy of TENANT_RLS_ISOLATION_POLICIES) {
    const probe = buildTenantRlsPolicyLiveProbeSql(policy);
    const result = await pool.query<TenantRlsLivePolicyProbeRow>(probe.text, [
      ...probe.values,
    ]);
    const row = result.rows[0];

    if (!row) {
      violations.push({
        rule: "probe-empty",
        tableName: policy.tableName,
        policyName: policy.policyName,
        message: violationMessage(
          "probe-empty",
          policy.tableName,
          policy.policyName
        ),
      });
      continue;
    }

    const status = classifyTenantRlsPolicyProbeResult(policy, row);
    if (status.status !== "ok") {
      violations.push({
        rule: status.status,
        tableName: policy.tableName,
        policyName: policy.policyName,
        message: violationMessage(
          status.status,
          policy.tableName,
          policy.policyName
        ),
      });
    }
  }

  for (const migrationProbe of TENANT_RLS_MIGRATION_LIVE_PROBES) {
    const migration = await pool.query<{ ok: boolean }>(migrationProbe.text);
    if (!migration.rows[0]?.ok) {
      const { policyName } = migrationProbe.sentinelPolicy;
      violations.push({
        rule: "migration-probe-failed",
        tableName: migrationProbe.migrationTag,
        policyName,
        message: violationMessage(
          "migration-probe-failed",
          migrationProbe.migrationTag,
          policyName
        ),
      });
    }
  }

  return violations;
}
