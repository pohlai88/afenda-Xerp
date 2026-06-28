/**
 * PAS-001B B81 — controlling ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/controlling`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed controlling-domain export surface.

export {
  ALLOCATION_METHODS,
  type AllocationMethod,
  isAllocationMethod,
} from "./allocation-method.contract.js";
export {
  CONTROLLING_AUDIT_ACTIONS,
  type ControllingAuditAction,
  isControllingAuditAction,
  parseControllingAuditAction,
} from "./controlling-audit-actions.contract.js";
export {
  CONTROLLING_AUTHORITY_FINGERPRINT,
  CONTROLLING_AUTHORITY_PAS,
  CONTROLLING_CONTRACTS_OWNER,
  CONTROLLING_PACKAGE_LIFECYCLE,
  CONTROLLING_PACKAGE_LIFECYCLE_PHASES,
  CONTROLLING_REGISTRY_ID,
  type ControllingPackageLifecyclePhase,
  isControllingPackageLifecyclePhase,
} from "./controlling-authority.contract.js";
export {
  CONTROLLING_DOCUMENT_TYPES,
  type ControllingDocumentType,
  isControllingDocumentType,
} from "./controlling-document-type.contract.js";
export {
  CONTROLLING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  CONTROLLING_DOMAIN_VOCABULARY_POLICY,
  type ControllingDomainProhibitedRuntimeSurface,
} from "./controlling-domain-vocabulary.policy.js";
export {
  type assertControllingDomainVocabularyRegistryIntegrity,
  CONTROLLING_DOMAIN_AUDIT_VOCABULARY,
  CONTROLLING_DOMAIN_AUTHORITY_METADATA,
  CONTROLLING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  CONTROLLING_DOMAIN_BRANDED_IDS,
  CONTROLLING_DOMAIN_CLOSED_VOCABULARIES,
  CONTROLLING_DOMAIN_PERMISSION_VOCABULARY,
  CONTROLLING_DOMAIN_VOCABULARY_REGISTRY,
  CONTROLLING_DOMAIN_VOCABULARY_REGISTRY_ID,
  CONTROLLING_DOMAIN_WIRE_CONTEXT,
  type ControllingDomainBrandedIdEntry,
  type ControllingDomainClosedVocabularyEntry,
  type ControllingDomainVocabularyKind,
} from "./controlling-domain-vocabulary.registry.js";
export type {
  assertControllingDomainWireContextJsonSerializable,
  ControllingDomainWireContext,
} from "./controlling-domain-wire-context.contract.js";
export {
  type ActivityTypeId,
  brandActivityTypeId,
  brandCostAllocationRunId,
  brandProfitCenterReportId,
  type CostAllocationRunId,
  type ProfitCenterReportId,
  toActivityTypeId,
  toCostAllocationRunId,
  toProfitCenterReportId,
} from "./controlling-id.contract.js";
export {
  CONTROLLING_PERMISSION_ACTIONS,
  CONTROLLING_PERMISSION_DOMAINS,
  CONTROLLING_PERMISSION_KEY_VOCABULARY,
  type ControllingPermissionAction,
  type ControllingPermissionDomain,
  type ControllingPermissionKey,
  toControllingPermissionKey,
} from "./controlling-permission-vocabulary.contract.js";
export {
  COST_ELEMENT_CATEGORIES,
  type CostElementCategory,
  isCostElementCategory,
} from "./cost-element-category.contract.js";
export {
  isVarianceCategory,
  VARIANCE_CATEGORIES,
  type VarianceCategory,
} from "./variance-category.contract.js";
