// biome-ignore-all lint/performance/noBarrelFile: TIP-008 stable public surface for feature-flags package

export const PACKAGE_NAME = "@afenda/feature-flags" as const;

// ---------------------------------------------------------------------------
// Core evaluation helpers (backward-compatible surface)
// ---------------------------------------------------------------------------

export {
  type DeploymentEnvironment,
  evaluateAll,
  evaluateFlag,
  type FeatureFlagAuditContract,
  type FeatureFlagContext,
  type FeatureFlagContract,
  type FeatureFlagKey,
  type FeatureFlagResolution,
  type FlagAllowed,
  type FlagDecision,
  type FlagDenialReason,
  type FlagDenied,
  type FlagEvaluationContext,
  isEnabled,
  isEnabledStrict,
  type KillSwitchContract,
  type KillSwitchResolution,
  resolveFeatureFlagStrict,
} from "./flag-evaluation";

// ---------------------------------------------------------------------------
// TIP-008 spec-required public APIs
// ---------------------------------------------------------------------------

export {
  type EvaluateFlagInput,
  evaluateFeatureFlag,
  featureFlag,
} from "./flags/feature-flag.service";

export { killSwitch } from "./kill-switch/kill-switch.service";

// ---------------------------------------------------------------------------
// Contract types (spec-required files surface)
// ---------------------------------------------------------------------------

export type { FeatureFlagAuditContract as FeatureFlagAuditEvent } from "./contracts/feature-flag-audit.contract";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

export {
  allFlagsDisabled,
  allFlagsEnabled,
  allKillSwitchesInactive,
  criticalKillSwitchesActive,
} from "./flag-fixtures";
