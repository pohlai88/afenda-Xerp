import {
  type FeatureFlagContract,
  type FeatureFlagKey,
  resolveFeatureFlag,
} from "@afenda/entitlements";
import type { FeatureFlagContext } from "../contracts/feature-flag-context.contract";
import type { FlagDecision } from "../contracts/feature-flag-decision.contract";
import type { KillSwitchContract } from "../contracts/kill-switch.contract";
import { evaluateFlag as evaluateFlagInternal } from "../flag-evaluation";

// Re-export the existing evaluation helpers for consumers of this service.
export {
  evaluateAll,
  evaluateFlag,
  isEnabled,
  isEnabledStrict,
  resolveFeatureFlagStrict,
} from "../flag-evaluation";

/**
 * TIP-008 spec-required API: boolean shorthand for a single flag gate.
 *
 * Fail-open — missing flags return `true` to support gradual rollout.
 * For security-sensitive paths use `isEnabledStrict`.
 */
export function featureFlag(
  key: FeatureFlagKey,
  flags: readonly FeatureFlagContract[],
  context: FeatureFlagContext
): boolean {
  return resolveFeatureFlag(key, flags, context).enabled;
}

/** Input bundle for `evaluateFeatureFlag` — mirrors the evaluateCapability pattern. */
export interface EvaluateFlagInput {
  readonly context: FeatureFlagContext;
  readonly flags: readonly FeatureFlagContract[];
  readonly key: FeatureFlagKey;
  readonly killSwitches: readonly KillSwitchContract[];
}

/**
 * TIP-008 spec-required API: single-input capability-style evaluation for a feature flag.
 *
 * Returns a typed `FlagDecision` discriminated union. Use this when you need
 * structured denial reasons for observability or audit; use `featureFlag` for
 * simple boolean gates.
 */
export function evaluateFeatureFlag(input: EvaluateFlagInput): FlagDecision {
  return evaluateFlagInternal(
    input.key,
    input.flags,
    input.killSwitches,
    input.context
  );
}
