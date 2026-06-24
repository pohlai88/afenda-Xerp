import {
  type AccountingReadinessContext,
  type OperatingContext,
  toAccountingReadinessContext,
} from "@afenda/kernel";

/**
 * ERP trust boundary — maps resolved operating context to accounting-readiness
 * authority fields only. No journals, ledgers, or consolidation arithmetic.
 */
export function resolveAccountingReadinessContext(
  operatingContext: OperatingContext,
  options?: { readonly reportingDate?: string }
): AccountingReadinessContext {
  return toAccountingReadinessContext(operatingContext, options);
}
