/**
 * Default platform rollout catalog — synced into `platform_feature_flags`
 * and `platform_kill_switches` at bootstrap.
 */
import type {
  PlatformFeatureFlagCatalogEntry,
  PlatformKillSwitchCatalogEntry,
} from "../entitlement/rollout.contract.js";

export const PLATFORM_FEATURE_FLAG_CATALOG = [
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
] as const satisfies readonly PlatformFeatureFlagCatalogEntry[];

export const PLATFORM_KILL_SWITCH_CATALOG = [
  {
    key: "feature.e_invoice.kill_switch",
    active: false,
    severity: "critical",
    reason: "",
  },
  {
    key: "feature.lot_tracking.kill_switch",
    active: false,
    severity: "standard",
    reason: "",
  },
  {
    key: "feature.forecasting.kill_switch",
    active: false,
    severity: "standard",
    reason: "",
  },
  {
    key: "feature.audit_export.kill_switch",
    active: false,
    severity: "standard",
    reason: "",
  },
  {
    key: "security.sso.kill_switch",
    active: false,
    severity: "urgent",
    reason: "",
  },
  {
    key: "module.ai_copilot.kill_switch",
    active: false,
    severity: "urgent",
    reason: "",
  },
  {
    key: "beta.ai_recommendations.kill_switch",
    active: false,
    severity: "urgent",
    reason: "",
  },
  {
    key: "module.accounting.kill_switch",
    active: false,
    severity: "critical",
    reason: "",
  },
] as const satisfies readonly PlatformKillSwitchCatalogEntry[];
