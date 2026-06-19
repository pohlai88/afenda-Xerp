import type { StatusTone } from "./token.contract";

export const GOVERNED_STATES = [
  "loading",
  "empty",
  "error",
  "forbidden",
  "invalid",
  "ready",
] as const;

export type GovernedState = (typeof GOVERNED_STATES)[number];

export interface StatePattern {
  readonly ariaLive: "off" | "polite" | "assertive";
  readonly requiredCopyRole: "label" | "description" | "error";
  readonly state: GovernedState;
  /** Must be a governed status tone — sourced from token.contract to prevent drift. */
  readonly tone: StatusTone;
}

export interface StateContract {
  readonly states: readonly StatePattern[];
}
