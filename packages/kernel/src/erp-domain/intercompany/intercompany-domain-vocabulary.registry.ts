/**
 * PAS-001B B85 — intercompany domain vocabulary manifest.
 * Contracts-only registry — no IC matching, settlement posting, or ID_FAMILIES promotion.
 */

import { IC_BILLING_DIRECTIONS } from "./ic-billing-direction.contract.js";
import { IC_MATCHING_STATUSES } from "./ic-matching-status.contract.js";
import { IC_SETTLEMENT_METHODS } from "./ic-settlement-method.contract.js";
import { IC_TRANSACTION_TYPES } from "./ic-transaction-type.contract.js";
import {
  INTERCOMPANY_AUDIT_ACTIONS,
  type isIntercompanyAuditAction,
} from "./intercompany-audit-actions.contract.js";
import {
  INTERCOMPANY_PACKAGE_LIFECYCLE,
  INTERCOMPANY_PACKAGE_LIFECYCLE_PHASES,
} from "./intercompany-authority.contract.js";
import {
  INTERCOMPANY_PERMISSION_DOMAINS,
  INTERCOMPANY_PERMISSION_KEY_VOCABULARY,
} from "./intercompany-permission-vocabulary.contract.js";

export const INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-INTERCOMPANY" as const;

export type IntercompanyDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface IntercompanyDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const INTERCOMPANY_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "ic-transaction-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "ic-transaction-type.contract.ts",
    constantExport: "IC_TRANSACTION_TYPES",
    typeExport: "IcTransactionType",
    narrowerExport: "isIcTransactionType",
    valueCount: IC_TRANSACTION_TYPES.length,
  },
  {
    id: "ic-matching-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "ic-matching-status.contract.ts",
    constantExport: "IC_MATCHING_STATUSES",
    typeExport: "IcMatchingStatus",
    narrowerExport: "isIcMatchingStatus",
    valueCount: IC_MATCHING_STATUSES.length,
  },
  {
    id: "ic-settlement-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "ic-settlement-method.contract.ts",
    constantExport: "IC_SETTLEMENT_METHODS",
    typeExport: "IcSettlementMethod",
    narrowerExport: "isIcSettlementMethod",
    valueCount: IC_SETTLEMENT_METHODS.length,
  },
  {
    id: "ic-billing-direction",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "ic-billing-direction.contract.ts",
    constantExport: "IC_BILLING_DIRECTIONS",
    typeExport: "IcBillingDirection",
    narrowerExport: "isIcBillingDirection",
    valueCount: IC_BILLING_DIRECTIONS.length,
  },
] as const satisfies readonly IntercompanyDomainClosedVocabularyEntry[];

export interface IntercompanyDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const INTERCOMPANY_DOMAIN_BRANDED_IDS = [
  {
    typeName: "IntercompanyAgreementId",
    brandFunction: "brandIntercompanyAgreementId",
    toFunction: "toIntercompanyAgreementId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "IcMatchingRunId",
    brandFunction: "brandIcMatchingRunId",
    toFunction: "toIcMatchingRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "IcSettlementId",
    brandFunction: "brandIcSettlementId",
    toFunction: "toIcSettlementId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly IntercompanyDomainBrandedIdEntry[];

export const INTERCOMPANY_DOMAIN_BRANDED_ID_TYPE_NAMES =
  INTERCOMPANY_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const INTERCOMPANY_DOMAIN_WIRE_CONTEXT = {
  id: "intercompany-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "intercompany-domain-wire-context.contract.ts",
  typeExport: "IntercompanyDomainWireContext",
  assertExport: "assertIntercompanyDomainWireContextJsonSerializable",
} as const;

export const INTERCOMPANY_DOMAIN_AUDIT_VOCABULARY = {
  id: "intercompany-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "intercompany-audit-actions.contract.ts",
  constantExport: "INTERCOMPANY_AUDIT_ACTIONS",
  typeExport: "IntercompanyAuditAction",
  narrowerExport: "isIntercompanyAuditAction",
  valueCount: INTERCOMPANY_AUDIT_ACTIONS.length,
} as const;

export const INTERCOMPANY_DOMAIN_PERMISSION_VOCABULARY = {
  id: "intercompany-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "intercompany-permission-vocabulary.contract.ts",
  domainsExport: "INTERCOMPANY_PERMISSION_DOMAINS",
  keysExport: "INTERCOMPANY_PERMISSION_KEY_VOCABULARY",
  domainCount: INTERCOMPANY_PERMISSION_DOMAINS.length,
  keyCount: INTERCOMPANY_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const INTERCOMPANY_DOMAIN_AUTHORITY_METADATA = {
  id: "intercompany-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "intercompany-authority.contract.ts",
  lifecycleExport: "INTERCOMPANY_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "INTERCOMPANY_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: INTERCOMPANY_PACKAGE_LIFECYCLE,
  phaseCount: INTERCOMPANY_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY = {
  id: INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: INTERCOMPANY_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: INTERCOMPANY_DOMAIN_BRANDED_IDS,
  wireContext: INTERCOMPANY_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: INTERCOMPANY_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: INTERCOMPANY_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: INTERCOMPANY_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof INTERCOMPANY_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isIntercompanyAuditAction
  >[0]
    ? true
    : never;

export type assertIntercompanyDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
