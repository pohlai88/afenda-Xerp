import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { DISPOSITION_CODES } from "./disposition-code.contract.js";

import { INSPECTION_RESULT_STATUSES } from "./inspection-result-status.contract.js";
import { INSPECTION_TYPES } from "./inspection-type.contract.js";
import {
  type isQualityAuditAction,
  QUALITY_AUDIT_ACTIONS,
} from "./quality-audit-actions.contract.js";
import {
  QUALITY_PACKAGE_LIFECYCLE,
  QUALITY_PACKAGE_LIFECYCLE_PHASES,
} from "./quality-authority.contract.js";
import { QUALITY_NOTIFICATION_PRIORITIES } from "./quality-notification-priority.contract.js";
import {
  QUALITY_PERMISSION_DOMAINS,
  QUALITY_PERMISSION_KEY_VOCABULARY,
} from "./quality-permission-vocabulary.contract.js";

export const QUALITY_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-QUALITY" as const;

export type QualityDomainVocabularyKind = ErpDomainVocabularyKind;

export type QualityDomainClosedVocabularyEntry = ErpDomainClosedVocabularyEntry;

export const QUALITY_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "inspection-result-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "inspection-result-status.contract.ts",
    constantExport: "INSPECTION_RESULT_STATUSES",
    typeExport: "InspectionResultStatus",
    narrowerExport: "isInspectionResultStatus",
    valueCount: INSPECTION_RESULT_STATUSES.length,
  },
  {
    id: "quality-notification-priority",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "quality-notification-priority.contract.ts",
    constantExport: "QUALITY_NOTIFICATION_PRIORITIES",
    typeExport: "QualityNotificationPriority",
    narrowerExport: "isQualityNotificationPriority",
    valueCount: QUALITY_NOTIFICATION_PRIORITIES.length,
  },
  {
    id: "inspection-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "inspection-type.contract.ts",
    constantExport: "INSPECTION_TYPES",
    typeExport: "InspectionType",
    narrowerExport: "isInspectionType",
    valueCount: INSPECTION_TYPES.length,
  },
  {
    id: "disposition-code",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "disposition-code.contract.ts",
    constantExport: "DISPOSITION_CODES",
    typeExport: "DispositionCode",
    narrowerExport: "isDispositionCode",
    valueCount: DISPOSITION_CODES.length,
  },
] as const satisfies readonly QualityDomainClosedVocabularyEntry[];

export type QualityDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const QUALITY_DOMAIN_BRANDED_IDS = [
  {
    typeName: "QualityInspectionId",
    brandFunction: "brandQualityInspectionId",
    toFunction: "toQualityInspectionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "QualityNotificationId",
    brandFunction: "brandQualityNotificationId",
    toFunction: "toQualityNotificationId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "SampleLotId",
    brandFunction: "brandSampleLotId",
    toFunction: "toSampleLotId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly QualityDomainBrandedIdEntry[];

export const QUALITY_DOMAIN_BRANDED_ID_TYPE_NAMES =
  QUALITY_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const QUALITY_DOMAIN_WIRE_CONTEXT = {
  id: "quality-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "quality-domain-wire-context.contract.ts",
  typeExport: "QualityDomainWireContext",
  assertExport: "assertQualityDomainWireContextJsonSerializable",
} as const;

export const QUALITY_DOMAIN_AUDIT_VOCABULARY = {
  id: "quality-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "quality-audit-actions.contract.ts",
  constantExport: "QUALITY_AUDIT_ACTIONS",
  typeExport: "QualityAuditAction",
  narrowerExport: "isQualityAuditAction",
  valueCount: QUALITY_AUDIT_ACTIONS.length,
} as const;

export const QUALITY_DOMAIN_PERMISSION_VOCABULARY = {
  id: "quality-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "quality-permission-vocabulary.contract.ts",
  domainsExport: "QUALITY_PERMISSION_DOMAINS",
  keysExport: "QUALITY_PERMISSION_KEY_VOCABULARY",
  domainCount: QUALITY_PERMISSION_DOMAINS.length,
  keyCount: QUALITY_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const QUALITY_DOMAIN_AUTHORITY_METADATA = {
  id: "quality-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "quality-authority.contract.ts",
  lifecycleExport: "QUALITY_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "QUALITY_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: QUALITY_PACKAGE_LIFECYCLE,
  phaseCount: QUALITY_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const QUALITY_DOMAIN_VOCABULARY_REGISTRY = {
  id: QUALITY_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: QUALITY_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: QUALITY_DOMAIN_BRANDED_IDS,
  wireContext: QUALITY_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: QUALITY_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: QUALITY_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: QUALITY_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof QUALITY_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isQualityAuditAction
  >[0]
    ? true
    : never;

export type assertQualityDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
