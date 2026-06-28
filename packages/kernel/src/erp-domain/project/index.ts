/**
 * PAS-001B B101 — project ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/project`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed project-domain export surface.

export {
  BILLING_METHODS,
  type BillingMethod,
  isBillingMethod,
} from "./billing-method.contract.js";
export {
  isProjectAuditAction,
  PROJECT_AUDIT_ACTIONS,
  type ProjectAuditAction,
  parseProjectAuditAction,
} from "./project-audit-actions.contract.js";
export {
  isProjectPackageLifecyclePhase,
  PROJECT_AUTHORITY_FINGERPRINT,
  PROJECT_AUTHORITY_PAS,
  PROJECT_CONTRACTS_OWNER,
  PROJECT_PACKAGE_LIFECYCLE,
  PROJECT_PACKAGE_LIFECYCLE_PHASES,
  PROJECT_REGISTRY_ID,
  type ProjectPackageLifecyclePhase,
} from "./project-authority.contract.js";
export {
  PROJECT_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  PROJECT_DOMAIN_VOCABULARY_POLICY,
  type ProjectDomainProhibitedRuntimeSurface,
} from "./project-domain-vocabulary.policy.js";
export {
  type assertProjectDomainVocabularyRegistryIntegrity,
  PROJECT_DOMAIN_AUDIT_VOCABULARY,
  PROJECT_DOMAIN_AUTHORITY_METADATA,
  PROJECT_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PROJECT_DOMAIN_BRANDED_IDS,
  PROJECT_DOMAIN_CLOSED_VOCABULARIES,
  PROJECT_DOMAIN_PERMISSION_VOCABULARY,
  PROJECT_DOMAIN_VOCABULARY_REGISTRY,
  PROJECT_DOMAIN_VOCABULARY_REGISTRY_ID,
  PROJECT_DOMAIN_WIRE_CONTEXT,
  type ProjectDomainBrandedIdEntry,
  type ProjectDomainClosedVocabularyEntry,
  type ProjectDomainVocabularyKind,
} from "./project-domain-vocabulary.registry.js";
export type {
  assertProjectDomainWireContextJsonSerializable,
  ProjectDomainWireContext,
} from "./project-domain-wire-context.contract.js";
export {
  brandProjectId,
  brandProjectTaskId,
  brandTimesheetPeriodId,
  type ProjectId,
  type ProjectTaskId,
  type TimesheetPeriodId,
  toProjectId,
  toProjectTaskId,
  toTimesheetPeriodId,
} from "./project-id.contract.js";
export {
  PROJECT_PERMISSION_ACTIONS,
  PROJECT_PERMISSION_DOMAINS,
  PROJECT_PERMISSION_KEY_VOCABULARY,
  type ProjectPermissionAction,
  type ProjectPermissionDomain,
  type ProjectPermissionKey,
  toProjectPermissionKey,
} from "./project-permission-vocabulary.contract.js";
export {
  isProjectStatus,
  PROJECT_STATUSES,
  type ProjectStatus,
} from "./project-status.contract.js";
export {
  isTaskStatus,
  TASK_STATUSES,
  type TaskStatus,
} from "./task-status.contract.js";
export {
  isTimesheetStatus,
  TIMESHEET_STATUSES,
  type TimesheetStatus,
} from "./timesheet-status.contract.js";
