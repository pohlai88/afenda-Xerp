import type {
  AccountingStandardValidationResult,
  ScopeGateStatus,
  ValidationResultStatus,
} from "./posting-validation-result.contract.js";

export interface AccountingStandardValidationReport {
  readonly aggregateStatus: ValidationResultStatus;
  readonly fingerprint: string;
  readonly judgmentEscalationRequired: boolean;
  readonly results: readonly AccountingStandardValidationResult[];
  readonly routedStandardKeys: readonly string[];
  readonly scopeGateStatus: ScopeGateStatus;
}
