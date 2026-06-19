/**
 * Default rollout policy when a feature flag key is absent from the registry.
 *
 * Fail-open enables gradual rollout: new code paths stay enabled until an
 * operator registers and disables a flag. Do not rely on this default for
 * security-sensitive capabilities — use `resolveFeatureFlagStrict` instead.
 */
export const FEATURE_FLAG_FAIL_OPEN_DEFAULT = true as const;

export interface FeatureFlagResolutionPolicy {
  readonly missingFlagBehavior: "allow" | "deny";
}

export const FEATURE_FLAG_ROLLOUT_POLICY: FeatureFlagResolutionPolicy = {
  missingFlagBehavior: "allow",
};

export const FEATURE_FLAG_STRICT_POLICY: FeatureFlagResolutionPolicy = {
  missingFlagBehavior: "deny",
};
