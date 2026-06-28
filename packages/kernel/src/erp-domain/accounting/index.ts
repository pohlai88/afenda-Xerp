/**
 * PAS-001B B76 — accounting ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/accounting`.
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
  ACCOUNTING_AUTHORITY_PAS,
  ACCOUNTING_CONTRACTS_OWNER,
  ACCOUNTING_PACKAGE_LIFECYCLE,
  ACCOUNTING_PACKAGE_LIFECYCLE_PHASES,
  ACCOUNTING_REGISTRY_ID,
  type AccountingPackageLifecyclePhase,
  isAccountingPackageLifecyclePhase,
} from "./accounting-authority.contract.js";
export {
  ACCOUNTING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ACCOUNTING_DOMAIN_VOCABULARY_POLICY,
  type AccountingDomainProhibitedRuntimeSurface,
} from "./accounting-domain-vocabulary.policy.js";
export {
  ACCOUNTING_DOMAIN_AUDIT_VOCABULARY,
  ACCOUNTING_DOMAIN_AUTHORITY_METADATA,
  ACCOUNTING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ACCOUNTING_DOMAIN_BRANDED_IDS,
  ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES,
  ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS,
  ACCOUNTING_DOMAIN_PERMISSION_VOCABULARY,
  ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY,
  ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY_ID,
  ACCOUNTING_DOMAIN_WIRE_CONTEXT,
  type AccountingDomainBrandedIdEntry,
  type AccountingDomainClosedVocabularyEntry,
  type AccountingDomainVocabularyKind,
  type assertAccountingDomainVocabularyRegistryIntegrity,
} from "./accounting-domain-vocabulary.registry.js";
export type {
  AccountingDomainWireContext,
  assertAccountingDomainWireContextJsonSerializable,
} from "./accounting-domain-wire-context.contract.js";
export {
  type AccountId,
  brandAccountId,
  brandFiscalCalendarId,
  brandFiscalPeriodId,
  brandJournalEntryId,
  brandLedgerAccountCode,
  type FiscalCalendarId,
  type FiscalPeriodId,
  type JournalEntryId,
  type LedgerAccountCode,
  toAccountId,
  toFiscalCalendarId,
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
export {
  CONSOLIDATION_METHODS,
  type ConsolidationMethod,
  isConsolidationMethod,
} from "./consolidation-method.contract.js";
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
