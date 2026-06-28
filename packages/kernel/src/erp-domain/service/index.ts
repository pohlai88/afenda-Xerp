/**
 * PAS-001B B96 — service ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/service`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed service-domain export surface.

export {
  CASE_PRIORITIES,
  type CasePriority,
  isCasePriority,
} from "./case-priority.contract.js";
export {
  CASE_STATUSES,
  type CaseStatus,
  isCaseStatus,
} from "./case-status.contract.js";
export {
  isResolutionType,
  RESOLUTION_TYPES,
  type ResolutionType,
} from "./resolution-type.contract.js";
export {
  isServiceAuditAction,
  parseServiceAuditAction,
  SERVICE_AUDIT_ACTIONS,
  type ServiceAuditAction,
} from "./service-audit-actions.contract.js";
export {
  isServicePackageLifecyclePhase,
  SERVICE_AUTHORITY_FINGERPRINT,
  SERVICE_AUTHORITY_PAS,
  SERVICE_CONTRACTS_OWNER,
  SERVICE_PACKAGE_LIFECYCLE,
  SERVICE_PACKAGE_LIFECYCLE_PHASES,
  SERVICE_REGISTRY_ID,
  type ServicePackageLifecyclePhase,
} from "./service-authority.contract.js";
export {
  SERVICE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  SERVICE_DOMAIN_VOCABULARY_POLICY,
  type ServiceDomainProhibitedRuntimeSurface,
} from "./service-domain-vocabulary.policy.js";
export {
  type assertServiceDomainVocabularyRegistryIntegrity,
  SERVICE_DOMAIN_AUDIT_VOCABULARY,
  SERVICE_DOMAIN_AUTHORITY_METADATA,
  SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SERVICE_DOMAIN_BRANDED_IDS,
  SERVICE_DOMAIN_CLOSED_VOCABULARIES,
  SERVICE_DOMAIN_PERMISSION_VOCABULARY,
  SERVICE_DOMAIN_VOCABULARY_REGISTRY,
  SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
  SERVICE_DOMAIN_WIRE_CONTEXT,
  type ServiceDomainBrandedIdEntry,
  type ServiceDomainClosedVocabularyEntry,
  type ServiceDomainVocabularyKind,
} from "./service-domain-vocabulary.registry.js";
export type {
  assertServiceDomainWireContextJsonSerializable,
  ServiceDomainWireContext,
} from "./service-domain-wire-context.contract.js";
export {
  brandServiceCaseId,
  brandServiceContractId,
  brandServiceVisitId,
  type ServiceCaseId,
  type ServiceContractId,
  type ServiceVisitId,
  toServiceCaseId,
  toServiceContractId,
  toServiceVisitId,
} from "./service-id.contract.js";
export {
  isServiceLevel,
  SERVICE_LEVELS,
  type ServiceLevel,
} from "./service-level.contract.js";
export {
  SERVICE_PERMISSION_ACTIONS,
  SERVICE_PERMISSION_DOMAINS,
  SERVICE_PERMISSION_KEY_VOCABULARY,
  type ServicePermissionAction,
  type ServicePermissionDomain,
  type ServicePermissionKey,
  toServicePermissionKey,
} from "./service-permission-vocabulary.contract.js";
