import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { HEDGE_ACCOUNTING_METHODS } from "./hedge-accounting-method.contract.js";

import { LIQUIDITY_STATUSES } from "./liquidity-status.contract.js";
import { PAYMENT_RUN_STATUSES } from "./payment-run-status.contract.js";
import {
  type isTreasuryAuditAction,
  TREASURY_AUDIT_ACTIONS,
} from "./treasury-audit-actions.contract.js";
import {
  TREASURY_PACKAGE_LIFECYCLE,
  TREASURY_PACKAGE_LIFECYCLE_PHASES,
} from "./treasury-authority.contract.js";
import { TREASURY_INSTRUMENT_TYPES } from "./treasury-instrument-type.contract.js";
import {
  TREASURY_PERMISSION_DOMAINS,
  TREASURY_PERMISSION_KEY_VOCABULARY,
} from "./treasury-permission-vocabulary.contract.js";

export const TREASURY_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-TREASURY" as const;

export type TreasuryDomainVocabularyKind = ErpDomainVocabularyKind;

export type TreasuryDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const TREASURY_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "treasury-instrument-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "treasury-instrument-type.contract.ts",
    constantExport: "TREASURY_INSTRUMENT_TYPES",
    typeExport: "TreasuryInstrumentType",
    narrowerExport: "isTreasuryInstrumentType",
    valueCount: TREASURY_INSTRUMENT_TYPES.length,
  },
  {
    id: "liquidity-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "liquidity-status.contract.ts",
    constantExport: "LIQUIDITY_STATUSES",
    typeExport: "LiquidityStatus",
    narrowerExport: "isLiquidityStatus",
    valueCount: LIQUIDITY_STATUSES.length,
  },
  {
    id: "payment-run-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "payment-run-status.contract.ts",
    constantExport: "PAYMENT_RUN_STATUSES",
    typeExport: "PaymentRunStatus",
    narrowerExport: "isPaymentRunStatus",
    valueCount: PAYMENT_RUN_STATUSES.length,
  },
  {
    id: "hedge-accounting-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "hedge-accounting-method.contract.ts",
    constantExport: "HEDGE_ACCOUNTING_METHODS",
    typeExport: "HedgeAccountingMethod",
    narrowerExport: "isHedgeAccountingMethod",
    valueCount: HEDGE_ACCOUNTING_METHODS.length,
  },
] as const satisfies readonly TreasuryDomainClosedVocabularyEntry[];

export type TreasuryDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const TREASURY_DOMAIN_BRANDED_IDS = [
  {
    typeName: "CashPositionSnapshotId",
    brandFunction: "brandCashPositionSnapshotId",
    toFunction: "toCashPositionSnapshotId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "PaymentRunId",
    brandFunction: "brandPaymentRunId",
    toFunction: "toPaymentRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "BankStatementImportId",
    brandFunction: "brandBankStatementImportId",
    toFunction: "toBankStatementImportId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly TreasuryDomainBrandedIdEntry[];

export const TREASURY_DOMAIN_BRANDED_ID_TYPE_NAMES =
  TREASURY_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const TREASURY_DOMAIN_WIRE_CONTEXT = {
  id: "treasury-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "treasury-domain-wire-context.contract.ts",
  typeExport: "TreasuryDomainWireContext",
  assertExport: "assertTreasuryDomainWireContextJsonSerializable",
} as const;

export const TREASURY_DOMAIN_AUDIT_VOCABULARY = {
  id: "treasury-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "treasury-audit-actions.contract.ts",
  constantExport: "TREASURY_AUDIT_ACTIONS",
  typeExport: "TreasuryAuditAction",
  narrowerExport: "isTreasuryAuditAction",
  valueCount: TREASURY_AUDIT_ACTIONS.length,
} as const;

export const TREASURY_DOMAIN_PERMISSION_VOCABULARY = {
  id: "treasury-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "treasury-permission-vocabulary.contract.ts",
  domainsExport: "TREASURY_PERMISSION_DOMAINS",
  keysExport: "TREASURY_PERMISSION_KEY_VOCABULARY",
  domainCount: TREASURY_PERMISSION_DOMAINS.length,
  keyCount: TREASURY_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const TREASURY_DOMAIN_AUTHORITY_METADATA = {
  id: "treasury-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "treasury-authority.contract.ts",
  lifecycleExport: "TREASURY_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "TREASURY_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: TREASURY_PACKAGE_LIFECYCLE,
  phaseCount: TREASURY_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const TREASURY_DOMAIN_VOCABULARY_REGISTRY = {
  id: TREASURY_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: TREASURY_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: TREASURY_DOMAIN_BRANDED_IDS,
  wireContext: TREASURY_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: TREASURY_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: TREASURY_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: TREASURY_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof TREASURY_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isTreasuryAuditAction
  >[0]
    ? true
    : never;

export type assertTreasuryDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
