/**
 * @afenda.l1-contract-envelope acceptance-record
 * Role: validateAcceptanceRecordSeal() eligibility + criteria checks
 * Family: acceptance-record · flat L1 validator
 * Relies on: acceptance-record.contract
 * Relied on by: index barrel, gate/acceptance-record.contract.test
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
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
