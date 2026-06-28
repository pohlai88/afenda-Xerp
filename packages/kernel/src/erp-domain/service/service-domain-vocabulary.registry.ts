import { CASE_PRIORITIES } from "./case-priority.contract.js";
import { CASE_STATUSES } from "./case-status.contract.js";
import { RESOLUTION_TYPES } from "./resolution-type.contract.js";
import {
  type isServiceAuditAction,
  SERVICE_AUDIT_ACTIONS,
} from "./service-audit-actions.contract.js";
import {
  SERVICE_PACKAGE_LIFECYCLE,
  SERVICE_PACKAGE_LIFECYCLE_PHASES,
} from "./service-authority.contract.js";
import { SERVICE_LEVELS } from "./service-level.contract.js";
import {
  SERVICE_PERMISSION_DOMAINS,
  SERVICE_PERMISSION_KEY_VOCABULARY,
} from "./service-permission-vocabulary.contract.js";

export const SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-SERVICE" as const;

export type ServiceDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface ServiceDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const SERVICE_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "case-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "case-status.contract.ts",
    constantExport: "CASE_STATUSES",
    typeExport: "CaseStatus",
    narrowerExport: "isCaseStatus",
    valueCount: CASE_STATUSES.length,
  },
  {
    id: "case-priority",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "case-priority.contract.ts",
    constantExport: "CASE_PRIORITIES",
    typeExport: "CasePriority",
    narrowerExport: "isCasePriority",
    valueCount: CASE_PRIORITIES.length,
  },
  {
    id: "service-level",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "service-level.contract.ts",
    constantExport: "SERVICE_LEVELS",
    typeExport: "ServiceLevel",
    narrowerExport: "isServiceLevel",
    valueCount: SERVICE_LEVELS.length,
  },
  {
    id: "resolution-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "resolution-type.contract.ts",
    constantExport: "RESOLUTION_TYPES",
    typeExport: "ResolutionType",
    narrowerExport: "isResolutionType",
    valueCount: RESOLUTION_TYPES.length,
  },
] as const satisfies readonly ServiceDomainClosedVocabularyEntry[];

export interface ServiceDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const SERVICE_DOMAIN_BRANDED_IDS = [
  {
    typeName: "ServiceCaseId",
    brandFunction: "brandServiceCaseId",
    toFunction: "toServiceCaseId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ServiceContractId",
    brandFunction: "brandServiceContractId",
    toFunction: "toServiceContractId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ServiceVisitId",
    brandFunction: "brandServiceVisitId",
    toFunction: "toServiceVisitId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly ServiceDomainBrandedIdEntry[];

export const SERVICE_DOMAIN_BRANDED_ID_TYPE_NAMES =
  SERVICE_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const SERVICE_DOMAIN_WIRE_CONTEXT = {
  id: "service-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "service-domain-wire-context.contract.ts",
  typeExport: "ServiceDomainWireContext",
  assertExport: "assertServiceDomainWireContextJsonSerializable",
} as const;

export const SERVICE_DOMAIN_AUDIT_VOCABULARY = {
  id: "service-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "service-audit-actions.contract.ts",
  constantExport: "SERVICE_AUDIT_ACTIONS",
  typeExport: "ServiceAuditAction",
  narrowerExport: "isServiceAuditAction",
  valueCount: SERVICE_AUDIT_ACTIONS.length,
} as const;

export const SERVICE_DOMAIN_PERMISSION_VOCABULARY = {
  id: "service-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "service-permission-vocabulary.contract.ts",
  domainsExport: "SERVICE_PERMISSION_DOMAINS",
  keysExport: "SERVICE_PERMISSION_KEY_VOCABULARY",
  domainCount: SERVICE_PERMISSION_DOMAINS.length,
  keyCount: SERVICE_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const SERVICE_DOMAIN_AUTHORITY_METADATA = {
  id: "service-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "service-authority.contract.ts",
  lifecycleExport: "SERVICE_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "SERVICE_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: SERVICE_PACKAGE_LIFECYCLE,
  phaseCount: SERVICE_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const SERVICE_DOMAIN_VOCABULARY_REGISTRY = {
  id: SERVICE_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: SERVICE_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: SERVICE_DOMAIN_BRANDED_IDS,
  wireContext: SERVICE_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: SERVICE_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: SERVICE_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: SERVICE_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof SERVICE_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isServiceAuditAction
  >[0]
    ? true
    : never;

export type assertServiceDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
