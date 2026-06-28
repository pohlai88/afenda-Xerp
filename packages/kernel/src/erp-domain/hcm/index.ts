/**
 * PAS-001B B99 — hcm ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/hcm`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed hcm-domain export surface.

export {
  EMPLOYMENT_TYPES,
  type EmploymentType,
  isEmploymentType,
} from "./employment-type.contract.js";
export {
  HCM_AUDIT_ACTIONS,
  type HcmAuditAction,
  isHcmAuditAction,
  parseHcmAuditAction,
} from "./hcm-audit-actions.contract.js";
export {
  HCM_AUTHORITY_FINGERPRINT,
  HCM_AUTHORITY_PAS,
  HCM_CONTRACTS_OWNER,
  HCM_PACKAGE_LIFECYCLE,
  HCM_PACKAGE_LIFECYCLE_PHASES,
  HCM_REGISTRY_ID,
  type HcmPackageLifecyclePhase,
  isHcmPackageLifecyclePhase,
} from "./hcm-authority.contract.js";
export {
  HCM_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  HCM_DOMAIN_VOCABULARY_POLICY,
  type HcmDomainProhibitedRuntimeSurface,
} from "./hcm-domain-vocabulary.policy.js";
export {
  type assertHcmDomainVocabularyRegistryIntegrity,
  HCM_DOMAIN_AUDIT_VOCABULARY,
  HCM_DOMAIN_AUTHORITY_METADATA,
  HCM_DOMAIN_BRANDED_ID_TYPE_NAMES,
  HCM_DOMAIN_BRANDED_IDS,
  HCM_DOMAIN_CLOSED_VOCABULARIES,
  HCM_DOMAIN_PERMISSION_VOCABULARY,
  HCM_DOMAIN_VOCABULARY_REGISTRY,
  HCM_DOMAIN_VOCABULARY_REGISTRY_ID,
  HCM_DOMAIN_WIRE_CONTEXT,
  type HcmDomainBrandedIdEntry,
  type HcmDomainClosedVocabularyEntry,
  type HcmDomainVocabularyKind,
} from "./hcm-domain-vocabulary.registry.js";
export type {
  assertHcmDomainWireContextJsonSerializable,
  HcmDomainWireContext,
} from "./hcm-domain-wire-context.contract.js";
export {
  brandJobRequisitionId,
  brandOnboardingCaseId,
  brandPerformanceReviewId,
  type JobRequisitionId,
  type OnboardingCaseId,
  type PerformanceReviewId,
  toJobRequisitionId,
  toOnboardingCaseId,
  toPerformanceReviewId,
} from "./hcm-id.contract.js";
export {
  HCM_PERMISSION_ACTIONS,
  HCM_PERMISSION_DOMAINS,
  HCM_PERMISSION_KEY_VOCABULARY,
  type HcmPermissionAction,
  type HcmPermissionDomain,
  type HcmPermissionKey,
  toHcmPermissionKey,
} from "./hcm-permission-vocabulary.contract.js";
export {
  isOnboardingStep,
  ONBOARDING_STEPS,
  type OnboardingStep,
} from "./onboarding-step.contract.js";
export {
  isRequisitionStatus,
  REQUISITION_STATUSES,
  type RequisitionStatus,
} from "./requisition-status.contract.js";
export {
  isReviewCycleStatus,
  REVIEW_CYCLE_STATUSES,
  type ReviewCycleStatus,
} from "./review-cycle-status.contract.js";
