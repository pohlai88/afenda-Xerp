import type { FeatureFlagContract } from "../contracts/feature-flag.contract";
import type {
  DeploymentEnvironment,
  FeatureFlagKey,
} from "../contracts/shared.contract";
import {
  FEATURE_FLAG_ROLLOUT_POLICY,
  FEATURE_FLAG_STRICT_POLICY,
  type FeatureFlagResolutionPolicy,
} from "./feature-flag-policy";

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

/**
 * Returns whether a feature flag is enabled for the given context.
 *
 * Missing flags fail open (`enabled: true`) to support gradual rollout.
 * For security-sensitive paths use `resolveFeatureFlagStrict`.
 */
export function featureFlag(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FeatureFlagLookupContext
): boolean {
  return resolveFeatureFlag(key, flags, context).enabled;
}

/**
 * Resolves a feature flag using the rollout policy (fail-open when missing).
 *
 * When `matchingFlag` is undefined the resolver returns `enabled: true`.
 * This is intentional for staged deployments but must not be used as an
 * authorization gate. Pair with entitlement checks or `resolveFeatureFlagStrict`.
 */
export function resolveFeatureFlag(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FeatureFlagLookupContext,
  policy: FeatureFlagResolutionPolicy = FEATURE_FLAG_ROLLOUT_POLICY
): FeatureFlagResolution {
  const matchingFlag = flags.find((flag) => flag.key === key);

  if (!matchingFlag) {
    return {
      key,
      enabled: policy.missingFlagBehavior === "allow",
      flag: null,
    };
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

/**
 * Strict resolver for security-sensitive feature gates.
 *
 * Missing flags return `enabled: false`. Prefer this over `resolveFeatureFlag`
 * when absence of registry data must deny access (SSO, admin surfaces, etc.).
 */
export function resolveFeatureFlagStrict(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FeatureFlagLookupContext
): FeatureFlagResolution {
  return resolveFeatureFlag(key, flags, context, FEATURE_FLAG_STRICT_POLICY);
}
