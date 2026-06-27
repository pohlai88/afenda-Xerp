import type { AccountingReadinessGateLiveSnapshot } from "./accounting-readiness-gate-live-status.contract.js";

import type { AccountingReadinessGateRequirementStatus } from "./resolve-accounting-readiness-gate-status.server";

/** ERP diagnostics presentation — never implies Architecture Authority Phase 9 approval. */
export type AccountingReadinessDiagnosticsOverallKind =
  | "automated-fail"
  | "automated-pass"
  | "evidence-fail"
  | "evidence-pass";

export const ACCOUNTING_READINESS_PHASE_9_APPROVAL_STATUS =
  "architecture-authority-signed-off-2026-06-24" as const;

export type AccountingReadinessPhase9ApprovalStatus =
  typeof ACCOUNTING_READINESS_PHASE_9_APPROVAL_STATUS;

export function resolveAccountingReadinessDiagnosticsOverall(input: {
  readonly requirements: readonly AccountingReadinessGateRequirementStatus[];
  readonly snapshot: AccountingReadinessGateLiveSnapshot;
}): AccountingReadinessDiagnosticsOverallKind {
  const hasFailure = input.requirements.some(
    (requirement) => requirement.liveKind === "fail"
  );

  if (input.snapshot.runMode === "structure-only") {
    return hasFailure ? "evidence-fail" : "evidence-pass";
  }

  if (hasFailure || input.snapshot.overallKind === "fail") {
    return "automated-fail";
  }

  return "automated-pass";
}
