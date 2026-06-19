// TIP-008 capability evaluation contracts — decision results and the full gate input surface.

export type { BetaFlagContract } from "./beta-flag.contract";
export type {
  EntitlementContract,
  EntitlementType,
} from "./entitlement.contract";
export type { EntitlementContextContract } from "./entitlement-context.contract";
// biome-ignore lint/performance/noBarrelFile: aggregate TIP-008 contract surface for downstream consumers.
export {
  type EntitlementDecisionContract,
  type EntitlementDecisionResult,
  entitlementDecisionResults,
} from "./entitlement-decision.contract";
export type {
  FeatureFlagContract,
  FeatureFlagRollout,
} from "./feature-flag.contract";
export type {
  KillSwitchContract,
  KillSwitchSeverity,
} from "./kill-switch.contract";
export type { LocalizationContract } from "./localization.contract";
export type {
  UsageLimitContract,
  UsageLimitKey,
  UsageLimitPeriod,
} from "./usage-limit.contract";
