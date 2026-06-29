/**
 * PAS-001B B80 — procurement ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/procurement`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed procurement-domain export surface.

export {
  isProcurementAuditAction,
  PROCUREMENT_AUDIT_ACTIONS,
  type ProcurementAuditAction,
  parseProcurementAuditAction,
} from "./procurement-audit-actions.contract.js";
export {
  isProcurementPackageLifecyclePhase,
  PROCUREMENT_AUTHORITY_FINGERPRINT,
  PROCUREMENT_AUTHORITY_PAS,
  PROCUREMENT_CONTRACTS_OWNER,
  PROCUREMENT_MODULE_KV_ID,
  PROCUREMENT_PACKAGE_LIFECYCLE,
  PROCUREMENT_PACKAGE_LIFECYCLE_PHASES,
  PROCUREMENT_REGISTRY_ID,
  type ProcurementPackageLifecyclePhase,
} from "./procurement-authority.contract.js";
export {
  isProcurementDocumentType,
  PROCUREMENT_DOCUMENT_TYPES,
  type ProcurementDocumentType,
} from "./procurement-document-type.contract.js";
export {
  PROCUREMENT_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  PROCUREMENT_DOMAIN_VOCABULARY_POLICY,
  type ProcurementDomainProhibitedRuntimeSurface,
} from "./procurement-domain-vocabulary.policy.js";
export {
  type assertProcurementDomainVocabularyRegistryIntegrity,
  PROCUREMENT_DOMAIN_AUDIT_VOCABULARY,
  PROCUREMENT_DOMAIN_AUTHORITY_METADATA,
  PROCUREMENT_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PROCUREMENT_DOMAIN_BRANDED_IDS,
  PROCUREMENT_DOMAIN_CLOSED_VOCABULARIES,
  PROCUREMENT_DOMAIN_PERMISSION_VOCABULARY,
  PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY,
  PROCUREMENT_DOMAIN_VOCABULARY_REGISTRY_ID,
  PROCUREMENT_DOMAIN_WIRE_CONTEXT,
  type ProcurementDomainBrandedIdEntry,
  type ProcurementDomainClosedVocabularyEntry,
  type ProcurementDomainVocabularyKind,
} from "./procurement-domain-vocabulary.registry.js";
export type {
  assertProcurementDomainWireContextJsonSerializable,
  ProcurementDomainWireContext,
} from "./procurement-domain-wire-context.contract.js";
export {
  brandPurchaseOrderId,
  brandPurchaseRequisitionId,
  brandRfqId,
  type PurchaseOrderId,
  type PurchaseRequisitionId,
  type RfqId,
  toPurchaseOrderId,
  toPurchaseRequisitionId,
  toRfqId,
} from "./procurement-id.contract.js";
export {
  PROCUREMENT_PERMISSION_ACTIONS,
  PROCUREMENT_PERMISSION_DOMAINS,
  PROCUREMENT_PERMISSION_KEY_VOCABULARY,
  type ProcurementPermissionAction,
  type ProcurementPermissionDomain,
  type ProcurementPermissionKey,
  toProcurementPermissionKey,
} from "./procurement-permission-vocabulary.contract.js";
export {
  isPurchaseOrderStatus,
  PURCHASE_ORDER_STATUSES,
  type PurchaseOrderStatus,
} from "./purchase-order-status.contract.js";
export {
  isPurchaseRequisitionStatus,
  PURCHASE_REQUISITION_STATUSES,
  type PurchaseRequisitionStatus,
} from "./purchase-requisition-status.contract.js";
export {
  isSourcingMethod,
  SOURCING_METHODS,
  type SourcingMethod,
} from "./sourcing-method.contract.js";
