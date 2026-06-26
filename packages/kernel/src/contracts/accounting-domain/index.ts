/**
 * ADR-0020 — accounting domain vocabulary (contracts-only until TIP-015+ runtime ADR).
 * Cross-domain accounting wire contracts live in kernel; no @afenda/accounting package.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed accounting-domain export surface.

export {
  ACCOUNT_TYPES,
  type AccountType,
  isAccountType,
} from "./account-type.contract.js";
export {
  ACCOUNTING_AUDIT_ACTIONS,
  type AccountingAuditAction,
  isAccountingAuditAction,
  parseAccountingAuditAction,
} from "./accounting-audit-actions.contract.js";
export {
  ACCOUNTING_AUTHORITY_ADR,
  ACCOUNTING_AUTHORITY_FINGERPRINT,
  ACCOUNTING_CONTRACTS_OWNER,
  ACCOUNTING_PACKAGE_LIFECYCLE,
  ACCOUNTING_PACKAGE_LIFECYCLE_PHASES,
  ACCOUNTING_REGISTRY_ID,
  type AccountingPackageLifecyclePhase,
  isAccountingPackageLifecyclePhase,
} from "./accounting-authority.contract.js";
export type {
  AccountingDomainWireContext,
  assertAccountingDomainWireContextJsonSerializable,
} from "./accounting-domain-wire-context.contract.js";
export {
  type AccountId,
  type FiscalPeriodId,
  type JournalEntryId,
  type LedgerAccountCode,
  toAccountId,
  toFiscalPeriodId,
  toJournalEntryId,
  toLedgerAccountCode,
} from "./accounting-id.contract.js";
export {
  ACCOUNTING_PERMISSION_ACTIONS,
  ACCOUNTING_PERMISSION_DOMAINS,
  ACCOUNTING_PERMISSION_KEY_VOCABULARY,
  type AccountingPermissionAction,
  type AccountingPermissionDomain,
  type AccountingPermissionKey,
  toAccountingPermissionKey,
} from "./accounting-permission-vocabulary.contract.js";
export { toAccountingDomainContext } from "./bridge/to-accounting-domain-context.js";
export {
  FISCAL_PERIOD_STATES,
  type FiscalPeriodState,
  isFiscalPeriodState,
} from "./fiscal-period-state.contract.js";
export {
  isJournalDocumentType,
  JOURNAL_DOCUMENT_TYPES,
  type JournalDocumentType,
} from "./journal-document-type.contract.js";
export {
  isPostingStatus,
  POSTING_STATUSES,
  type PostingStatus,
} from "./posting-status.contract.js";
