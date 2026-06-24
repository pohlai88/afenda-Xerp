// biome-ignore-all lint/performance/noBarrelFile: package root is the curated public API surface.

export const PACKAGE_NAME = "@afenda/accounting" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export { toAccountingDomainContext } from "./bridge/to-accounting-domain-context.js";
export {
  ACCOUNT_TYPES,
  type AccountType,
  isAccountType,
} from "./contracts/account-type.contract.js";
export {
  ACCOUNTING_AUDIT_ACTIONS,
  type AccountingAuditAction,
  isAccountingAuditAction,
  parseAccountingAuditAction,
} from "./contracts/accounting-audit-actions.contract.js";
export {
  ACCOUNTING_AUTHORITY_ADR,
  ACCOUNTING_AUTHORITY_FINGERPRINT,
  ACCOUNTING_PACKAGE_LIFECYCLE,
  ACCOUNTING_PACKAGE_LIFECYCLE_PHASES,
  ACCOUNTING_REGISTRY_ID,
  type AccountingPackageLifecyclePhase,
  isAccountingPackageLifecyclePhase,
} from "./contracts/accounting-authority.contract.js";
export type {
  AccountingDomainWireContext,
  assertAccountingDomainWireContextJsonSerializable,
} from "./contracts/accounting-domain-wire-context.contract.js";
export {
  type AccountId,
  type FiscalPeriodId,
  type JournalEntryId,
  type LedgerAccountCode,
  toAccountId,
  toFiscalPeriodId,
  toJournalEntryId,
  toLedgerAccountCode,
} from "./contracts/accounting-id.contract.js";
export {
  ACCOUNTING_PERMISSION_ACTIONS,
  ACCOUNTING_PERMISSION_DOMAINS,
  ACCOUNTING_PERMISSION_KEY_VOCABULARY,
  type AccountingPermissionAction,
  type AccountingPermissionDomain,
  type AccountingPermissionKey,
  toAccountingPermissionKey,
} from "./contracts/accounting-permission-vocabulary.contract.js";
export {
  FISCAL_PERIOD_STATES,
  type FiscalPeriodState,
  isFiscalPeriodState,
} from "./contracts/fiscal-period-state.contract.js";
export {
  isJournalDocumentType,
  JOURNAL_DOCUMENT_TYPES,
  type JournalDocumentType,
} from "./contracts/journal-document-type.contract.js";
export {
  isPostingStatus,
  POSTING_STATUSES,
  type PostingStatus,
} from "./contracts/posting-status.contract.js";
