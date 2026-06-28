import { APPROVAL_DECISIONS } from "./approval-decision.contract.js";
import { ESCALATION_REASONS } from "./escalation-reason.contract.js";
import { TASK_PRIORITIES } from "./task-priority.contract.js";
import {
  type isWorkflowAuditAction,
  WORKFLOW_AUDIT_ACTIONS,
} from "./workflow-audit-actions.contract.js";
import {
  WORKFLOW_PACKAGE_LIFECYCLE,
  WORKFLOW_PACKAGE_LIFECYCLE_PHASES,
} from "./workflow-authority.contract.js";
import {
  WORKFLOW_PERMISSION_DOMAINS,
  WORKFLOW_PERMISSION_KEY_VOCABULARY,
} from "./workflow-permission-vocabulary.contract.js";
import { WORKFLOW_STATUSES } from "./workflow-status.contract.js";

export const WORKFLOW_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-WORKFLOW" as const;

export type WorkflowDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface WorkflowDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const WORKFLOW_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "workflow-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "workflow-status.contract.ts",
    constantExport: "WORKFLOW_STATUSES",
    typeExport: "WorkflowStatus",
    narrowerExport: "isWorkflowStatus",
    valueCount: WORKFLOW_STATUSES.length,
  },
  {
    id: "approval-decision",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "approval-decision.contract.ts",
    constantExport: "APPROVAL_DECISIONS",
    typeExport: "ApprovalDecision",
    narrowerExport: "isApprovalDecision",
    valueCount: APPROVAL_DECISIONS.length,
  },
  {
    id: "task-priority",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "task-priority.contract.ts",
    constantExport: "TASK_PRIORITIES",
    typeExport: "TaskPriority",
    narrowerExport: "isTaskPriority",
    valueCount: TASK_PRIORITIES.length,
  },
  {
    id: "escalation-reason",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "escalation-reason.contract.ts",
    constantExport: "ESCALATION_REASONS",
    typeExport: "EscalationReason",
    narrowerExport: "isEscalationReason",
    valueCount: ESCALATION_REASONS.length,
  },
] as const satisfies readonly WorkflowDomainClosedVocabularyEntry[];

export interface WorkflowDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const WORKFLOW_DOMAIN_BRANDED_IDS = [
  {
    typeName: "WorkflowInstanceId",
    brandFunction: "brandWorkflowInstanceId",
    toFunction: "toWorkflowInstanceId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ApprovalTaskId",
    brandFunction: "brandApprovalTaskId",
    toFunction: "toApprovalTaskId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "EscalationCaseId",
    brandFunction: "brandEscalationCaseId",
    toFunction: "toEscalationCaseId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly WorkflowDomainBrandedIdEntry[];

export const WORKFLOW_DOMAIN_BRANDED_ID_TYPE_NAMES =
  WORKFLOW_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const WORKFLOW_DOMAIN_WIRE_CONTEXT = {
  id: "workflow-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "workflow-domain-wire-context.contract.ts",
  typeExport: "WorkflowDomainWireContext",
  assertExport: "assertWorkflowDomainWireContextJsonSerializable",
} as const;

export const WORKFLOW_DOMAIN_AUDIT_VOCABULARY = {
  id: "workflow-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "workflow-audit-actions.contract.ts",
  constantExport: "WORKFLOW_AUDIT_ACTIONS",
  typeExport: "WorkflowAuditAction",
  narrowerExport: "isWorkflowAuditAction",
  valueCount: WORKFLOW_AUDIT_ACTIONS.length,
} as const;

export const WORKFLOW_DOMAIN_PERMISSION_VOCABULARY = {
  id: "workflow-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "workflow-permission-vocabulary.contract.ts",
  domainsExport: "WORKFLOW_PERMISSION_DOMAINS",
  keysExport: "WORKFLOW_PERMISSION_KEY_VOCABULARY",
  domainCount: WORKFLOW_PERMISSION_DOMAINS.length,
  keyCount: WORKFLOW_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const WORKFLOW_DOMAIN_AUTHORITY_METADATA = {
  id: "workflow-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "workflow-authority.contract.ts",
  lifecycleExport: "WORKFLOW_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "WORKFLOW_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: WORKFLOW_PACKAGE_LIFECYCLE,
  phaseCount: WORKFLOW_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const WORKFLOW_DOMAIN_VOCABULARY_REGISTRY = {
  id: WORKFLOW_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: WORKFLOW_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: WORKFLOW_DOMAIN_BRANDED_IDS,
  wireContext: WORKFLOW_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: WORKFLOW_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: WORKFLOW_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: WORKFLOW_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof WORKFLOW_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isWorkflowAuditAction
  >[0]
    ? true
    : never;

export type assertWorkflowDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
