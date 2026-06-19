import {
  type FeatureFlagResolution,
  resolveFeatureFlagStrict as resolveEntitlementFeatureFlagStrict,
  resolveFeatureFlag,
  resolveKillSwitch,
} from "@afenda/entitlements";

// ---------------------------------------------------------------------------
// Re-export shared types so callers only need this package
// ---------------------------------------------------------------------------

export type {
  DeploymentEnvironment,
  FeatureFlagContract,
  FeatureFlagKey,
  FeatureFlagResolution,
  KillSwitchContract,
  KillSwitchResolution,
} from "@afenda/entitlements";

// Re-export typed contracts from the contracts layer
export type { FeatureFlagAuditContract } from "./contracts/feature-flag-audit.contract";
export type { FeatureFlagContext } from "./contracts/feature-flag-context.contract";
export type {
  FlagAllowed,
  FlagDecision,
  FlagDenialReason,
  FlagDenied,
} from "./contracts/feature-flag-decision.contract";

// ---------------------------------------------------------------------------
// Evaluation context (backward-compat alias for FeatureFlagContext)
// ---------------------------------------------------------------------------

export type { FeatureFlagContext as FlagEvaluationContext } from "./contracts/feature-flag-context.contract";

import type {
  FeatureFlagContract,
  FeatureFlagKey,
} from "./contracts/feature-flag.contract";
import type { FeatureFlagContext as FlagEvaluationContext } from "./contracts/feature-flag-context.contract";
import type { FlagDecision } from "./contracts/feature-flag-decision.contract";
import type { KillSwitchContract } from "./contracts/kill-switch.contract";

// ---------------------------------------------------------------------------
// Detailed resolution — surfaces the denial reason for observability
// ---------------------------------------------------------------------------

export function evaluateFlag(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  killSwitches: readonly KillSwitchContract[],
  context: FlagEvaluationContext
): FlagDecision {
  const flag = flags.find((f) => f.key === key);

  if (!flag) {
    return { allowed: false, key, reason: "not_found" };
  }

  if (!flag.enabled) {
    return { allowed: false, key, reason: "flag_disabled" };
  }

  if (flag.rollout === "off") {
    return { allowed: false, key, reason: "rollout_off" };
  }

  if (flag.killSwitchKey) {
    const ks = resolveKillSwitch(flag.killSwitchKey, killSwitches);
    if (ks.active) {
      return { allowed: false, key, reason: "kill_switch_active" };
    }
  }

  if (!flag.environments.includes(context.environment)) {
    return { allowed: false, key, reason: "environment_excluded" };
  }

  if (
    flag.tenantAllowlist.length > 0 &&
    !flag.tenantAllowlist.includes(context.tenantId)
  ) {
    return { allowed: false, key, reason: "tenant_excluded" };
  }

  if (
    flag.companyAllowlist.length > 0 &&
    !flag.companyAllowlist.includes(context.companyId)
  ) {
    return { allowed: false, key, reason: "company_excluded" };
  }

  return { allowed: true, key, flag };
}

// ---------------------------------------------------------------------------
// Simple boolean shorthand — wraps the entitlements resolver directly
// ---------------------------------------------------------------------------

/** Fail-open boolean shorthand — missing flags return true (gradual rollout). */
export function isEnabled(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FlagEvaluationContext
): boolean {
  return resolveFeatureFlag(key, flags, context).enabled;
}

/** Fail-closed boolean shorthand — missing flags return false (security paths). */
export function isEnabledStrict(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FlagEvaluationContext
): boolean {
  return resolveEntitlementFeatureFlagStrict(key, flags, context).enabled;
}

export function resolveFeatureFlagStrict(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FlagEvaluationContext
): FeatureFlagResolution {
  return resolveEntitlementFeatureFlagStrict(key, flags, context);
}

// ---------------------------------------------------------------------------
// Bulk evaluation — useful for feature-flag hydration on request start
// ---------------------------------------------------------------------------

export function evaluateAll(
  flags: readonly FeatureFlagContract[],
  killSwitches: readonly KillSwitchContract[],
  context: FlagEvaluationContext
): Readonly<Record<FeatureFlagKey, FlagDecision>> {
  const result: Record<FeatureFlagKey, FlagDecision> = {};

  for (const flag of flags) {
    result[flag.key] = evaluateFlag(flag.key, flags, killSwitches, context);
  }

  return result;
}
