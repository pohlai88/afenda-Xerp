import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { BILLING_METHODS } from "./billing-method.contract.js";

import {
  type isProjectAuditAction,
  PROJECT_AUDIT_ACTIONS,
} from "./project-audit-actions.contract.js";
import {
  PROJECT_PACKAGE_LIFECYCLE,
  PROJECT_PACKAGE_LIFECYCLE_PHASES,
} from "./project-authority.contract.js";
import {
  PROJECT_PERMISSION_DOMAINS,
  PROJECT_PERMISSION_KEY_VOCABULARY,
} from "./project-permission-vocabulary.contract.js";
import { PROJECT_STATUSES } from "./project-status.contract.js";
import { TASK_STATUSES } from "./task-status.contract.js";
import { TIMESHEET_STATUSES } from "./timesheet-status.contract.js";

export const PROJECT_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-PROJECT" as const;

export type ProjectDomainVocabularyKind = ErpDomainVocabularyKind;

export type ProjectDomainClosedVocabularyEntry = ErpDomainClosedVocabularyEntry;

export const PROJECT_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "project-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "project-status.contract.ts",
    constantExport: "PROJECT_STATUSES",
    typeExport: "ProjectStatus",
    narrowerExport: "isProjectStatus",
    valueCount: PROJECT_STATUSES.length,
  },
  {
    id: "task-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "task-status.contract.ts",
    constantExport: "TASK_STATUSES",
    typeExport: "TaskStatus",
    narrowerExport: "isTaskStatus",
    valueCount: TASK_STATUSES.length,
  },
  {
    id: "billing-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "billing-method.contract.ts",
    constantExport: "BILLING_METHODS",
    typeExport: "BillingMethod",
    narrowerExport: "isBillingMethod",
    valueCount: BILLING_METHODS.length,
  },
  {
    id: "timesheet-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "timesheet-status.contract.ts",
    constantExport: "TIMESHEET_STATUSES",
    typeExport: "TimesheetStatus",
    narrowerExport: "isTimesheetStatus",
    valueCount: TIMESHEET_STATUSES.length,
  },
] as const satisfies readonly ProjectDomainClosedVocabularyEntry[];

export type ProjectDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const PROJECT_DOMAIN_BRANDED_IDS = [
  {
    typeName: "ProjectId",
    brandFunction: "brandProjectId",
    toFunction: "toProjectId",
    forbiddenOnPlatformFloor: true,
  },
  {
    typeName: "ProjectTaskId",
    brandFunction: "brandProjectTaskId",
    toFunction: "toProjectTaskId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "TimesheetPeriodId",
    brandFunction: "brandTimesheetPeriodId",
    toFunction: "toTimesheetPeriodId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly ProjectDomainBrandedIdEntry[];

export const PROJECT_DOMAIN_BRANDED_ID_TYPE_NAMES =
  PROJECT_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const PROJECT_DOMAIN_WIRE_CONTEXT = {
  id: "project-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "project-domain-wire-context.contract.ts",
  typeExport: "ProjectDomainWireContext",
  assertExport: "assertProjectDomainWireContextJsonSerializable",
} as const;

export const PROJECT_DOMAIN_AUDIT_VOCABULARY = {
  id: "project-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "project-audit-actions.contract.ts",
  constantExport: "PROJECT_AUDIT_ACTIONS",
  typeExport: "ProjectAuditAction",
  narrowerExport: "isProjectAuditAction",
  valueCount: PROJECT_AUDIT_ACTIONS.length,
} as const;

export const PROJECT_DOMAIN_PERMISSION_VOCABULARY = {
  id: "project-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "project-permission-vocabulary.contract.ts",
  domainsExport: "PROJECT_PERMISSION_DOMAINS",
  keysExport: "PROJECT_PERMISSION_KEY_VOCABULARY",
  domainCount: PROJECT_PERMISSION_DOMAINS.length,
  keyCount: PROJECT_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const PROJECT_DOMAIN_AUTHORITY_METADATA = {
  id: "project-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "project-authority.contract.ts",
  lifecycleExport: "PROJECT_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "PROJECT_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: PROJECT_PACKAGE_LIFECYCLE,
  phaseCount: PROJECT_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const PROJECT_DOMAIN_VOCABULARY_REGISTRY = {
  id: PROJECT_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: PROJECT_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: PROJECT_DOMAIN_BRANDED_IDS,
  wireContext: PROJECT_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: PROJECT_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: PROJECT_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: PROJECT_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof PROJECT_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isProjectAuditAction
  >[0]
    ? true
    : never;

export type assertProjectDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
