export const FOUNDATION_LANES = [
  "red-lane",
  "amber-lane",
  "green-lane",
  "blue-lane",
  "lab-lane",
  "black-lane",
  "archive-lane",
] as const;

export type FoundationLane = (typeof FOUNDATION_LANES)[number];

export interface FoundationDispositionEntry {
  readonly allowedAgents: readonly string[];
  readonly authority: string;
  readonly domain: string;
  readonly evidence: readonly string[];
  readonly gates: readonly string[];
  readonly id: string;
  /** @deprecated Always []. Gap tracking lives in PAS slice handoffs until field removal ADR. */
  readonly knownGaps: readonly string[];
  readonly lane: FoundationLane;
  readonly legacyTipEvidence: readonly string[];
  readonly packageId: string;
  readonly packageName: string;
  readonly prohibited: readonly string[];
  readonly requiredBeforeAccounting: boolean;
  readonly runtimeOwner: string;
}

export interface FoundationDispositionRegistry {
  readonly entries: readonly FoundationDispositionEntry[];
  readonly fingerprint: string;
}

export function isFoundationLane(value: string): value is FoundationLane {
  return (FOUNDATION_LANES as readonly string[]).includes(value);
}
