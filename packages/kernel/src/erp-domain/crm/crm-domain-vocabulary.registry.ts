import { ACCOUNT_TIERS } from "./account-tier.contract.js";
import { ACTIVITY_TYPES } from "./activity-type.contract.js";
import {
  CRM_AUDIT_ACTIONS,
  type isCrmAuditAction,
} from "./crm-audit-actions.contract.js";
import {
  CRM_PACKAGE_LIFECYCLE,
  CRM_PACKAGE_LIFECYCLE_PHASES,
} from "./crm-authority.contract.js";
import {
  CRM_PERMISSION_DOMAINS,
  CRM_PERMISSION_KEY_VOCABULARY,
} from "./crm-permission-vocabulary.contract.js";
import { LEAD_STATUSES } from "./lead-status.contract.js";
import { OPPORTUNITY_STAGES } from "./opportunity-stage.contract.js";

export const CRM_DOMAIN_VOCABULARY_REGISTRY_ID = "PAS-001B-4.8-CRM" as const;

export type CrmDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface CrmDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const CRM_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "lead-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "lead-status.contract.ts",
    constantExport: "LEAD_STATUSES",
    typeExport: "LeadStatus",
    narrowerExport: "isLeadStatus",
    valueCount: LEAD_STATUSES.length,
  },
  {
    id: "opportunity-stage",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "opportunity-stage.contract.ts",
    constantExport: "OPPORTUNITY_STAGES",
    typeExport: "OpportunityStage",
    narrowerExport: "isOpportunityStage",
    valueCount: OPPORTUNITY_STAGES.length,
  },
  {
    id: "activity-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "activity-type.contract.ts",
    constantExport: "ACTIVITY_TYPES",
    typeExport: "ActivityType",
    narrowerExport: "isActivityType",
    valueCount: ACTIVITY_TYPES.length,
  },
  {
    id: "account-tier",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "account-tier.contract.ts",
    constantExport: "ACCOUNT_TIERS",
    typeExport: "AccountTier",
    narrowerExport: "isAccountTier",
    valueCount: ACCOUNT_TIERS.length,
  },
] as const satisfies readonly CrmDomainClosedVocabularyEntry[];

export interface CrmDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const CRM_DOMAIN_BRANDED_IDS = [
  {
    typeName: "LeadId",
    brandFunction: "brandLeadId",
    toFunction: "toLeadId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "OpportunityId",
    brandFunction: "brandOpportunityId",
    toFunction: "toOpportunityId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "CampaignTouchpointId",
    brandFunction: "brandCampaignTouchpointId",
    toFunction: "toCampaignTouchpointId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly CrmDomainBrandedIdEntry[];

export const CRM_DOMAIN_BRANDED_ID_TYPE_NAMES = CRM_DOMAIN_BRANDED_IDS.map(
  (entry) => entry.typeName
);

export const CRM_DOMAIN_WIRE_CONTEXT = {
  id: "crm-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "crm-domain-wire-context.contract.ts",
  typeExport: "CrmDomainWireContext",
  assertExport: "assertCrmDomainWireContextJsonSerializable",
} as const;

export const CRM_DOMAIN_AUDIT_VOCABULARY = {
  id: "crm-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "crm-audit-actions.contract.ts",
  constantExport: "CRM_AUDIT_ACTIONS",
  typeExport: "CrmAuditAction",
  narrowerExport: "isCrmAuditAction",
  valueCount: CRM_AUDIT_ACTIONS.length,
} as const;

export const CRM_DOMAIN_PERMISSION_VOCABULARY = {
  id: "crm-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "crm-permission-vocabulary.contract.ts",
  domainsExport: "CRM_PERMISSION_DOMAINS",
  keysExport: "CRM_PERMISSION_KEY_VOCABULARY",
  domainCount: CRM_PERMISSION_DOMAINS.length,
  keyCount: CRM_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const CRM_DOMAIN_AUTHORITY_METADATA = {
  id: "crm-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "crm-authority.contract.ts",
  lifecycleExport: "CRM_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "CRM_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: CRM_PACKAGE_LIFECYCLE,
  phaseCount: CRM_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const CRM_DOMAIN_VOCABULARY_REGISTRY = {
  id: CRM_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: CRM_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: CRM_DOMAIN_BRANDED_IDS,
  wireContext: CRM_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: CRM_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: CRM_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: CRM_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof CRM_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isCrmAuditAction
  >[0]
    ? true
    : never;

export type assertCrmDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
