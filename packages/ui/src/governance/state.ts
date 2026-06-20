import { GOVERNED_STATES, type GovernedState } from "./design-system";

const governedStateSet = new Set<string>(GOVERNED_STATES);

function formatGovernedStateViolation(state: string): string {
  return `TIP-004 state policy violation. Unsupported governed state "${state}". Allowed states: ${GOVERNED_STATES.join(
    ", "
  )}. UI components must use design-system governed states only; domain workflow states must be mapped before reaching @afenda/ui.`;
}

export function assertGovernedState(
  state: string
): asserts state is GovernedState {
  if (!governedStateSet.has(state)) {
    throw new Error(formatGovernedStateViolation(state));
  }
}

export function isGovernedState(state: string): state is GovernedState {
  return governedStateSet.has(state);
}

export function resolveGovernedState(
  state: string | undefined,
  fallback: GovernedState = "ready"
): GovernedState {
  if (!state) {
    return fallback;
  }

  assertGovernedState(state);
  return state;
}
