import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import {
  type isPosAuditAction,
  POS_AUDIT_ACTIONS,
} from "./pos-audit-actions.contract.js";
import {
  POS_PACKAGE_LIFECYCLE,
  POS_PACKAGE_LIFECYCLE_PHASES,
} from "./pos-authority.contract.js";
import {
  POS_PERMISSION_DOMAINS,
  POS_PERMISSION_KEY_VOCABULARY,
} from "./pos-permission-vocabulary.contract.js";
import { POS_SESSION_STATUSES } from "./pos-session-status.contract.js";
import { SHIFT_STATUSES } from "./shift-status.contract.js";
import { TENDER_TYPES } from "./tender-type.contract.js";
import { TRANSACTION_TYPES } from "./transaction-type.contract.js";

export const POS_DOMAIN_VOCABULARY_REGISTRY_ID = "PAS-001B-4.8-POS" as const;

export type PosDomainVocabularyKind = ErpDomainVocabularyKind;

export type PosDomainClosedVocabularyEntry = ErpDomainClosedVocabularyEntry;

export const POS_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "pos-session-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "pos-session-status.contract.ts",
    constantExport: "POS_SESSION_STATUSES",
    typeExport: "PosSessionStatus",
    narrowerExport: "isPosSessionStatus",
    valueCount: POS_SESSION_STATUSES.length,
  },
  {
    id: "tender-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "tender-type.contract.ts",
    constantExport: "TENDER_TYPES",
    typeExport: "TenderType",
    narrowerExport: "isTenderType",
    valueCount: TENDER_TYPES.length,
  },
  {
    id: "transaction-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "transaction-type.contract.ts",
    constantExport: "TRANSACTION_TYPES",
    typeExport: "TransactionType",
    narrowerExport: "isTransactionType",
    valueCount: TRANSACTION_TYPES.length,
  },
  {
    id: "shift-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "shift-status.contract.ts",
    constantExport: "SHIFT_STATUSES",
    typeExport: "ShiftStatus",
    narrowerExport: "isShiftStatus",
    valueCount: SHIFT_STATUSES.length,
  },
] as const satisfies readonly PosDomainClosedVocabularyEntry[];

export type PosDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const POS_DOMAIN_BRANDED_IDS = [
  {
    typeName: "PosSessionId",
    brandFunction: "brandPosSessionId",
    toFunction: "toPosSessionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "PosTransactionId",
    brandFunction: "brandPosTransactionId",
    toFunction: "toPosTransactionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "CashDrawerShiftId",
    brandFunction: "brandCashDrawerShiftId",
    toFunction: "toCashDrawerShiftId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly PosDomainBrandedIdEntry[];

export const POS_DOMAIN_BRANDED_ID_TYPE_NAMES = POS_DOMAIN_BRANDED_IDS.map(
  (entry) => entry.typeName
);

export const POS_DOMAIN_WIRE_CONTEXT = {
  id: "pos-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "pos-domain-wire-context.contract.ts",
  typeExport: "PosDomainWireContext",
  assertExport: "assertPosDomainWireContextJsonSerializable",
} as const;

export const POS_DOMAIN_AUDIT_VOCABULARY = {
  id: "pos-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "pos-audit-actions.contract.ts",
  constantExport: "POS_AUDIT_ACTIONS",
  typeExport: "PosAuditAction",
  narrowerExport: "isPosAuditAction",
  valueCount: POS_AUDIT_ACTIONS.length,
} as const;

export const POS_DOMAIN_PERMISSION_VOCABULARY = {
  id: "pos-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "pos-permission-vocabulary.contract.ts",
  domainsExport: "POS_PERMISSION_DOMAINS",
  keysExport: "POS_PERMISSION_KEY_VOCABULARY",
  domainCount: POS_PERMISSION_DOMAINS.length,
  keyCount: POS_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const POS_DOMAIN_AUTHORITY_METADATA = {
  id: "pos-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "pos-authority.contract.ts",
  lifecycleExport: "POS_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "POS_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: POS_PACKAGE_LIFECYCLE,
  phaseCount: POS_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const POS_DOMAIN_VOCABULARY_REGISTRY = {
  id: POS_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: POS_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: POS_DOMAIN_BRANDED_IDS,
  wireContext: POS_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: POS_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: POS_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: POS_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof POS_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isPosAuditAction
  >[0]
    ? true
    : never;

export type assertPosDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
