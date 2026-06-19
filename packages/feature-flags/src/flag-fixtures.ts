import type {
  FeatureFlagContract,
  KillSwitchContract,
} from "@afenda/entitlements";

// ---------------------------------------------------------------------------
// Shared flag-fixture sets used in tests and local development.
// These represent the deployment-rollout state, not commercial access.
// ---------------------------------------------------------------------------

export const allFlagsEnabled: readonly FeatureFlagContract[] = [
  {
    key: "e_invoice",
    enabled: true,
    rollout: "on",
    environments: ["development", "preview", "staging", "production", "test"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "feature.e_invoice.kill_switch",
    metadata: {},
  },
  {
    key: "lot_tracking",
    enabled: true,
    rollout: "on",
    environments: ["development", "preview", "staging", "production", "test"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "feature.lot_tracking.kill_switch",
    metadata: {},
  },
  {
    key: "forecasting",
    enabled: true,
    rollout: "on",
    environments: ["development", "staging", "production", "test"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "feature.forecasting.kill_switch",
    metadata: {},
  },
  {
    key: "audit_export",
    enabled: true,
    rollout: "on",
    environments: ["staging", "production", "test"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "feature.audit_export.kill_switch",
    metadata: {},
  },
  {
    key: "sso",
    enabled: true,
    rollout: "on",
    environments: ["production", "test"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "security.sso.kill_switch",
    metadata: {},
  },
  {
    key: "new_ai_copilot",
    enabled: true,
    rollout: "on",
    environments: ["staging", "production", "test"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "module.ai_copilot.kill_switch",
    metadata: {},
  },
  {
    key: "ai_recommendations",
    enabled: true,
    rollout: "beta",
    environments: ["staging", "production", "test"],
    tenantAllowlist: [],
    companyAllowlist: [],
    killSwitchKey: "beta.ai_recommendations.kill_switch",
    metadata: {},
  },
] as const;

export const allFlagsDisabled: readonly FeatureFlagContract[] =
  allFlagsEnabled.map((f) => ({ ...f, enabled: false }));

export const allKillSwitchesInactive: readonly KillSwitchContract[] = [
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
  {
    key: "beta.ai_recommendations.kill_switch",
    active: false,
    severity: "urgent",
    reason: "",
    activatedBy: null,
    activatedAt: null,
  },
] as const;

export const criticalKillSwitchesActive: readonly KillSwitchContract[] =
  allKillSwitchesInactive.map((ks) =>
    ks.severity === "critical" ? { ...ks, active: true } : ks
  );
