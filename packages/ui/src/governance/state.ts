import { GOVERNED_STATES, type GovernedState } from "./design-system";
import { enforceGovernanceOr } from "./dev-env";

const governedStateSet = new Set<string>(GOVERNED_STATES);

function formatGovernedStateViolation(state: string): string {
  return `Governed UI state policy violation. Unsupported governed state "${state}". Allowed states: ${GOVERNED_STATES.join(
    ", "
  )}. UI components must use design-system governed states only; domain workflow states must be mapped before reaching @afenda/ui.`;
}

function formatGovernedStateContractViolation(
  states: readonly string[]
): string {
  return `Governed UI state contract violation. Unsupported governed states: ${states.join(
    ", "
  )}. Allowed states: ${GOVERNED_STATES.join(
    ", "
  )}. Domain workflow states must be mapped before reaching @afenda/ui.`;
}

export function getGovernedStates(): readonly GovernedState[] {
  return GOVERNED_STATES;
}

export function isGovernedState(state: string): state is GovernedState {
  return governedStateSet.has(state);
}

export function assertGovernedState(
  state: string
): asserts state is GovernedState {
  if (!isGovernedState(state)) {
    throw new Error(formatGovernedStateViolation(state));
  }
}

export function resolveGovernedState(
  state: string | undefined,
  fallback: GovernedState = "ready"
): GovernedState {
  if (!state) {
    return fallback;
  }

  if (!isGovernedState(state)) {
    return enforceGovernanceOr(formatGovernedStateViolation(state), fallback);
  }

  return state;
}

export function getUnknownGovernedStates(
  states: readonly string[]
): readonly string[] {
  return states.filter((state) => !isGovernedState(state));
}

export function assertGovernedStates(states: readonly string[]): void {
  const unknownStates = getUnknownGovernedStates(states);

  if (unknownStates.length > 0) {
    throw new Error(formatGovernedStateContractViolation(unknownStates));
  }
}
