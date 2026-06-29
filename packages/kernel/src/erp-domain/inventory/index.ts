/**
 * PAS-001B B79 — inventory ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/inventory`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed inventory-domain export surface.

export {
  INVENTORY_AUDIT_ACTIONS,
  type InventoryAuditAction,
  isInventoryAuditAction,
  parseInventoryAuditAction,
} from "./inventory-audit-actions.contract.js";
export {
  INVENTORY_AUTHORITY_ADR,
  INVENTORY_AUTHORITY_FINGERPRINT,
  INVENTORY_AUTHORITY_PAS,
  INVENTORY_CONTRACTS_OWNER,
  INVENTORY_MODULE_KV_ID,
  INVENTORY_PACKAGE_LIFECYCLE,
  INVENTORY_PACKAGE_LIFECYCLE_PHASES,
  INVENTORY_REGISTRY_ID,
  type InventoryPackageLifecyclePhase,
  isInventoryPackageLifecyclePhase,
} from "./inventory-authority.contract.js";
export {
  INVENTORY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  INVENTORY_DOMAIN_VOCABULARY_POLICY,
  type InventoryDomainProhibitedRuntimeSurface,
} from "./inventory-domain-vocabulary.policy.js";
export {
  type assertInventoryDomainVocabularyRegistryIntegrity,
  INVENTORY_DOMAIN_AUDIT_VOCABULARY,
  INVENTORY_DOMAIN_AUTHORITY_METADATA,
  INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  INVENTORY_DOMAIN_BRANDED_IDS,
  INVENTORY_DOMAIN_CLOSED_VOCABULARIES,
  INVENTORY_DOMAIN_PERMISSION_VOCABULARY,
  INVENTORY_DOMAIN_VOCABULARY_REGISTRY,
  INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID,
  INVENTORY_DOMAIN_WIRE_CONTEXT,
  type InventoryDomainBrandedIdEntry,
  type InventoryDomainClosedVocabularyEntry,
  type InventoryDomainVocabularyKind,
} from "./inventory-domain-vocabulary.registry.js";
export type {
  assertInventoryDomainWireContextJsonSerializable,
  InventoryDomainWireContext,
} from "./inventory-domain-wire-context.contract.js";
export {
  brandInventoryCountSessionId,
  brandStockAdjustmentId,
  brandStockMovementId,
  type InventoryCountSessionId,
  type StockAdjustmentId,
  type StockMovementId,
  toInventoryCountSessionId,
  toStockAdjustmentId,
  toStockMovementId,
} from "./inventory-id.contract.js";
export {
  INVENTORY_PERMISSION_ACTIONS,
  INVENTORY_PERMISSION_DOMAINS,
  INVENTORY_PERMISSION_KEY_VOCABULARY,
  type InventoryPermissionAction,
  type InventoryPermissionDomain,
  type InventoryPermissionKey,
  toInventoryPermissionKey,
} from "./inventory-permission-vocabulary.contract.js";
export {
  INVENTORY_RECORD_STATUSES,
  type InventoryRecordStatus,
  isInventoryRecordStatus,
} from "./inventory-record-status.contract.js";
export {
  isStockMovementType,
  STOCK_MOVEMENT_TYPES,
  type StockMovementType,
} from "./stock-movement-type.contract.js";
export {
  isStockReservationStatus,
  STOCK_RESERVATION_STATUSES,
  type StockReservationStatus,
} from "./stock-reservation-status.contract.js";
export {
  isValuationMethod,
  VALUATION_METHODS,
  type ValuationMethod,
} from "./valuation-method.contract.js";
