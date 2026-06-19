import type { EntitlementContract } from "../contracts/entitlement.contract";
import type {
  DeploymentEnvironment,
  EntitlementKey,
} from "../contracts/shared.contract";

export interface EntitlementLookupContext {
  readonly companyId: string;
  readonly environment: DeploymentEnvironment;
  readonly tenantId: string;
}

export interface EntitlementResolution {
  readonly enabled: boolean;
  readonly entitlement: EntitlementContract | null;
  readonly key: EntitlementKey;
}

export function entitlement(
  key: EntitlementKey,
  entitlements: readonly EntitlementContract[],
  context: EntitlementLookupContext
): boolean {
  return resolveEntitlement(key, entitlements, context).enabled;
}

export function resolveEntitlement(
  key: EntitlementKey,
  entitlements: readonly EntitlementContract[],
  context: EntitlementLookupContext
): EntitlementResolution {
  const matchingEntitlement = entitlements.find(
    (item) => item.key === key && item.enabled && isInScope(item, context)
  );

  return {
    key,
    enabled: Boolean(matchingEntitlement),
    entitlement: matchingEntitlement ?? null,
  };
}

function isInScope(
  entitlementItem: EntitlementContract,
  context: EntitlementLookupContext
): boolean {
  if (entitlementItem.scope === "global") {
    return true;
  }

  if (entitlementItem.scope === "tenant") {
    return entitlementItem.tenantId === context.tenantId;
  }

  if (entitlementItem.scope === "company") {
    return entitlementItem.companyId === context.companyId;
  }

  return entitlementItem.environment === context.environment;
}
