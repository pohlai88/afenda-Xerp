/**
 * PAS-001B B84 — consolidation ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/consolidation`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed consolidation-domain export surface.

export {
  CONSOLIDATION_AUDIT_ACTIONS,
  type ConsolidationAuditAction,
  isConsolidationAuditAction,
  parseConsolidationAuditAction,
} from "./consolidation-audit-actions.contract.js";
export {
  CONSOLIDATION_AUTHORITY_FINGERPRINT,
  CONSOLIDATION_AUTHORITY_PAS,
  CONSOLIDATION_CONTRACTS_OWNER,
  CONSOLIDATION_MODULE_KV_ID,
  CONSOLIDATION_PACKAGE_LIFECYCLE,
  CONSOLIDATION_PACKAGE_LIFECYCLE_PHASES,
  CONSOLIDATION_REGISTRY_ID,
  type ConsolidationPackageLifecyclePhase,
  isConsolidationPackageLifecyclePhase,
} from "./consolidation-authority.contract.js";
export {
  CONSOLIDATION_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  CONSOLIDATION_DOMAIN_VOCABULARY_POLICY,
  type ConsolidationDomainProhibitedRuntimeSurface,
} from "./consolidation-domain-vocabulary.policy.js";
export {
  type assertConsolidationDomainVocabularyRegistryIntegrity,
  CONSOLIDATION_DOMAIN_AUDIT_VOCABULARY,
  CONSOLIDATION_DOMAIN_AUTHORITY_METADATA,
  CONSOLIDATION_DOMAIN_BRANDED_ID_TYPE_NAMES,
  CONSOLIDATION_DOMAIN_BRANDED_IDS,
  CONSOLIDATION_DOMAIN_CLOSED_VOCABULARIES,
  CONSOLIDATION_DOMAIN_PERMISSION_VOCABULARY,
  CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY,
  CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY_ID,
  CONSOLIDATION_DOMAIN_WIRE_CONTEXT,
  type ConsolidationDomainBrandedIdEntry,
  type ConsolidationDomainClosedVocabularyEntry,
  type ConsolidationDomainVocabularyKind,
} from "./consolidation-domain-vocabulary.registry.js";
export type {
  assertConsolidationDomainWireContextJsonSerializable,
  ConsolidationDomainWireContext,
} from "./consolidation-domain-wire-context.contract.js";
export {
  brandConsolidationRunId,
  brandEliminationEntryId,
  brandReportingUnitId,
  type ConsolidationRunId,
  type EliminationEntryId,
  type ReportingUnitId,
  toConsolidationRunId,
  toEliminationEntryId,
  toReportingUnitId,
} from "./consolidation-id.contract.js";
export {
  CONSOLIDATION_PERMISSION_ACTIONS,
  CONSOLIDATION_PERMISSION_DOMAINS,
  CONSOLIDATION_PERMISSION_KEY_VOCABULARY,
  type ConsolidationPermissionAction,
  type ConsolidationPermissionDomain,
  type ConsolidationPermissionKey,
  toConsolidationPermissionKey,
} from "./consolidation-permission-vocabulary.contract.js";
export {
  CONSOLIDATION_RUN_STATUSES,
  type ConsolidationRunStatus,
  isConsolidationRunStatus,
} from "./consolidation-run-status.contract.js";
export {
  CONSOLIDATION_SCOPES,
  type ConsolidationScope,
  isConsolidationScope,
} from "./consolidation-scope.contract.js";
export {
  ELIMINATION_TYPES,
  type EliminationType,
  isEliminationType,
} from "./elimination-type.contract.js";
export {
  isReportingCurrencyMethod,
  REPORTING_CURRENCY_METHODS,
  type ReportingCurrencyMethod,
} from "./reporting-currency-method.contract.js";
