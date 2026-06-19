import type { BetaFlagContract } from "../contracts/beta-flag.contract";
import type { EntitlementContract } from "../contracts/entitlement.contract";
import type { EntitlementContextContract } from "../contracts/entitlement-context.contract";
import type { FeatureFlagContract } from "../contracts/feature-flag.contract";
import type { KillSwitchContract } from "../contracts/kill-switch.contract";
import type { LocalizationContract } from "../contracts/localization.contract";
import type { UsageLimitContract } from "../contracts/usage-limit.contract";

export const governedEntitlementContextExample = {
  tenantId: "tenant_afenda",
  companyId: "company_afenda",
  organizationId: "org_afenda",
  environment: "production",
  module: "accounting",
  feature: "eInvoice",
  userCount: 42,
  usageMetrics: {
    "einvoice.volume.monthly": 120,
  },
  localization: "vn",
  betaFlags: [],
} as const satisfies EntitlementContextContract;

export const governedEntitlementsExample = [
  {
    key: "module.accounting.enabled",
    type: "module",
    enabled: true,
    scope: "tenant",
    tenantId: "tenant_afenda",
    companyId: null,
    environment: null,
    metadata: {},
  },
  {
    key: "feature.e_invoice.enabled",
    type: "feature",
    enabled: true,
    scope: "tenant",
    tenantId: "tenant_afenda",
    companyId: null,
    environment: null,
    metadata: {},
  },
  {
    key: "localization.vn.enabled",
    type: "localization",
    enabled: true,
    scope: "tenant",
    tenantId: "tenant_afenda",
    companyId: null,
    environment: null,
    metadata: {},
  },
] as const satisfies readonly EntitlementContract[];

export const governedFeatureFlagsExample = [
  {
    key: "e_invoice",
    enabled: true,
    rollout: "on",
    environments: ["production"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "feature.e_invoice.kill_switch",
    metadata: {},
  },
] as const satisfies readonly FeatureFlagContract[];

export const governedUsageLimitsExample = [
  {
    key: "einvoice.volume.monthly",
    scope: "tenant",
    period: "monthly",
    maximum: 500,
    used: 120,
    unit: "documents",
  },
  {
    key: "ai.tokens.monthly",
    scope: "tenant",
    period: "monthly",
    maximum: 1000,
    used: 1000,
    unit: "tokens",
  },
] as const satisfies readonly UsageLimitContract[];

export const governedBetaFlagsExample = [
  {
    key: "ai_recommendations",
    enabled: true,
    tenantAllowlist: ["tenant_afenda"],
    companyAllowlist: [],
    startsAt: null,
    endsAt: null,
    metadata: {},
  },
] as const satisfies readonly BetaFlagContract[];

export const governedKillSwitchesExample = [
  {
    key: "feature.e_invoice.kill_switch",
    active: false,
    severity: "critical",
    reason: "",
    activatedBy: null,
    activatedAt: null,
  },
] as const satisfies readonly KillSwitchContract[];

export const governedLocalizationsExample = [
  {
    key: "vn",
    countryCode: "VN",
    enabled: true,
    requiredEntitlement: "localization.vn.enabled",
    jurisdictionName: "Vietnam",
  },
] as const satisfies readonly LocalizationContract[];
