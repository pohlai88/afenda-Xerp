import type { AccountingStandardEvidenceSnapshot } from "../evidence/accounting-standard-evidence-snapshot.contract.js";
import type { AccountingStandardVersionRef } from "../standards/standard-version.contract.js";

export const VALIDATION_RESULT_STATUSES = [
  "pass",
  "info",
  "warning",
  "blocked",
] as const;

export type ValidationResultStatus =
  (typeof VALIDATION_RESULT_STATUSES)[number];

export const SCOPE_GATE_STATUSES = [
  "in_scope",
  "out_of_scope",
  "requires_review",
] as const;

export type ScopeGateStatus = (typeof SCOPE_GATE_STATUSES)[number];

export interface AccountingStandardValidationResult {
  readonly authorityRefs: readonly AccountingStandardVersionRef[];
  readonly escalationReasonKey?: string | null;
  readonly evidenceSnapshot: AccountingStandardEvidenceSnapshot | null;
  readonly judgmentEscalationRequired?: boolean;
  readonly message: string;
  readonly recommendedAction: string | null;
  readonly ruleId: string | null;
  readonly scopeGateStatus?: ScopeGateStatus;
  readonly standardCode: string | null;
  readonly status: ValidationResultStatus;
}
