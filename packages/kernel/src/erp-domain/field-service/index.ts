/**
 * PAS-001B B97 — field-service ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/field-service`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed field-service-domain export surface.

export {
  DISPATCH_PRIORITIES,
  type DispatchPriority,
  isDispatchPriority,
} from "./dispatch-priority.contract.js";
export {
  FIELD_SERVICE_AUDIT_ACTIONS,
  type FieldServiceAuditAction,
  isFieldServiceAuditAction,
  parseFieldServiceAuditAction,
} from "./field-service-audit-actions.contract.js";
export {
  FIELD_SERVICE_AUTHORITY_FINGERPRINT,
  FIELD_SERVICE_AUTHORITY_PAS,
  FIELD_SERVICE_CONTRACTS_OWNER,
  FIELD_SERVICE_PACKAGE_LIFECYCLE,
  FIELD_SERVICE_PACKAGE_LIFECYCLE_PHASES,
  FIELD_SERVICE_REGISTRY_ID,
  type FieldServicePackageLifecyclePhase,
  isFieldServicePackageLifecyclePhase,
} from "./field-service-authority.contract.js";
export {
  FIELD_SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  FIELD_SERVICE_DOMAIN_VOCABULARY_POLICY,
  type FieldServiceDomainProhibitedRuntimeSurface,
} from "./field-service-domain-vocabulary.policy.js";
export {
  type assertFieldServiceDomainVocabularyRegistryIntegrity,
  FIELD_SERVICE_DOMAIN_AUDIT_VOCABULARY,
  FIELD_SERVICE_DOMAIN_AUTHORITY_METADATA,
  FIELD_SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  FIELD_SERVICE_DOMAIN_BRANDED_IDS,
  FIELD_SERVICE_DOMAIN_CLOSED_VOCABULARIES,
  FIELD_SERVICE_DOMAIN_PERMISSION_VOCABULARY,
  FIELD_SERVICE_DOMAIN_VOCABULARY_REGISTRY,
  FIELD_SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
  FIELD_SERVICE_DOMAIN_WIRE_CONTEXT,
  type FieldServiceDomainBrandedIdEntry,
  type FieldServiceDomainClosedVocabularyEntry,
  type FieldServiceDomainVocabularyKind,
} from "./field-service-domain-vocabulary.registry.js";
export type {
  assertFieldServiceDomainWireContextJsonSerializable,
  FieldServiceDomainWireContext,
} from "./field-service-domain-wire-context.contract.js";
export {
  brandDispatchRunId,
  brandFieldWorkOrderId,
  brandTechnicianRouteId,
  type DispatchRunId,
  type FieldWorkOrderId,
  type TechnicianRouteId,
  toDispatchRunId,
  toFieldWorkOrderId,
  toTechnicianRouteId,
} from "./field-service-id.contract.js";
export {
  FIELD_SERVICE_PERMISSION_ACTIONS,
  FIELD_SERVICE_PERMISSION_DOMAINS,
  FIELD_SERVICE_PERMISSION_KEY_VOCABULARY,
  type FieldServicePermissionAction,
  type FieldServicePermissionDomain,
  type FieldServicePermissionKey,
  toFieldServicePermissionKey,
} from "./field-service-permission-vocabulary.contract.js";
export {
  isRouteStatus,
  ROUTE_STATUSES,
  type RouteStatus,
} from "./route-status.contract.js";
export {
  isVisitOutcome,
  VISIT_OUTCOMES,
  type VisitOutcome,
} from "./visit-outcome.contract.js";
export {
  isWorkOrderStatus,
  WORK_ORDER_STATUSES,
  type WorkOrderStatus,
} from "./work-order-status.contract.js";
