import type { TenantEntitlementBundle } from "@afenda/database";

import type { EntitlementContract } from "../contracts/entitlement.contract";
import type { DeploymentEnvironment } from "../contracts/shared.contract";
import type {
  UsageLimitContract,
  UsageLimitKey,
} from "../contracts/usage-limit.contract";

const USAGE_LIMIT_KEYS = [
  "users.max",
  "companies.max",
  "organizations.max",
  "api.calls.daily",
  "storage.gb.max",
  "ai.tokens.monthly",
  "einvoice.volume.monthly",
  "automation.runs.monthly",
] as const satisfies readonly UsageLimitKey[];

function isUsageLimitKey(key: string): key is UsageLimitKey {
  return (USAGE_LIMIT_KEYS as readonly string[]).includes(key);
}

function isDeploymentEnvironment(
  value: string | null
): value is DeploymentEnvironment | null {
  if (value === null) {
    return true;
  }

  return (
    value === "development" ||
    value === "preview" ||
    value === "staging" ||
    value === "production" ||
    value === "test"
  );
}

export interface MappedEntitlementEvaluationData {
  readonly entitlements: readonly EntitlementContract[];
  readonly usageLimits: readonly UsageLimitContract[];
}

/** Maps a persisted tenant bundle into evaluation-ready entitlement contracts. */
export function mapDatabaseBundleToEvaluationData(
  bundle: TenantEntitlementBundle
): MappedEntitlementEvaluationData {
  return {
    entitlements: bundle.entitlements.map((grant) => ({
      key: grant.key,
      type: grant.type,
      enabled: grant.enabled,
      scope: grant.scope,
      tenantId: grant.tenantId,
      companyId: grant.companyId,
      environment: isDeploymentEnvironment(grant.environment)
        ? grant.environment
        : null,
      metadata: grant.metadata as EntitlementContract["metadata"],
    })),
    usageLimits: bundle.usageLimits.flatMap((limit) => {
      if (!isUsageLimitKey(limit.key)) {
        return [];
      }

      return [
        {
          key: limit.key,
          scope: limit.scope,
          period: limit.period,
          maximum: limit.maximum,
          used: limit.used,
          unit: limit.unit,
        },
      ];
    }),
  };
}
