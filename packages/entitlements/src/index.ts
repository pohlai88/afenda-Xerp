// biome-ignore-all lint/performance/noBarrelFile: TIP-008 requires a stable public root export surface.
export const PACKAGE_NAME = "@afenda/entitlements" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  type CreateEntitlementAuditInput,
  createEntitlementAuditEvent,
} from "./audit/entitlement-audit";
export {
  type BetaAccessContext,
  type BetaAccessResolution,
  beta,
  resolveBetaAccess,
} from "./beta/beta-access-engine";
export type { BetaFlagContract } from "./contracts/beta-flag.contract";
export type {
  EntitlementContract,
  EntitlementType,
} from "./contracts/entitlement.contract";
export { entitlementTypes } from "./contracts/entitlement.contract";
export type {
  EntitlementAuditContract,
  EntitlementAuditEvidence,
} from "./contracts/entitlement-audit.contract";
export type { EntitlementContextContract } from "./contracts/entitlement-context.contract";
export type {
  EntitlementDecisionContract,
  EntitlementDecisionResult,
} from "./contracts/entitlement-decision.contract";
export { entitlementDecisionResults } from "./contracts/entitlement-decision.contract";
export type { EntitlementsExportContract } from "./contracts/export.contract";
export type {
  FeatureFlagContract,
  FeatureFlagRollout,
} from "./contracts/feature-flag.contract";
export type {
  KillSwitchContract,
  KillSwitchSeverity,
} from "./contracts/kill-switch.contract";
export type { LocalizationContract } from "./contracts/localization.contract";
export type {
  DeploymentEnvironment,
  EntitlementKey,
  FeatureFlagKey,
  JsonPrimitive,
  JsonValue,
} from "./contracts/shared.contract";
export type {
  UsageLimitContract,
  UsageLimitKey,
  UsageLimitPeriod,
} from "./contracts/usage-limit.contract";
export { requiredUsageLimitKeys } from "./contracts/usage-limit.contract";
export {
  type EvaluateCapabilityInput,
  evaluateCapability,
} from "./evaluation/capability-evaluation";
export {
  type CapabilityDefinition,
  type CapabilityKind,
  capabilities,
  capabilityList,
  getCapability,
} from "./evaluation/capability-registry";
export {
  type EntitlementLookupContext,
  type EntitlementResolution,
  entitlement,
  resolveEntitlement,
} from "./evaluation/entitlement-engine";
export {
  type FeatureManifestContract,
  featureManifests,
} from "./evaluation/feature-manifest";
export {
  governedBetaFlagsExample,
  governedEntitlementContextExample,
  governedEntitlementsExample,
  governedFeatureFlagsExample,
  governedKillSwitchesExample,
  governedLocalizationsExample,
  governedUsageLimitsExample,
} from "./examples/governed-entitlement.example";
export {
  type FeatureFlagLookupContext,
  type FeatureFlagResolution,
  featureFlag,
  resolveFeatureFlag,
} from "./flags/feature-flag-engine";
export {
  type KillSwitchResolution,
  resolveKillSwitch,
} from "./flags/kill-switch-engine";
export {
  limit,
  resolveUsageLimit,
  type UsageLimitResolution,
} from "./limits/usage-limit-engine";
export {
  type LocalizationResolution,
  localization,
  resolveLocalizationAccess,
} from "./localization/localization-engine";
