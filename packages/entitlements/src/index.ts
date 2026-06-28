// biome-ignore-all lint/performance/noBarrelFile: Foundation phase 08 requires a stable public root export surface.
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
export {
  buildEvaluationCacheKey,
  type CachedEvaluateCapabilityOptions,
  createCachedCapabilityEvaluator,
  createMemoryEvaluationCache,
  type EvaluationCache,
  type EvaluationCacheEntry,
  type EvaluationCacheKeyInput,
} from "./cache/evaluation-cache";
export {
  type CreateEvaluationCacheFromEnvOptions,
  createEvaluationCacheFromEnv,
  createUpstashEvaluationCacheFromEnv,
  getUpstashRedisConfig,
  hasUpstashRedisConfig,
  MissingUpstashRedisConfigError,
  probeUpstashRedisConnectivity,
  type UpstashRedisConfig,
} from "./cache/redis-env";
export { createUpstashEvaluationCache } from "./cache/upstash-evaluation-cache";
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
  KillSwitchKey,
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
  ERP_MODULE_IDS,
  ERP_MODULE_MANIFEST,
  type ErpModuleId,
  type ErpModuleManifestEntry,
  getErpModuleManifest,
  isErpModuleId,
  listErpModuleManifests,
  type ModuleRoutePath,
} from "./evaluation/feature-manifest.registry";
export {
  getModuleManifestCapabilityBinding,
  listModuleManifestCapabilityBindings,
  type ModuleManifestCapabilityBinding,
  resolveModuleOptionalCapabilities,
} from "./evaluation/module-manifest-capability-registry";
export {
  assertModuleRoutePath,
  getModuleRoute,
  getModuleRouteByPath,
  isModuleRoutePath,
  listModuleRoutes,
  MODULE_ROUTE_MANIFEST,
  type ModuleRouteManifestEntry,
  moduleIdFromRoutePath,
} from "./evaluation/module-route-manifest";
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
  basicTierFixture,
  betaTierFixture,
  buildContext,
  disabledStateFixture,
  enterpriseTierFixture,
  proTierFixture,
  type TierFixture,
} from "./fixtures/tier-fixtures";
export {
  type FeatureFlagLookupContext,
  type FeatureFlagResolution,
  featureFlag,
  resolveFeatureFlag,
  resolveFeatureFlagStrict,
} from "./flags/feature-flag-engine";
export {
  FEATURE_FLAG_FAIL_OPEN_DEFAULT,
  FEATURE_FLAG_ROLLOUT_POLICY,
  FEATURE_FLAG_STRICT_POLICY,
  type FeatureFlagResolutionPolicy,
} from "./flags/feature-flag-policy";
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
export {
  type MappedEntitlementEvaluationData,
  mapDatabaseBundleToEvaluationData,
} from "./provisioning/database-bundle.mapper";
export {
  type MappedRolloutEvaluationData,
  mapPlatformRolloutToEvaluationData,
} from "./provisioning/rollout-bundle.mapper";
