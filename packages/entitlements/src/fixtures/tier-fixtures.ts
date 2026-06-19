import type { BetaFlagContract } from "../contracts/beta-flag.contract";
import type { EntitlementContract } from "../contracts/entitlement.contract";
import type { EntitlementContextContract } from "../contracts/entitlement-context.contract";
import type { FeatureFlagContract } from "../contracts/feature-flag.contract";
import type { KillSwitchContract } from "../contracts/kill-switch.contract";
import type { LocalizationContract } from "../contracts/localization.contract";
import type { UsageLimitContract } from "../contracts/usage-limit.contract";

// ---------------------------------------------------------------------------
// Tier fixtures — governed by entitlement keys, NOT tier names.
// Product code must call hasEntitlement / evaluateCapability, never compare
// tier strings. These fixtures simulate resolved entitlement sets that the
// provisioning layer would derive from a commercial plan.
// ---------------------------------------------------------------------------

export interface TierFixture {
  readonly betaFlags: readonly BetaFlagContract[];
  readonly entitlements: readonly EntitlementContract[];
  readonly featureFlags: readonly FeatureFlagContract[];
  readonly killSwitches: readonly KillSwitchContract[];
  readonly localizations: readonly LocalizationContract[];
  readonly tierId: string;
  readonly usageLimits: readonly UsageLimitContract[];
}

// ---------------------------------------------------------------------------
// Basic tier — accounting only, limited users, no AI, no beta
// ---------------------------------------------------------------------------

export const basicTierFixture: TierFixture = {
  tierId: "basic",
  entitlements: [
    {
      key: "module.accounting.enabled",
      type: "module",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_basic",
      companyId: null,
      environment: null,
      metadata: {},
    },
  ] as const satisfies readonly EntitlementContract[],
  featureFlags: [],
  betaFlags: [],
  killSwitches: [],
  localizations: [],
  usageLimits: [
    {
      key: "users.max",
      scope: "tenant",
      period: "instant",
      maximum: 10,
      used: 4,
      unit: "users",
    },
    {
      key: "companies.max",
      scope: "tenant",
      period: "instant",
      maximum: 1,
      used: 1,
      unit: "companies",
    },
    {
      key: "organizations.max",
      scope: "tenant",
      period: "instant",
      maximum: 3,
      used: 1,
      unit: "organizations",
    },
    {
      key: "api.calls.daily",
      scope: "tenant",
      period: "daily",
      maximum: 500,
      used: 42,
      unit: "requests",
    },
    {
      key: "storage.gb.max",
      scope: "tenant",
      period: "instant",
      maximum: 5,
      used: 1,
      unit: "gb",
    },
    {
      key: "ai.tokens.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 0,
      used: 0,
      unit: "tokens",
    },
    {
      key: "einvoice.volume.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 0,
      used: 0,
      unit: "documents",
    },
    {
      key: "automation.runs.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 0,
      used: 0,
      unit: "runs",
    },
  ] as const satisfies readonly UsageLimitContract[],
};

// ---------------------------------------------------------------------------
// Pro tier — accounting + MRP + e-Invoice + localization (VN), AI limited
// ---------------------------------------------------------------------------

