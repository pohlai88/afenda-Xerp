/**
 * PAS-006C P06-005 — Acceptance Record wire contract (NS §8.2).
 */

import {
  type BlockLifecycleState,
  isBlockLifecycleState,
} from "./block-lifecycle.contract.js";
import {
  isBoolean,
  isNonEmptyString,
  isStringMemberOf,
  isWireRecord,
} from "./wire-guard.helpers.js";

export type AcceptanceCriterionResult = "pass" | "fail";

export const ACCEPTANCE_CRITERION_RESULTS = [
  "pass",
  "fail",
] as const satisfies readonly AcceptanceCriterionResult[];

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

export function isAcceptanceCriterionResult(
  value: unknown
): value is AcceptanceCriterionResult {
  return isStringMemberOf(value, ACCEPTANCE_CRITERION_RESULTS);
}

export function isSealEligibleLifecycleState(
  state: BlockLifecycleState
): state is SealEligibleLifecycleState {
  return (
    SEAL_ELIGIBLE_LIFECYCLE_STATES as readonly BlockLifecycleState[]
  ).includes(state);
}

function isCriteriaResultsRecord(
  value: unknown
): value is Readonly<Record<string, AcceptanceCriterionResult>> {
  if (!isWireRecord(value)) {
    return false;
  }

  return Object.values(value).every(isAcceptanceCriterionResult);
}

export function isAcceptanceRecordWire(
  value: unknown
): value is AcceptanceRecordWire {
  if (!isWireRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value["acceptanceRecordId"]) &&
    isNonEmptyString(value["blockId"]) &&
    isBlockLifecycleState(value["lifecycleStateAtSeal"]) &&
    typeof value["presentationLabProof"] === "string" &&
    isNonEmptyString(value["acpaProfileVersion"]) &&
    isNonEmptyString(value["sealedAt"]) &&
    isNonEmptyString(value["sealedBy"]) &&
    isBoolean(value["wcagAaAuthAdjacent"]) &&
    isCriteriaResultsRecord(value["criteriaResults"])
  );
}

export function assertAcceptanceRecordWire(
  value: unknown
): asserts value is AcceptanceRecordWire {
  if (!isAcceptanceRecordWire(value)) {
    throw new Error("Invalid acceptance record wire payload.");
  }
}
