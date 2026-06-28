/**
 * PAS-001B B86 — manufacturing ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/manufacturing`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed manufacturing-domain export surface.

export {
  CAPACITY_PLANNING_METHODS,
  type CapacityPlanningMethod,
  isCapacityPlanningMethod,
} from "./capacity-planning-method.contract.js";
export {
  isManufacturingAuditAction,
  MANUFACTURING_AUDIT_ACTIONS,
  type ManufacturingAuditAction,
  parseManufacturingAuditAction,
} from "./manufacturing-audit-actions.contract.js";
export {
  isManufacturingPackageLifecyclePhase,
  MANUFACTURING_AUTHORITY_FINGERPRINT,
  MANUFACTURING_AUTHORITY_PAS,
  MANUFACTURING_CONTRACTS_OWNER,
  MANUFACTURING_PACKAGE_LIFECYCLE,
  MANUFACTURING_PACKAGE_LIFECYCLE_PHASES,
  MANUFACTURING_REGISTRY_ID,
  type ManufacturingPackageLifecyclePhase,
} from "./manufacturing-authority.contract.js";
export {
  MANUFACTURING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  MANUFACTURING_DOMAIN_VOCABULARY_POLICY,
  type ManufacturingDomainProhibitedRuntimeSurface,
} from "./manufacturing-domain-vocabulary.policy.js";
export {
  type assertManufacturingDomainVocabularyRegistryIntegrity,
  MANUFACTURING_DOMAIN_AUDIT_VOCABULARY,
  MANUFACTURING_DOMAIN_AUTHORITY_METADATA,
  MANUFACTURING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  MANUFACTURING_DOMAIN_BRANDED_IDS,
  MANUFACTURING_DOMAIN_CLOSED_VOCABULARIES,
  MANUFACTURING_DOMAIN_PERMISSION_VOCABULARY,
  MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY,
  MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY_ID,
  MANUFACTURING_DOMAIN_WIRE_CONTEXT,
  type ManufacturingDomainBrandedIdEntry,
  type ManufacturingDomainClosedVocabularyEntry,
  type ManufacturingDomainVocabularyKind,
} from "./manufacturing-domain-vocabulary.registry.js";
export type {
  assertManufacturingDomainWireContextJsonSerializable,
  ManufacturingDomainWireContext,
} from "./manufacturing-domain-wire-context.contract.js";
export {
  brandProductionOrderId,
  brandProductionRunId,
  brandRoutingId,
  type ProductionOrderId,
  type ProductionRunId,
  type RoutingId,
  toProductionOrderId,
  toProductionRunId,
  toRoutingId,
} from "./manufacturing-id.contract.js";
export {
  isManufacturingOrderType,
  MANUFACTURING_ORDER_TYPES,
  type ManufacturingOrderType,
} from "./manufacturing-order-type.contract.js";
export {
  MANUFACTURING_PERMISSION_ACTIONS,
  MANUFACTURING_PERMISSION_DOMAINS,
  MANUFACTURING_PERMISSION_KEY_VOCABULARY,
  type ManufacturingPermissionAction,
  type ManufacturingPermissionDomain,
  type ManufacturingPermissionKey,
  toManufacturingPermissionKey,
} from "./manufacturing-permission-vocabulary.contract.js";
export {
  isProductionOrderStatus,
  PRODUCTION_ORDER_STATUSES,
  type ProductionOrderStatus,
} from "./production-order-status.contract.js";
export {
  isShopFloorEventType,
  SHOP_FLOOR_EVENT_TYPES,
  type ShopFloorEventType,
} from "./shop-floor-event-type.contract.js";
