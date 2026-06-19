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
  readonly tone:
    | "neutral"
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "forbidden"
    | "invalid";
}

export interface StateContract {
  readonly states: readonly StatePattern[];
}
