import { GOVERNED_STATES } from "../contracts/state.contract";
import { STATUS_TONES } from "../contracts/token.contract";
import { AFENDA_STATE_REGISTRY } from "../registries/state.registry";
import type { ValidationResult } from "./index";

export function validateStateRegistry(): ValidationResult[] {
  const results: ValidationResult[] = [];
  const governedStates = new Set<string>(GOVERNED_STATES);
  const governedTones = new Set<string>(STATUS_TONES);
  const coveredStates = new Set<string>();

  for (const pattern of AFENDA_STATE_REGISTRY.states) {
    coveredStates.add(pattern.state);

    results.push({
      rule: `state.${pattern.state}.is-governed`,
      passed: governedStates.has(pattern.state),
      detail: governedStates.has(pattern.state)
        ? undefined
        : `State "${pattern.state}" is not a governed state name`,
    });

    results.push({
      rule: `state.${pattern.state}.tone.is-governed`,
      passed: governedTones.has(pattern.tone),
      detail: governedTones.has(pattern.tone)
        ? undefined
        : `State "${pattern.state}" uses ungoverned tone "${pattern.tone}"`,
    });

    results.push({
      rule: `state.${pattern.state}.has-ariaLive`,
      passed: ["off", "polite", "assertive"].includes(pattern.ariaLive),
      detail: ["off", "polite", "assertive"].includes(pattern.ariaLive)
        ? undefined
        : `State "${pattern.state}" has invalid ariaLive "${pattern.ariaLive}"`,
    });
  }

  // Every governed state must be covered
  for (const state of GOVERNED_STATES) {
    results.push({
      rule: `state.${state}.has-pattern`,
      passed: coveredStates.has(state),
      detail: coveredStates.has(state)
        ? undefined
        : `Governed state "${state}" has no pattern in AFENDA_STATE_REGISTRY`,
    });
  }

  return results;
}
