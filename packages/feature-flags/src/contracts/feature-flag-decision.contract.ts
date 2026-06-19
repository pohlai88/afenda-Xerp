import type {
  FeatureFlagContract,
  FeatureFlagKey,
} from "./feature-flag.contract";

/** All reasons a feature-flag evaluation can be denied. */
export type FlagDenialReason =
  | "company_excluded"
  | "environment_excluded"
  | "flag_disabled"
  | "kill_switch_active"
  | "not_found"
  | "rollout_off"
  | "tenant_excluded";

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

/** Discriminated union result of a single feature-flag gate evaluation. */
export type FlagDecision = FlagAllowed | FlagDenied;
