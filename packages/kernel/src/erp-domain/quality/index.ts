/**
 * PAS-001B B87 — quality ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/quality`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed quality-domain export surface.

export {
  DISPOSITION_CODES,
  type DispositionCode,
  isDispositionCode,
} from "./disposition-code.contract.js";
export {
  INSPECTION_RESULT_STATUSES,
  type InspectionResultStatus,
  isInspectionResultStatus,
} from "./inspection-result-status.contract.js";
export {
  INSPECTION_TYPES,
  type InspectionType,
  isInspectionType,
} from "./inspection-type.contract.js";
export {
  isQualityAuditAction,
  parseQualityAuditAction,
  QUALITY_AUDIT_ACTIONS,
  type QualityAuditAction,
} from "./quality-audit-actions.contract.js";
export {
  isQualityPackageLifecyclePhase,
  QUALITY_AUTHORITY_FINGERPRINT,
  QUALITY_AUTHORITY_PAS,
  QUALITY_CONTRACTS_OWNER,
  QUALITY_MODULE_KV_ID,
  QUALITY_PACKAGE_LIFECYCLE,
  QUALITY_PACKAGE_LIFECYCLE_PHASES,
  QUALITY_REGISTRY_ID,
  type QualityPackageLifecyclePhase,
} from "./quality-authority.contract.js";
export {
  QUALITY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  QUALITY_DOMAIN_VOCABULARY_POLICY,
  type QualityDomainProhibitedRuntimeSurface,
} from "./quality-domain-vocabulary.policy.js";
export {
  type assertQualityDomainVocabularyRegistryIntegrity,
  QUALITY_DOMAIN_AUDIT_VOCABULARY,
  QUALITY_DOMAIN_AUTHORITY_METADATA,
  QUALITY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  QUALITY_DOMAIN_BRANDED_IDS,
  QUALITY_DOMAIN_CLOSED_VOCABULARIES,
  QUALITY_DOMAIN_PERMISSION_VOCABULARY,
  QUALITY_DOMAIN_VOCABULARY_REGISTRY,
  QUALITY_DOMAIN_VOCABULARY_REGISTRY_ID,
  QUALITY_DOMAIN_WIRE_CONTEXT,
  type QualityDomainBrandedIdEntry,
  type QualityDomainClosedVocabularyEntry,
  type QualityDomainVocabularyKind,
} from "./quality-domain-vocabulary.registry.js";
export type {
  assertQualityDomainWireContextJsonSerializable,
  QualityDomainWireContext,
} from "./quality-domain-wire-context.contract.js";
export {
  brandQualityInspectionId,
  brandQualityNotificationId,
  brandSampleLotId,
  type QualityInspectionId,
  type QualityNotificationId,
  type SampleLotId,
  toQualityInspectionId,
  toQualityNotificationId,
  toSampleLotId,
} from "./quality-id.contract.js";
export {
  isQualityNotificationPriority,
  QUALITY_NOTIFICATION_PRIORITIES,
  type QualityNotificationPriority,
} from "./quality-notification-priority.contract.js";
export {
  QUALITY_PERMISSION_ACTIONS,
  QUALITY_PERMISSION_DOMAINS,
  QUALITY_PERMISSION_KEY_VOCABULARY,
  type QualityPermissionAction,
  type QualityPermissionDomain,
  type QualityPermissionKey,
  toQualityPermissionKey,
} from "./quality-permission-vocabulary.contract.js";
