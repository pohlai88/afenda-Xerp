/**
 * PAS-001B B80 — procurement domain vocabulary manifest.
 * Contracts-only registry — no PO posting, GR/IR matching, or ID_FAMILIES promotion.
 */

import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import {
  type isProcurementAuditAction,
  PROCUREMENT_AUDIT_ACTIONS,
} from "./procurement-audit-actions.contract.js";
import {
  PROCUREMENT_PACKAGE_LIFECYCLE,
  PROCUREMENT_PACKAGE_LIFECYCLE_PHASES,
} from "./procurement-authority.contract.js";
import { PROCUREMENT_DOCUMENT_TYPES } from "./procurement-document-type.contract.js";
import {
  PROCUREMENT_PERMISSION_DOMAINS,
  PROCUREMENT_PERMISSION_KEY_VOCABULARY,
} from "./procurement-permission-vocabulary.contract.js";
import { PURCHASE_ORDER_STATUSES } from "./purchase-order-status.contract.js";
import { PURCHASE_REQUISITION_STATUSES } from "./purchase-requisition-status.contract.js";
import { SOURCING_METHODS } from "./sourcing-method.contract.js";

export const PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-PROCUREMENT" as const;

export type ProcurementDomainVocabularyKind = ErpDomainVocabularyKind;

export type ProcurementDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const PROCUREMENT_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "purchase-requisition-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "purchase-requisition-status.contract.ts",
    constantExport: "PURCHASE_REQUISITION_STATUSES",
    typeExport: "PurchaseRequisitionStatus",
    narrowerExport: "isPurchaseRequisitionStatus",
    valueCount: PURCHASE_REQUISITION_STATUSES.length,
  },
  {
    id: "purchase-order-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "purchase-order-status.contract.ts",
    constantExport: "PURCHASE_ORDER_STATUSES",
    typeExport: "PurchaseOrderStatus",
    narrowerExport: "isPurchaseOrderStatus",
    valueCount: PURCHASE_ORDER_STATUSES.length,
  },
  {
    id: "procurement-document-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "procurement-document-type.contract.ts",
    constantExport: "PROCUREMENT_DOCUMENT_TYPES",
    typeExport: "ProcurementDocumentType",
    narrowerExport: "isProcurementDocumentType",
    valueCount: PROCUREMENT_DOCUMENT_TYPES.length,
  },
  {
    id: "sourcing-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "sourcing-method.contract.ts",
    constantExport: "SOURCING_METHODS",
    typeExport: "SourcingMethod",
    narrowerExport: "isSourcingMethod",
    valueCount: SOURCING_METHODS.length,
  },
] as const satisfies readonly ProcurementDomainClosedVocabularyEntry[];

export type ProcurementDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const PROCUREMENT_DOMAIN_BRANDED_IDS = [
  {
    typeName: "PurchaseRequisitionId",
    brandFunction: "brandPurchaseRequisitionId",
    toFunction: "toPurchaseRequisitionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "PurchaseOrderId",
    brandFunction: "brandPurchaseOrderId",
    toFunction: "toPurchaseOrderId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "RfqId",
    brandFunction: "brandRfqId",
    toFunction: "toRfqId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly ProcurementDomainBrandedIdEntry[];

export const PROCUREMENT_DOMAIN_BRANDED_ID_TYPE_NAMES =
  PROCUREMENT_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const PROCUREMENT_DOMAIN_WIRE_CONTEXT = {
  id: "procurement-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "procurement-domain-wire-context.contract.ts",
  typeExport: "ProcurementDomainWireContext",
  assertExport: "assertProcurementDomainWireContextJsonSerializable",
} as const;

export const PROCUREMENT_DOMAIN_AUDIT_VOCABULARY = {
  id: "procurement-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "procurement-audit-actions.contract.ts",
  constantExport: "PROCUREMENT_AUDIT_ACTIONS",
  typeExport: "ProcurementAuditAction",
  narrowerExport: "isProcurementAuditAction",
  valueCount: PROCUREMENT_AUDIT_ACTIONS.length,
} as const;

export const PROCUREMENT_DOMAIN_PERMISSION_VOCABULARY = {
  id: "procurement-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "procurement-permission-vocabulary.contract.ts",
  domainsExport: "PROCUREMENT_PERMISSION_DOMAINS",
  keysExport: "PROCUREMENT_PERMISSION_KEY_VOCABULARY",
  domainCount: PROCUREMENT_PERMISSION_DOMAINS.length,
  keyCount: PROCUREMENT_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const PROCUREMENT_DOMAIN_AUTHORITY_METADATA = {
  id: "procurement-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "procurement-authority.contract.ts",
  lifecycleExport: "PROCUREMENT_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "PROCUREMENT_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: PROCUREMENT_PACKAGE_LIFECYCLE,
  phaseCount: PROCUREMENT_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY = {
  id: PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: PROCUREMENT_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: PROCUREMENT_DOMAIN_BRANDED_IDS,
  wireContext: PROCUREMENT_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: PROCUREMENT_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: PROCUREMENT_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: PROCUREMENT_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof PROCUREMENT_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isProcurementAuditAction
  >[0]
    ? true
    : never;

export type assertProcurementDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
