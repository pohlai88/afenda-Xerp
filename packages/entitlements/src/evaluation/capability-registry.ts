import type { UsageLimitKey } from "../contracts/usage-limit.contract";

export type CapabilityKind =
  | "module"
  | "feature"
  | "localization"
  | "deployment"
  | "support"
  | "security"
  | "beta";

export interface CapabilityDefinition {
  readonly betaFlagKey: string | null;
  readonly entitlementKey: string;
  readonly featureFlagKey: string | null;
  readonly key: string;
  readonly killSwitchKey: string | null;
  readonly kind: CapabilityKind;
  readonly limitKey: UsageLimitKey | null;
  readonly localizationKey: string | null;
}

export const capabilities = {
  accounting: {
    key: "accounting",
    kind: "module",
    entitlementKey: "module.accounting.enabled",
    featureFlagKey: null,
    betaFlagKey: null,
    localizationKey: null,
    limitKey: null,
    killSwitchKey: "module.accounting.kill_switch",
  },
  mrp: {
    key: "mrp",
    kind: "module",
    entitlementKey: "module.mrp.enabled",
    featureFlagKey: null,
    betaFlagKey: null,
    localizationKey: null,
    limitKey: null,
    killSwitchKey: "module.mrp.kill_switch",
  },
  aiCopilot: {
    key: "aiCopilot",
    kind: "module",
    entitlementKey: "module.ai_copilot.enabled",
    featureFlagKey: "new_ai_copilot",
    betaFlagKey: "ai_recommendations",
    localizationKey: null,
    limitKey: "ai.tokens.monthly",
    killSwitchKey: "module.ai_copilot.kill_switch",
  },
  eInvoice: {
    key: "eInvoice",
    kind: "feature",
    entitlementKey: "feature.e_invoice.enabled",
    featureFlagKey: "e_invoice",
    betaFlagKey: null,
    localizationKey: "vn",
    limitKey: "einvoice.volume.monthly",
    killSwitchKey: "feature.e_invoice.kill_switch",
  },
  lotTracking: {
    key: "lotTracking",
    kind: "feature",
    entitlementKey: "feature.lot_tracking.enabled",
    featureFlagKey: "lot_tracking",
    betaFlagKey: null,
    localizationKey: null,
    limitKey: null,
    killSwitchKey: "feature.lot_tracking.kill_switch",
  },
  forecasting: {
    key: "forecasting",
    kind: "feature",
    entitlementKey: "feature.forecasting.enabled",
    featureFlagKey: "forecasting",
    betaFlagKey: "ai_forecasting",
    localizationKey: null,
    limitKey: "ai.tokens.monthly",
    killSwitchKey: "feature.forecasting.kill_switch",
  },
  auditExport: {
    key: "auditExport",
    kind: "feature",
    entitlementKey: "feature.audit_export.enabled",
    featureFlagKey: "audit_export",
    betaFlagKey: null,
    localizationKey: null,
    limitKey: "api.calls.daily",
    killSwitchKey: "feature.audit_export.kill_switch",
  },
  vietnamLocalization: {
    key: "vietnamLocalization",
    kind: "localization",
    entitlementKey: "localization.vn.enabled",
    featureFlagKey: null,
    betaFlagKey: null,
    localizationKey: "vn",
    limitKey: null,
    killSwitchKey: "localization.vn.kill_switch",
  },
  malaysiaLocalization: {
    key: "malaysiaLocalization",
    kind: "localization",
    entitlementKey: "localization.my.enabled",
    featureFlagKey: null,
    betaFlagKey: null,
    localizationKey: "my",
    limitKey: null,
    killSwitchKey: "localization.my.kill_switch",
  },
  selfHostedDeployment: {
    key: "selfHostedDeployment",
    kind: "deployment",
    entitlementKey: "deployment.self_hosted.enabled",
    featureFlagKey: null,
    betaFlagKey: null,
    localizationKey: null,
    limitKey: null,
    killSwitchKey: "deployment.self_hosted.kill_switch",
  },
  managedCloudDeployment: {
    key: "managedCloudDeployment",
    kind: "deployment",
    entitlementKey: "deployment.managed_cloud.enabled",
    featureFlagKey: null,
    betaFlagKey: null,
    localizationKey: null,
    limitKey: null,
    killSwitchKey: "deployment.managed_cloud.kill_switch",
  },
  prioritySupport: {
    key: "prioritySupport",
    kind: "support",
    entitlementKey: "support.sla_24_7.enabled",
    featureFlagKey: null,
    betaFlagKey: null,
    localizationKey: null,
    limitKey: null,
    killSwitchKey: "support.sla_24_7.kill_switch",
  },
  sso: {
    key: "sso",
    kind: "security",
    entitlementKey: "security.sso.enabled",
    featureFlagKey: "sso",
    betaFlagKey: null,
    localizationKey: null,
    limitKey: null,
    killSwitchKey: "security.sso.kill_switch",
  },
  aiRecommendations: {
    key: "aiRecommendations",
    kind: "beta",
    entitlementKey: "beta.ai_recommendations.enabled",
    featureFlagKey: "ai_recommendations",
    betaFlagKey: "ai_recommendations",
    localizationKey: null,
    limitKey: "ai.tokens.monthly",
    killSwitchKey: "beta.ai_recommendations.kill_switch",
  },
} as const satisfies Readonly<Record<string, CapabilityDefinition>>;

export const capabilityList = Object.values(capabilities);

export function getCapability(
  capabilityKey: string
): CapabilityDefinition | null {
  return (
    capabilityList.find((capability) => capability.key === capabilityKey) ??
    null
  );
}
