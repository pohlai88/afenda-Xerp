import type { FeatureFlagContract } from "../contracts/feature-flag.contract";
import type {
  DeploymentEnvironment,
  FeatureFlagKey,
} from "../contracts/shared.contract";

export interface FeatureFlagLookupContext {
  readonly companyId: string;
  readonly environment: DeploymentEnvironment;
  readonly tenantId: string;
}

export interface FeatureFlagResolution {
  readonly enabled: boolean;
  readonly flag: FeatureFlagContract | null;
  readonly key: FeatureFlagKey;
}

export function featureFlag(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FeatureFlagLookupContext
): boolean {
  return resolveFeatureFlag(key, flags, context).enabled;
}

export function resolveFeatureFlag(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FeatureFlagLookupContext
): FeatureFlagResolution {
  const matchingFlag = flags.find((flag) => flag.key === key);

  if (!matchingFlag) {
    return { key, enabled: true, flag: null };
  }

  const environmentAllowed = matchingFlag.environments.includes(
    context.environment
  );
  const tenantAllowed =
    matchingFlag.tenantAllowlist.length === 0 ||
    matchingFlag.tenantAllowlist.includes(context.tenantId);
  const companyAllowed =
    matchingFlag.companyAllowlist.length === 0 ||
    matchingFlag.companyAllowlist.includes(context.companyId);

  return {
    key,
    enabled:
      matchingFlag.enabled &&
      matchingFlag.rollout !== "off" &&
      environmentAllowed &&
      tenantAllowed &&
      companyAllowed,
    flag: matchingFlag,
  };
}
