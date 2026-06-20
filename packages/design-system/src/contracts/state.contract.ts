import type { StatusTone } from "./token.contract";

export const GOVERNED_STATES = [
  "loading",
  "empty",
  "error",
  "forbidden",
  "invalid",
  "ready",
] as const;

export const stateContract = {
  acceptanceRules: [
    "Every UI state must use an approved governed state name",
    "Every state pattern must map to an approved status tone",
    "State contracts must define UI meaning only and must not fetch data or decide permissions",
  ],
  aiGenerationRules: {
    forbidden: [
      "Invent UI state names",
      "Use state names to create business workflow status",
      "Bypass status tones or accessibility announcement rules",
    ],
    allowed: [
      "Select approved UI states",
      "Map states to approved status tones",
      "Use state patterns to render loading, empty, error, forbidden, invalid, and ready surfaces",
    ],
  },
  allowedResponsibility: [
    "Define UI state meaning",
    "Define state tone mapping",
    "Define state copy and announcement roles",
  ],
  contractId: "afenda.design-system.state",
  downstreamConsumers: [
    "component.contract.ts",
    "accessibility.contract.ts",
    "example.contract.ts",
    "AppShell",
    "Metadata UI",
  ],
  ownedResponsibility: "UI state",
  owner: "TIP-004 state contract",
  prohibitedResponsibility: [
    "Define domain workflow state",
    "Define permission decisions",
    "Define data fetching",
    "Define raw design values",
  ],
  purpose: "Own user-interface state meaning for governed Afenda surfaces.",
  version: "0.1.0",
} as const;

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
