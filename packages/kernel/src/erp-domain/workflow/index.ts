/**
 * PAS-001B B104 — workflow ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/workflow`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed workflow-domain export surface.

export {
  APPROVAL_DECISIONS,
  type ApprovalDecision,
  isApprovalDecision,
} from "./approval-decision.contract.js";
export {
  ESCALATION_REASONS,
  type EscalationReason,
  isEscalationReason,
} from "./escalation-reason.contract.js";
export {
  isTaskPriority,
  TASK_PRIORITIES,
  type TaskPriority,
} from "./task-priority.contract.js";
export {
  isWorkflowAuditAction,
  parseWorkflowAuditAction,
  WORKFLOW_AUDIT_ACTIONS,
  type WorkflowAuditAction,
} from "./workflow-audit-actions.contract.js";
export {
  isWorkflowPackageLifecyclePhase,
  WORKFLOW_AUTHORITY_FINGERPRINT,
  WORKFLOW_AUTHORITY_PAS,
  WORKFLOW_CONTRACTS_OWNER,
  WORKFLOW_MODULE_KV_ID,
  WORKFLOW_PACKAGE_LIFECYCLE,
  WORKFLOW_PACKAGE_LIFECYCLE_PHASES,
  WORKFLOW_REGISTRY_ID,
  type WorkflowPackageLifecyclePhase,
} from "./workflow-authority.contract.js";
export {
  WORKFLOW_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  WORKFLOW_DOMAIN_VOCABULARY_POLICY,
  type WorkflowDomainProhibitedRuntimeSurface,
} from "./workflow-domain-vocabulary.policy.js";
export {
  type assertWorkflowDomainVocabularyRegistryIntegrity,
  WORKFLOW_DOMAIN_AUDIT_VOCABULARY,
  WORKFLOW_DOMAIN_AUTHORITY_METADATA,
  WORKFLOW_DOMAIN_BRANDED_ID_TYPE_NAMES,
  WORKFLOW_DOMAIN_BRANDED_IDS,
  WORKFLOW_DOMAIN_CLOSED_VOCABULARIES,
  WORKFLOW_DOMAIN_PERMISSION_VOCABULARY,
  WORKFLOW_DOMAIN_VOCABULARY_REGISTRY,
  WORKFLOW_DOMAIN_VOCABULARY_REGISTRY_ID,
  WORKFLOW_DOMAIN_WIRE_CONTEXT,
  type WorkflowDomainBrandedIdEntry,
  type WorkflowDomainClosedVocabularyEntry,
  type WorkflowDomainVocabularyKind,
} from "./workflow-domain-vocabulary.registry.js";
export type {
  assertWorkflowDomainWireContextJsonSerializable,
  WorkflowDomainWireContext,
} from "./workflow-domain-wire-context.contract.js";
export {
  type ApprovalTaskId,
  brandApprovalTaskId,
  brandEscalationCaseId,
  brandWorkflowInstanceId,
  type EscalationCaseId,
  toApprovalTaskId,
  toEscalationCaseId,
  toWorkflowInstanceId,
  type WorkflowInstanceId,
} from "./workflow-id.contract.js";
export {
  toWorkflowPermissionKey,
  WORKFLOW_PERMISSION_ACTIONS,
  WORKFLOW_PERMISSION_DOMAINS,
  WORKFLOW_PERMISSION_KEY_VOCABULARY,
  type WorkflowPermissionAction,
  type WorkflowPermissionDomain,
  type WorkflowPermissionKey,
} from "./workflow-permission-vocabulary.contract.js";
export {
  isWorkflowStatus,
  WORKFLOW_STATUSES,
  type WorkflowStatus,
} from "./workflow-status.contract.js";
