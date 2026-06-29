/**
 * PAS-006C P06-005 — Acceptance Record seal validation.
 */

import {
  type AcceptanceRecordWire,
  isSealEligibleLifecycleState,
} from "./acceptance-record.contract.js";

export type AcceptanceRecordSealFailure =
  | { readonly ok: false; readonly code: "lifecycle-not-eligible" }
  | { readonly ok: false; readonly code: "criteria-not-all-pass" }
  | { readonly ok: false; readonly code: "missing-lab-proof" };

export type AcceptanceRecordSealSuccess = {
  readonly ok: true;
  readonly record: AcceptanceRecordWire;
};

export type AcceptanceRecordSealResult =
  | AcceptanceRecordSealSuccess
  | AcceptanceRecordSealFailure;

export function validateAcceptanceRecordSeal(
  record: AcceptanceRecordWire
): AcceptanceRecordSealResult {
  if (record.presentationLabProof.trim().length === 0) {
    return { ok: false, code: "missing-lab-proof" };
  }

  if (!isSealEligibleLifecycleState(record.lifecycleStateAtSeal)) {
    return { ok: false, code: "lifecycle-not-eligible" };
  }

  const criteriaValues = Object.values(record.criteriaResults);
  if (
    criteriaValues.length === 0 ||
    criteriaValues.some((result) => result !== "pass")
  ) {
    return { ok: false, code: "criteria-not-all-pass" };
  }

  return { ok: true, record };
}
