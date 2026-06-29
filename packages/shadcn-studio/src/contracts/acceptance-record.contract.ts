/**
 * PAS-006C P06-005 — Acceptance Record wire contract (NS §8.2).
 */

import type { BlockLifecycleState } from "../registry/block-lifecycle.js";

export type AcceptanceCriterionResult = "pass" | "fail";

export interface AcceptanceRecordWire {
  readonly acceptanceRecordId: string;
  readonly acpaProfileVersion: string;
  readonly blockId: string;
  readonly criteriaResults: Readonly<Record<string, AcceptanceCriterionResult>>;
  readonly lifecycleStateAtSeal: BlockLifecycleState;
  readonly presentationLabProof: string;
  readonly sealedAt: string;
  readonly sealedBy: string;
  readonly wcagAaAuthAdjacent: boolean;
}

const SEAL_ELIGIBLE_LIFECYCLE_STATES = [
  "metadata-bound",
  "accepted",
  "production-wired",
  "customized",
  "deprecated",
  "retired",
] as const satisfies readonly BlockLifecycleState[];

export type SealEligibleLifecycleState =
  (typeof SEAL_ELIGIBLE_LIFECYCLE_STATES)[number];

export function isSealEligibleLifecycleState(
  state: BlockLifecycleState
): state is SealEligibleLifecycleState {
  return (
    SEAL_ELIGIBLE_LIFECYCLE_STATES as readonly BlockLifecycleState[]
  ).includes(state);
}

export function isAcceptanceRecordWire(
  value: unknown
): value is AcceptanceRecordWire {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record["acceptanceRecordId"] === "string" &&
    typeof record["blockId"] === "string" &&
    typeof record["lifecycleStateAtSeal"] === "string" &&
    typeof record["presentationLabProof"] === "string" &&
    typeof record["acpaProfileVersion"] === "string" &&
    typeof record["sealedAt"] === "string" &&
    typeof record["sealedBy"] === "string" &&
    typeof record["wcagAaAuthAdjacent"] === "boolean" &&
    typeof record["criteriaResults"] === "object" &&
    record["criteriaResults"] !== null
  );
}
