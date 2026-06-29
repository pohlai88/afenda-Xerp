/** Package authority fingerprint — bump when PAS registry contracts change materially. */
export const ERP_MODULE_FOUNDATION_AUTHORITY_FINGERPRINT =
  "ERP_MODULE_FOUNDATION-2026-06-30-v1" as const;

export const ERP_MODULE_FOUNDATION_PACKAGE_VERSION = "0.0.0" as const;

export {
  assertModuleReadiness,
  collectModuleReadinessFailures,
} from "./assert-module-readiness.js";
export type { DefineErpRuntimeModuleInput } from "./define-erp-runtime-module.js";
export { defineErpRuntimeModule } from "./define-erp-runtime-module.js";
export type { DefineModuleAuditMapInput } from "./define-module-audit-map.js";
export { defineModuleAuditMap } from "./define-module-audit-map.js";
export type { DefineModuleEventCatalogInput } from "./define-module-event-catalog.js";
export { defineModuleEventCatalog } from "./define-module-event-catalog.js";
export type { DefineModuleKnowledgeMapInput } from "./define-module-knowledge-map.js";
export { defineModuleKnowledgeMap } from "./define-module-knowledge-map.js";
export type { DefineModuleMetadataBindingInput } from "./define-module-metadata-binding.js";
export { defineModuleMetadataBinding } from "./define-module-metadata-binding.js";
export type { DefineModuleOutboxContractInput } from "./define-module-outbox-contract.js";
export { defineModuleOutboxContract } from "./define-module-outbox-contract.js";
export type { DefineModuleOwnershipInput } from "./define-module-ownership.js";
export { defineModuleOwnership } from "./define-module-ownership.js";
export type { DefineModulePermissionBindingInput } from "./define-module-permission-binding.js";
export { defineModulePermissionBinding } from "./define-module-permission-binding.js";
export type { DefineModuleReadinessInput } from "./define-module-readiness.js";
export {
  defineModuleReadiness,
  listRequiredReadinessDimensions,
} from "./define-module-readiness.js";
export type {
  ErpModuleFoundationBundle,
  ErpRuntimeModuleDefinition,
  ErpRuntimeModuleLifecycle,
  ErpRuntimeModuleStatus,
  KnowledgeStatus,
  ModuleAuditMapDefinition,
  ModuleEventCatalogDefinition,
  ModuleKnowledgeMapDefinition,
  ModuleKnowledgeTerm,
  ModuleMetadataBindingDefinition,
  ModuleMetadataSurfaceBinding,
  ModuleOutboxContractDefinition,
  ModuleOutboxEntry,
  ModuleOwnershipDefinition,
  ModuleOwnershipSurface,
  ModulePermissionBindingDefinition,
  ModuleReadinessAssertionResult,
  ModuleReadinessDefinition,
  ModuleReadinessMatrix,
  OutboxRequirement,
  ReadinessDimension,
  ReadinessLevel,
} from "./erp-module-foundation.types.js";
export {
  ERP_RUNTIME_MODULE_LIFECYCLES,
  ERP_RUNTIME_MODULE_STATUSES,
  KNOWLEDGE_STATUSES,
  MODULE_OWNERSHIP_SURFACES,
  ModuleReadinessAssertionError,
  OUTBOX_REQUIREMENTS,
  READINESS_DIMENSIONS,
  READINESS_LEVELS,
} from "./erp-module-foundation.types.js";
