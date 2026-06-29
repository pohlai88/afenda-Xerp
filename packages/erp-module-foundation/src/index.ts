/** Package authority fingerprint — bump when PAS registry contracts change materially. */
export const ERP_MODULE_FOUNDATION_AUTHORITY_FINGERPRINT =
  "ERP_MODULE_FOUNDATION-2026-06-30-v4" as const;

export const ERP_MODULE_FOUNDATION_PACKAGE_VERSION = "0.0.0" as const;

export {
  assertModuleReadiness,
  collectModuleReadinessFailures,
  collectModuleReadinessFindings,
} from "./assert-module-readiness.js";
export {
  assertErpRuntimeModuleRegistry,
  collectErpRuntimeModuleRegistryFailures,
  collectErpRuntimeModuleRegistryFindings,
} from "./assert-module-registry-readiness.js";
export {
  assertModuleRuntimeCompleteness,
  collectModuleRuntimeCompletenessFailures,
} from "./assert-module-runtime-completeness.js";
export {
  assertModuleStatusRequirements,
  collectEvidencePathFailures,
  collectModuleStatusRequirementFailures,
} from "./assert-module-status-requirements.js";
export type { DefineErpRuntimeModuleInput } from "./define-erp-runtime-module.js";
export { defineErpRuntimeModule } from "./define-erp-runtime-module.js";
export type { DefineErpRuntimeModuleRegistryInput } from "./define-erp-runtime-module-registry.js";
export {
  assertRuntimeModuleKvCatalogParityForModule,
  defineErpRuntimeModuleRegistry,
} from "./define-erp-runtime-module-registry.js";
export type { DefineModuleAuditMapInput } from "./define-module-audit-map.js";
export { defineModuleAuditMap } from "./define-module-audit-map.js";
export type { DefineModuleContextSpineConsumerInput } from "./define-module-context-spine-consumer.js";
export { defineModuleContextSpineConsumer } from "./define-module-context-spine-consumer.js";
export type { DefineModuleDatabaseBoundaryInput } from "./define-module-database-boundary.js";
export { defineModuleDatabaseBoundary } from "./define-module-database-boundary.js";
export type { DefineModuleEventCatalogInput } from "./define-module-event-catalog.js";
export { defineModuleEventCatalog } from "./define-module-event-catalog.js";
export type { DefineModuleKnowledgeMapInput } from "./define-module-knowledge-map.js";
export { defineModuleKnowledgeMap } from "./define-module-knowledge-map.js";
export type { DefineModuleMetadataBindingInput } from "./define-module-metadata-binding.js";
export { defineModuleMetadataBinding } from "./define-module-metadata-binding.js";
export type { DefineModuleOperationCatalogInput } from "./define-module-operation-catalog.js";
export { defineModuleOperationCatalog } from "./define-module-operation-catalog.js";
export type { DefineModuleOutboxContractInput } from "./define-module-outbox-contract.js";
export { defineModuleOutboxContract } from "./define-module-outbox-contract.js";
export type { DefineModuleOwnershipInput } from "./define-module-ownership.js";
export { defineModuleOwnership } from "./define-module-ownership.js";
export type { DefineModulePermissionBindingInput } from "./define-module-permission-binding.js";
export { defineModulePermissionBinding } from "./define-module-permission-binding.js";
export type { DefineModulePolicyInput } from "./define-module-policy.js";
export { defineModulePolicy } from "./define-module-policy.js";
export type { DefineModuleReadinessInput } from "./define-module-readiness.js";
export {
  defineModuleReadiness,
  listRequiredReadinessDimensions,
} from "./define-module-readiness.js";
export type { DefineModuleRuntimeContractInput } from "./define-module-runtime-contract.js";
export { defineModuleRuntimeContract } from "./define-module-runtime-contract.js";
export type {
  AssertModuleReadinessOptions,
  AuditNamespaceMode,
  ContextRequirement,
  ErpDomainModuleKvCatalog,
  ErpModuleFoundationBundle,
  ErpRuntimeModuleDefinition,
  ErpRuntimeModuleLifecycle,
  ErpRuntimeModuleRegistryBundle,
  ErpRuntimeModuleRegistryDefinition,
  ErpRuntimeModuleStatus,
  KnowledgeStatus,
  MetadataRouteKind,
  ModuleAuditMapDefinition,
  ModuleContextSpineConsumerDefinition,
  ModuleDatabaseBoundaryDefinition,
  ModuleEventCatalogDefinition,
  ModuleKnowledgeMapDefinition,
  ModuleKnowledgeTerm,
  ModuleMetadataBindingDefinition,
  ModuleMetadataSurfaceBinding,
  ModuleOperationCatalogDefinition,
  ModuleOperationDefinition,
  ModuleOutboxContractDefinition,
  ModuleOutboxEntry,
  ModuleOwnershipDefinition,
  ModuleOwnershipSurface,
  ModulePermissionBindingDefinition,
  ModulePolicyDefinition,
  ModulePolicyRule,
  ModuleReadinessAssertionResult,
  ModuleReadinessDefinition,
  ModuleReadinessMatrix,
  ModuleReadinessReportRow,
  ModuleRegistryAssertionResult,
  ModuleRuntimeCompletenessAssertionResult,
  ModuleRuntimeContractDefinition,
  OutboxRequirement,
  PermissionParityMode,
  ReadinessDimension,
  ReadinessLevel,
} from "./erp-module-foundation.types.js";
export {
  AUDIT_NAMESPACE_MODES,
  CONTEXT_REQUIREMENTS,
  ERP_RUNTIME_MODULE_LIFECYCLES,
  ERP_RUNTIME_MODULE_STATUSES,
  KNOWLEDGE_STATUSES,
  METADATA_ROUTE_KINDS,
  MODULE_OWNERSHIP_SURFACES,
  ModuleReadinessAssertionError,
  ModuleRegistryAssertionError,
  OUTBOX_REQUIREMENTS,
  PERMISSION_PARITY_MODES,
  READINESS_DIMENSIONS,
  READINESS_LEVELS,
} from "./erp-module-foundation.types.js";
export type { ModuleReadinessFinding } from "./internal/findings.js";
export {
  buildProcurementFoundationBundle,
  PROCUREMENT_FOUNDATION_ATTESTED_EVIDENCE,
  PROCUREMENT_FOUNDATION_BUNDLE,
  PROCUREMENT_FOUNDATION_EVIDENCE,
  REFERENCE_KV_CATALOG,
  REFERENCE_PROCUREMENT_FOUNDATION_BUNDLE,
} from "./reference/build-procurement-foundation-bundle.js";
export {
  ERP_RUNTIME_MODULE_REGISTRY,
  ERP_RUNTIME_MODULE_REGISTRY_BUNDLE,
  REFERENCE_ERP_RUNTIME_MODULE,
  REFERENCE_ERP_RUNTIME_MODULE_REGISTRY,
  REFERENCE_ERP_RUNTIME_MODULE_REGISTRY_BUNDLE,
  REFERENCE_REGISTRY_BUNDLE,
} from "./reference/erp-runtime-module-registry.js";
export {
  buildModuleReadinessReportRows,
  renderModuleReadinessReport,
} from "./render-module-readiness-report.js";
export type { ModuleRegistryReadinessReportRow } from "./render-module-registry-readiness-report.js";
export {
  buildModuleRegistryReadinessReportRows,
  renderModuleRegistryReadinessReport,
} from "./render-module-registry-readiness-report.js";
export {
  parseAndValidateErpModuleFoundationBundle,
  parseErpModuleFoundationBundle,
  serializeErpModuleFoundationBundle,
} from "./serialize-foundation-bundle.js";
