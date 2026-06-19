import {
  type DeploymentEnvironment,
  type FeatureFlagContract,
  type FeatureFlagKey,
  type KillSwitchContract,
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

// ---------------------------------------------------------------------------
// Evaluation context
// ---------------------------------------------------------------------------

export interface FlagEvaluationContext {
  readonly companyId: string;
  readonly environment: DeploymentEnvironment;
  readonly tenantId: string;
}

// ---------------------------------------------------------------------------
// Typed denied reason — distinct from entitlement denial codes
// ---------------------------------------------------------------------------

export type FlagDenialReason =
  | "flag_disabled"
  | "kill_switch_active"
  | "not_found"
  | "environment_excluded"
  | "tenant_excluded"
  | "company_excluded"
  | "rollout_off";

export interface FlagAllowed {
  readonly allowed: true;
  readonly flag: FeatureFlagContract;
  readonly key: FeatureFlagKey;
}

export interface FlagDenied {
  readonly allowed: false;
  readonly key: FeatureFlagKey;
  readonly reason: FlagDenialReason;
}

export type FlagDecision = FlagAllowed | FlagDenied;

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

export function isEnabled(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FlagEvaluationContext
): boolean {
  return resolveFeatureFlag(key, flags, context).enabled;
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
