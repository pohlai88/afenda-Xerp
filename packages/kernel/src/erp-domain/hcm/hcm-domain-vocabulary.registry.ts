import { EMPLOYMENT_TYPES } from "./employment-type.contract.js";
import {
  HCM_AUDIT_ACTIONS,
  type isHcmAuditAction,
} from "./hcm-audit-actions.contract.js";
import {
  HCM_PACKAGE_LIFECYCLE,
  HCM_PACKAGE_LIFECYCLE_PHASES,
} from "./hcm-authority.contract.js";
import {
  HCM_PERMISSION_DOMAINS,
  HCM_PERMISSION_KEY_VOCABULARY,
} from "./hcm-permission-vocabulary.contract.js";
import { ONBOARDING_STEPS } from "./onboarding-step.contract.js";
import { REQUISITION_STATUSES } from "./requisition-status.contract.js";
import { REVIEW_CYCLE_STATUSES } from "./review-cycle-status.contract.js";

export const HCM_DOMAIN_VOCABULARY_REGISTRY_ID = "PAS-001B-4.8-HCM" as const;

export type HcmDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface HcmDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const HCM_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "requisition-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "requisition-status.contract.ts",
    constantExport: "REQUISITION_STATUSES",
    typeExport: "RequisitionStatus",
    narrowerExport: "isRequisitionStatus",
    valueCount: REQUISITION_STATUSES.length,
  },
  {
    id: "employment-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "employment-type.contract.ts",
    constantExport: "EMPLOYMENT_TYPES",
    typeExport: "EmploymentType",
    narrowerExport: "isEmploymentType",
    valueCount: EMPLOYMENT_TYPES.length,
  },
  {
    id: "review-cycle-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "review-cycle-status.contract.ts",
    constantExport: "REVIEW_CYCLE_STATUSES",
    typeExport: "ReviewCycleStatus",
    narrowerExport: "isReviewCycleStatus",
    valueCount: REVIEW_CYCLE_STATUSES.length,
  },
  {
    id: "onboarding-step",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "onboarding-step.contract.ts",
    constantExport: "ONBOARDING_STEPS",
    typeExport: "OnboardingStep",
    narrowerExport: "isOnboardingStep",
    valueCount: ONBOARDING_STEPS.length,
  },
] as const satisfies readonly HcmDomainClosedVocabularyEntry[];

export interface HcmDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const HCM_DOMAIN_BRANDED_IDS = [
  {
    typeName: "JobRequisitionId",
    brandFunction: "brandJobRequisitionId",
    toFunction: "toJobRequisitionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "OnboardingCaseId",
    brandFunction: "brandOnboardingCaseId",
    toFunction: "toOnboardingCaseId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "PerformanceReviewId",
    brandFunction: "brandPerformanceReviewId",
    toFunction: "toPerformanceReviewId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly HcmDomainBrandedIdEntry[];

export const HCM_DOMAIN_BRANDED_ID_TYPE_NAMES = HCM_DOMAIN_BRANDED_IDS.map(
  (entry) => entry.typeName
);

export const HCM_DOMAIN_WIRE_CONTEXT = {
  id: "hcm-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "hcm-domain-wire-context.contract.ts",
  typeExport: "HcmDomainWireContext",
  assertExport: "assertHcmDomainWireContextJsonSerializable",
} as const;

export const HCM_DOMAIN_AUDIT_VOCABULARY = {
  id: "hcm-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "hcm-audit-actions.contract.ts",
  constantExport: "HCM_AUDIT_ACTIONS",
  typeExport: "HcmAuditAction",
  narrowerExport: "isHcmAuditAction",
  valueCount: HCM_AUDIT_ACTIONS.length,
} as const;

export const HCM_DOMAIN_PERMISSION_VOCABULARY = {
  id: "hcm-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "hcm-permission-vocabulary.contract.ts",
  domainsExport: "HCM_PERMISSION_DOMAINS",
  keysExport: "HCM_PERMISSION_KEY_VOCABULARY",
  domainCount: HCM_PERMISSION_DOMAINS.length,
  keyCount: HCM_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const HCM_DOMAIN_AUTHORITY_METADATA = {
  id: "hcm-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "hcm-authority.contract.ts",
  lifecycleExport: "HCM_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "HCM_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: HCM_PACKAGE_LIFECYCLE,
  phaseCount: HCM_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const HCM_DOMAIN_VOCABULARY_REGISTRY = {
  id: HCM_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: HCM_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: HCM_DOMAIN_BRANDED_IDS,
  wireContext: HCM_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: HCM_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: HCM_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: HCM_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof HCM_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isHcmAuditAction
  >[0]
    ? true
    : never;

export type assertHcmDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
