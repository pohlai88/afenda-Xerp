import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { ACCOUNT_TYPES } from "./account-type.contract.js";

import {
  ACCOUNTING_AUDIT_ACTIONS,
  type isAccountingAuditAction,
} from "./accounting-audit-actions.contract.js";
import {
  ACCOUNTING_PACKAGE_LIFECYCLE,
  ACCOUNTING_PACKAGE_LIFECYCLE_PHASES,
} from "./accounting-authority.contract.js";
import {
  ACCOUNTING_PERMISSION_DOMAINS,
  ACCOUNTING_PERMISSION_KEY_VOCABULARY,
} from "./accounting-permission-vocabulary.contract.js";
import { CONSOLIDATION_METHODS } from "./consolidation-method.contract.js";
import { FISCAL_PERIOD_STATES } from "./fiscal-period-state.contract.js";
import { JOURNAL_DOCUMENT_TYPES } from "./journal-document-type.contract.js";
import { POSTING_STATUSES } from "./posting-status.contract.js";

export const ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-ACCOUNTING" as const;

export type AccountingDomainVocabularyKind = ErpDomainVocabularyKind;

export type AccountingDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export type AccountingDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "account-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "account-type.contract.ts",
    constantExport: "ACCOUNT_TYPES",
    typeExport: "AccountType",
    narrowerExport: "isAccountType",
    valueCount: ACCOUNT_TYPES.length,
  },
  {
    id: "posting-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "posting-status.contract.ts",
    constantExport: "POSTING_STATUSES",
    typeExport: "PostingStatus",
    narrowerExport: "isPostingStatus",
    valueCount: POSTING_STATUSES.length,
  },
  {
    id: "fiscal-period-state",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "fiscal-period-state.contract.ts",
    constantExport: "FISCAL_PERIOD_STATES",
    typeExport: "FiscalPeriodState",
    narrowerExport: "isFiscalPeriodState",
    valueCount: FISCAL_PERIOD_STATES.length,
  },
  {
    id: "journal-document-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "journal-document-type.contract.ts",
    constantExport: "JOURNAL_DOCUMENT_TYPES",
    typeExport: "JournalDocumentType",
    narrowerExport: "isJournalDocumentType",
    valueCount: JOURNAL_DOCUMENT_TYPES.length,
  },
  {
    id: "consolidation-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "consolidation-method.contract.ts",
    constantExport: "CONSOLIDATION_METHODS",
    typeExport: "ConsolidationMethod",
    narrowerExport: "isConsolidationMethod",
    valueCount: CONSOLIDATION_METHODS.length,
  },
] as const satisfies readonly AccountingDomainClosedVocabularyEntry[];

export const ACCOUNTING_DOMAIN_BRANDED_IDS = [
  {
    typeName: "AccountId",
    brandFunction: "brandAccountId",
    toFunction: "toAccountId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "JournalEntryId",
    brandFunction: "brandJournalEntryId",
    toFunction: "toJournalEntryId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "FiscalCalendarId",
    brandFunction: "brandFiscalCalendarId",
    toFunction: "toFiscalCalendarId",
    forbiddenOnPlatformFloor: true,
  },
  {
    typeName: "FiscalPeriodId",
    brandFunction: "brandFiscalPeriodId",
    toFunction: "toFiscalPeriodId",
    forbiddenOnPlatformFloor: true,
  },
  {
    typeName: "LedgerAccountCode",
    brandFunction: "brandLedgerAccountCode",
    toFunction: "toLedgerAccountCode",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly AccountingDomainBrandedIdEntry[];

export const ACCOUNTING_DOMAIN_BRANDED_ID_TYPE_NAMES =
  ACCOUNTING_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const ACCOUNTING_DOMAIN_FORBIDDEN_PLATFORM_FLOOR_BRANDED_IDS =
  ACCOUNTING_DOMAIN_BRANDED_IDS.filter(
    (entry) => entry.forbiddenOnPlatformFloor
  ).map((entry) => entry.typeName);

export const ACCOUNTING_DOMAIN_WIRE_CONTEXT = {
  id: "accounting-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "accounting-domain-wire-context.contract.ts",
  typeExport: "AccountingDomainWireContext",
  assertExport: "assertAccountingDomainWireContextJsonSerializable",
} as const;

export const ACCOUNTING_DOMAIN_AUDIT_VOCABULARY = {
  id: "accounting-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "accounting-audit-actions.contract.ts",
  constantExport: "ACCOUNTING_AUDIT_ACTIONS",
  typeExport: "AccountingAuditAction",
  narrowerExport: "isAccountingAuditAction",
  valueCount: ACCOUNTING_AUDIT_ACTIONS.length,
} as const;

export const ACCOUNTING_DOMAIN_PERMISSION_VOCABULARY = {
  id: "accounting-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "accounting-permission-vocabulary.contract.ts",
  domainsExport: "ACCOUNTING_PERMISSION_DOMAINS",
  keysExport: "ACCOUNTING_PERMISSION_KEY_VOCABULARY",
  domainCount: ACCOUNTING_PERMISSION_DOMAINS.length,
  keyCount: ACCOUNTING_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const ACCOUNTING_DOMAIN_AUTHORITY_METADATA = {
  id: "accounting-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "accounting-authority.contract.ts",
  lifecycleExport: "ACCOUNTING_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "ACCOUNTING_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: ACCOUNTING_PACKAGE_LIFECYCLE,
  phaseCount: ACCOUNTING_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY = {
  id: ACCOUNTING_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: ACCOUNTING_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: ACCOUNTING_DOMAIN_BRANDED_IDS,
  wireContext: ACCOUNTING_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: ACCOUNTING_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: ACCOUNTING_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: ACCOUNTING_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof ACCOUNTING_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isAccountingAuditAction
  >[0]
    ? true
    : never;

export type assertAccountingDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
