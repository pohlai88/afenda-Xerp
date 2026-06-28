/**
 * PAS-001B B88 — maintenance ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/maintenance`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed maintenance-domain export surface.

export {
  DOWNTIME_CATEGORIES,
  type DowntimeCategory,
  isDowntimeCategory,
} from "./downtime-category.contract.js";
export {
  isMaintenanceAuditAction,
  MAINTENANCE_AUDIT_ACTIONS,
  type MaintenanceAuditAction,
  parseMaintenanceAuditAction,
} from "./maintenance-audit-actions.contract.js";
export {
  isMaintenancePackageLifecyclePhase,
  MAINTENANCE_AUTHORITY_FINGERPRINT,
  MAINTENANCE_AUTHORITY_PAS,
  MAINTENANCE_CONTRACTS_OWNER,
  MAINTENANCE_PACKAGE_LIFECYCLE,
  MAINTENANCE_PACKAGE_LIFECYCLE_PHASES,
  MAINTENANCE_REGISTRY_ID,
  type MaintenancePackageLifecyclePhase,
} from "./maintenance-authority.contract.js";
export {
  MAINTENANCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  MAINTENANCE_DOMAIN_VOCABULARY_POLICY,
  type MaintenanceDomainProhibitedRuntimeSurface,
} from "./maintenance-domain-vocabulary.policy.js";
export {
  type assertMaintenanceDomainVocabularyRegistryIntegrity,
  MAINTENANCE_DOMAIN_AUDIT_VOCABULARY,
  MAINTENANCE_DOMAIN_AUTHORITY_METADATA,
  MAINTENANCE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  MAINTENANCE_DOMAIN_BRANDED_IDS,
  MAINTENANCE_DOMAIN_CLOSED_VOCABULARIES,
  MAINTENANCE_DOMAIN_PERMISSION_VOCABULARY,
  MAINTENANCE_DOMAIN_VOCABULARY_REGISTRY,
  MAINTENANCE_DOMAIN_VOCABULARY_REGISTRY_ID,
  MAINTENANCE_DOMAIN_WIRE_CONTEXT,
  type MaintenanceDomainBrandedIdEntry,
  type MaintenanceDomainClosedVocabularyEntry,
  type MaintenanceDomainVocabularyKind,
} from "./maintenance-domain-vocabulary.registry.js";
export type {
  assertMaintenanceDomainWireContextJsonSerializable,
  MaintenanceDomainWireContext,
} from "./maintenance-domain-wire-context.contract.js";
export {
  brandEquipmentDowntimeId,
  brandMaintenanceOrderId,
  brandWorkRequestId,
  type EquipmentDowntimeId,
  type MaintenanceOrderId,
  toEquipmentDowntimeId,
  toMaintenanceOrderId,
  toWorkRequestId,
  type WorkRequestId,
} from "./maintenance-id.contract.js";
export {
  isMaintenanceOrderStatus,
  MAINTENANCE_ORDER_STATUSES,
  type MaintenanceOrderStatus,
} from "./maintenance-order-status.contract.js";
export {
  isMaintenanceOrderType,
  MAINTENANCE_ORDER_TYPES,
  type MaintenanceOrderType,
} from "./maintenance-order-type.contract.js";
export {
  MAINTENANCE_PERMISSION_ACTIONS,
  MAINTENANCE_PERMISSION_DOMAINS,
  MAINTENANCE_PERMISSION_KEY_VOCABULARY,
  type MaintenancePermissionAction,
  type MaintenancePermissionDomain,
  type MaintenancePermissionKey,
  toMaintenancePermissionKey,
} from "./maintenance-permission-vocabulary.contract.js";
export {
  isMaintenancePriority,
  MAINTENANCE_PRIORITIES,
  type MaintenancePriority,
} from "./maintenance-priority.contract.js";
