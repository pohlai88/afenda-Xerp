import type { StateContract, StatePattern } from "../contracts/state.contract";
import { GOVERNED_STATES, type GovernedState } from "../contracts/state.contract";

const statePatterns: readonly StatePattern[] = [
  {
    state: "loading",
    tone: "info",
    ariaLive: "polite",
    requiredCopyRole: "description",
  },
  {
    state: "empty",
    tone: "neutral",
    ariaLive: "off",
    requiredCopyRole: "description",
  },
  {
    state: "error",
    tone: "danger",
    ariaLive: "assertive",
    requiredCopyRole: "error",
  },
  {
    state: "forbidden",
    tone: "forbidden",
    ariaLive: "assertive",
    requiredCopyRole: "error",
  },
  {
    state: "invalid",
    tone: "invalid",
    ariaLive: "polite",
    requiredCopyRole: "error",
  },
  {
    state: "ready",
    tone: "success",
    ariaLive: "off",
    requiredCopyRole: "label",
  },
] as const satisfies readonly StatePattern[];

export const AFENDA_STATE_REGISTRY = {
  states: statePatterns,
} as const satisfies StateContract;

/** All governed UI state names. */
export const AFENDA_STATE_NAMES = GOVERNED_STATES satisfies readonly GovernedState[];