export const proTierFixture: TierFixture = {
  tierId: "pro",
  entitlements: [
    {
      key: "module.accounting.enabled",
      type: "module",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_pro",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "module.mrp.enabled",
      type: "module",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_pro",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "feature.e_invoice.enabled",
      type: "feature",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_pro",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "feature.lot_tracking.enabled",
      type: "feature",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_pro",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "localization.vn.enabled",
      type: "localization",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_pro",
      companyId: null,
      environment: null,
      metadata: {},
    },
  ] as const satisfies readonly EntitlementContract[],
  featureFlags: [
    {
      key: "e_invoice",
      enabled: true,
      rollout: "on",
      environments: ["production", "staging"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "feature.e_invoice.kill_switch",
      metadata: {},
    },
    {
      key: "lot_tracking",
      enabled: true,
      rollout: "on",
      environments: ["production", "staging"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "feature.lot_tracking.kill_switch",
      metadata: {},
    },
  ] as const satisfies readonly FeatureFlagContract[],
  betaFlags: [],
  killSwitches: [
    {
      key: "feature.e_invoice.kill_switch",
      active: false,
      severity: "critical",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
    {
      key: "feature.lot_tracking.kill_switch",
      active: false,
      severity: "standard",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
  ] as const satisfies readonly KillSwitchContract[],
  localizations: [
    {
      key: "vn",
      countryCode: "VN",
      enabled: true,
      requiredEntitlement: "localization.vn.enabled",
      jurisdictionName: "Vietnam",
    },
  ] as const satisfies readonly LocalizationContract[],
  usageLimits: [
    {
      key: "users.max",
      scope: "tenant",
      period: "instant",
      maximum: 50,
      used: 18,
      unit: "users",
    },
    {
      key: "companies.max",
      scope: "tenant",
      period: "instant",
      maximum: 5,
      used: 2,
      unit: "companies",
    },
    {
      key: "organizations.max",
      scope: "tenant",
      period: "instant",
      maximum: 20,
      used: 7,
      unit: "organizations",
    },
    {
      key: "api.calls.daily",
      scope: "tenant",
      period: "daily",
      maximum: 5000,
      used: 312,
      unit: "requests",
    },
    {
      key: "storage.gb.max",
      scope: "tenant",
      period: "instant",
      maximum: 50,
      used: 12,
      unit: "gb",
    },
    {
      key: "ai.tokens.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 100_000,
      used: 8200,
      unit: "tokens",
    },
    {
      key: "einvoice.volume.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 500,
      used: 120,
      unit: "documents",
    },
    {
      key: "automation.runs.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 200,
      used: 45,
      unit: "runs",
    },
  ] as const satisfies readonly UsageLimitContract[],
};

// ---------------------------------------------------------------------------
// Enterprise tier — all modules, AI, SSO, self-hosted, audit export, MY/VN
// ---------------------------------------------------------------------------

export const enterpriseTierFixture: TierFixture = {
  tierId: "enterprise",
  entitlements: [
    {
      key: "module.accounting.enabled",
      type: "module",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "module.mrp.enabled",
      type: "module",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "module.ai_copilot.enabled",
      type: "module",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "feature.e_invoice.enabled",
      type: "feature",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "feature.lot_tracking.enabled",
      type: "feature",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "feature.forecasting.enabled",
      type: "feature",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "feature.audit_export.enabled",
      type: "feature",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "localization.vn.enabled",
      type: "localization",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "localization.my.enabled",
      type: "localization",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "deployment.self_hosted.enabled",
      type: "deployment",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "deployment.managed_cloud.enabled",
      type: "deployment",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "support.sla_24_7.enabled",
      type: "support",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
    {
      key: "security.sso.enabled",
      type: "security",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_enterprise",
      companyId: null,
      environment: null,
      metadata: {},
    },
  ] as const satisfies readonly EntitlementContract[],
  featureFlags: [
    {
      key: "e_invoice",
      enabled: true,
      rollout: "on",
      environments: ["production", "staging", "preview"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "feature.e_invoice.kill_switch",
      metadata: {},
    },
    {
      key: "lot_tracking",
      enabled: true,
      rollout: "on",
      environments: ["production", "staging", "preview"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "feature.lot_tracking.kill_switch",
      metadata: {},
    },
    {
      key: "forecasting",
      enabled: true,
      rollout: "on",
      environments: ["production", "staging"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "feature.forecasting.kill_switch",
      metadata: {},
    },
    {
      key: "audit_export",
      enabled: true,
      rollout: "on",
      environments: ["production", "staging"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "feature.audit_export.kill_switch",
      metadata: {},
    },
    {
      key: "sso",
      enabled: true,
      rollout: "on",
      environments: ["production"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "security.sso.kill_switch",
      metadata: {},
    },
    {
      key: "new_ai_copilot",
      enabled: true,
      rollout: "on",
      environments: ["production", "staging"],
      tenantAllowlist: [],
      companyAllowlist: [],
      killSwitchKey: "module.ai_copilot.kill_switch",
      metadata: {},
    },
  ] as const satisfies readonly FeatureFlagContract[],
  betaFlags: [],
  killSwitches: [
    {
      key: "feature.e_invoice.kill_switch",
      active: false,
      severity: "critical",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
    {
      key: "feature.lot_tracking.kill_switch",
      active: false,
      severity: "standard",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
    {
      key: "feature.forecasting.kill_switch",
      active: false,
      severity: "standard",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
    {
      key: "feature.audit_export.kill_switch",
      active: false,
      severity: "standard",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
    {
      key: "security.sso.kill_switch",
      active: false,
      severity: "urgent",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
    {
      key: "module.ai_copilot.kill_switch",
      active: false,
      severity: "urgent",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
  ] as const satisfies readonly KillSwitchContract[],
  localizations: [
    {
      key: "vn",
      countryCode: "VN",
      enabled: true,
      requiredEntitlement: "localization.vn.enabled",
      jurisdictionName: "Vietnam",
    },
    {
      key: "my",
      countryCode: "MY",
      enabled: true,
      requiredEntitlement: "localization.my.enabled",
      jurisdictionName: "Malaysia",
    },
  ] as const satisfies readonly LocalizationContract[],
  usageLimits: [
    {
      key: "users.max",
      scope: "tenant",
      period: "instant",
      maximum: 500,
      used: 87,
      unit: "users",
    },
    {
      key: "companies.max",
      scope: "tenant",
      period: "instant",
      maximum: 50,
      used: 12,
      unit: "companies",
    },
    {
      key: "organizations.max",
      scope: "tenant",
      period: "instant",
      maximum: 200,
      used: 43,
      unit: "organizations",
    },
    {
      key: "api.calls.daily",
      scope: "tenant",
      period: "daily",
      maximum: 100_000,
      used: 4821,
      unit: "requests",
    },
    {
      key: "storage.gb.max",
      scope: "tenant",
      period: "instant",
      maximum: 1000,
      used: 234,
      unit: "gb",
    },
    {
      key: "ai.tokens.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 10_000_000,
      used: 382_000,
      unit: "tokens",
    },
    {
      key: "einvoice.volume.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 50_000,
      used: 4200,
      unit: "documents",
    },
    {
      key: "automation.runs.monthly",
      scope: "tenant",
      period: "monthly",
      maximum: 10_000,
      used: 2100,
      unit: "runs",
    },
  ] as const satisfies readonly UsageLimitContract[],
};

// ---------------------------------------------------------------------------
// Beta tier — enterprise entitlements + AI recommendations beta access
// ---------------------------------------------------------------------------

export const betaTierFixture: TierFixture = {
  tierId: "beta",
  entitlements: [
    ...enterpriseTierFixture.entitlements,
    {
      key: "beta.ai_recommendations.enabled",
      type: "beta",
      enabled: true,
      scope: "tenant",
      tenantId: "tenant_beta",
      companyId: null,
      environment: null,
      metadata: {},
    },
  ] as const satisfies readonly EntitlementContract[],
  featureFlags: [
    ...enterpriseTierFixture.featureFlags,
    {
      key: "ai_recommendations",
      enabled: true,
      rollout: "beta",
      environments: ["production", "staging"],
      tenantAllowlist: ["tenant_beta"],
      companyAllowlist: [],
      killSwitchKey: "beta.ai_recommendations.kill_switch",
      metadata: {},
    },
  ] as const satisfies readonly FeatureFlagContract[],
  betaFlags: [
    {
      key: "ai_recommendations",
      enabled: true,
      tenantAllowlist: ["tenant_beta"],
      companyAllowlist: [],
      startsAt: null,
      endsAt: null,
      metadata: {},
    },
  ] as const satisfies readonly BetaFlagContract[],
  killSwitches: [
    ...enterpriseTierFixture.killSwitches,
    {
      key: "beta.ai_recommendations.kill_switch",
      active: false,
      severity: "urgent",
      reason: "",
      activatedBy: null,
      activatedAt: null,
    },
  ] as const satisfies readonly KillSwitchContract[],
  localizations: enterpriseTierFixture.localizations,
  usageLimits: enterpriseTierFixture.usageLimits,
};

// ---------------------------------------------------------------------------
// Disabled-state fixture — all entitlements absent, kill switches armed
// ---------------------------------------------------------------------------

export const disabledStateFixture: TierFixture = {
  tierId: "disabled",
  entitlements: [],
  featureFlags: [],
  betaFlags: [],
  killSwitches: [
    {
      key: "module.accounting.kill_switch",
      active: true,
      severity: "critical",
      reason: "Incident INC-9001 — service suspended",
      activatedBy: "ops-team",
      activatedAt: "2026-06-20T00:00:00.000Z",
    },
    {
      key: "module.ai_copilot.kill_switch",
      active: true,
      severity: "critical",
      reason: "Incident INC-9002 — model degradation",
      activatedBy: "platform-eng",
      activatedAt: "2026-06-20T01:00:00.000Z",
    },
  ] as const satisfies readonly KillSwitchContract[],
  localizations: [],
  usageLimits: [],
};

// ---------------------------------------------------------------------------
// Shared context builders — produce EntitlementContextContract per tier
// ---------------------------------------------------------------------------

export function buildContext(
  tenantId: string,
  companyId: string,
  feature: string,
  overrides?: Partial<EntitlementContextContract>
): EntitlementContextContract {
  return {
    tenantId,
    companyId,
    organizationId: `org_${tenantId}`,
    environment: "production",
    module: "accounting",
    feature,
    userCount: 1,
    usageMetrics: {},
    localization: "vn",
    betaFlags: [],
    ...overrides,
  };
}
