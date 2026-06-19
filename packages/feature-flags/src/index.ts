// biome-ignore-all lint/performance/noBarrelFile: TIP-008 stable public surface for feature-flags package

export const PACKAGE_NAME = "@afenda/feature-flags" as const;

export {
  type DeploymentEnvironment,
  evaluateAll,
  evaluateFlag,
  type FeatureFlagContract,
  type FeatureFlagKey,
  type FeatureFlagResolution,
  type FlagAllowed,
  type FlagDecision,
  type FlagDenialReason,
  type FlagDenied,
  type FlagEvaluationContext,
  isEnabled,
  type KillSwitchContract,
  type KillSwitchResolution,
} from "./flag-evaluation";
export {
  allFlagsDisabled,
  allFlagsEnabled,
  allKillSwitchesInactive,
  criticalKillSwitchesActive,
} from "./flag-fixtures";
