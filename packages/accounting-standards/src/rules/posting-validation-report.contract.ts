import type { ResolvedAuthorityEdition } from "../policy/transaction-date-edition-resolution.policy.js";
import type { JurisdictionCode } from "../routing/jurisdiction-profile.contract.js";
import type {
  AccountingStandardValidationResult,
  ScopeGateStatus,
  ValidationResultStatus,
} from "./posting-validation-result.contract.js";

export interface AccountingStandardValidationReport {
  readonly aggregateStatus: ValidationResultStatus;
  readonly fingerprint: string;
  readonly judgmentEscalationRequired: boolean;
  readonly jurisdictionCode: JurisdictionCode | null;
  readonly precedenceConflictDetected: boolean;
  readonly resolvedAuthorityEditions: readonly ResolvedAuthorityEdition[];
  readonly results: readonly AccountingStandardValidationResult[];
  readonly routedStandardKeys: readonly string[];
  readonly scopeGateStatus: ScopeGateStatus;
  readonly transactionDate: string | null;
}
