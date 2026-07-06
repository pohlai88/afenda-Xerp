import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { ALLOCATION_METHODS } from "./allocation-method.contract.js";

import {
  CONTROLLING_AUDIT_ACTIONS,
  type isControllingAuditAction,
} from "./controlling-audit-actions.contract.js";
import {
  CONTROLLING_PACKAGE_LIFECYCLE,
  CONTROLLING_PACKAGE_LIFECYCLE_PHASES,
} from "./controlling-authority.contract.js";
import { CONTROLLING_DOCUMENT_TYPES } from "./controlling-document-type.contract.js";
import {
  CONTROLLING_PERMISSION_DOMAINS,
  CONTROLLING_PERMISSION_KEY_VOCABULARY,
} from "./controlling-permission-vocabulary.contract.js";
import { COST_ELEMENT_CATEGORIES } from "./cost-element-category.contract.js";
import { VARIANCE_CATEGORIES } from "./variance-category.contract.js";

export const CONTROLLING_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-CONTROLLING" as const;

export type ControllingDomainVocabularyKind = ErpDomainVocabularyKind;

export type ControllingDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const CONTROLLING_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "cost-element-category",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "cost-element-category.contract.ts",
    constantExport: "COST_ELEMENT_CATEGORIES",
    typeExport: "CostElementCategory",
    narrowerExport: "isCostElementCategory",
    valueCount: COST_ELEMENT_CATEGORIES.length,
  },
  {
    id: "allocation-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "allocation-method.contract.ts",
    constantExport: "ALLOCATION_METHODS",
    typeExport: "AllocationMethod",
    narrowerExport: "isAllocationMethod",
    valueCount: ALLOCATION_METHODS.length,
  },
  {
    id: "controlling-document-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "controlling-document-type.contract.ts",
    constantExport: "CONTROLLING_DOCUMENT_TYPES",
    typeExport: "ControllingDocumentType",
    narrowerExport: "isControllingDocumentType",
    valueCount: CONTROLLING_DOCUMENT_TYPES.length,
  },
  {
    id: "variance-category",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "variance-category.contract.ts",
    constantExport: "VARIANCE_CATEGORIES",
    typeExport: "VarianceCategory",
    narrowerExport: "isVarianceCategory",
    valueCount: VARIANCE_CATEGORIES.length,
  },
] as const satisfies readonly ControllingDomainClosedVocabularyEntry[];

export type ControllingDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const CONTROLLING_DOMAIN_BRANDED_IDS = [
  {
    typeName: "CostAllocationRunId",
    brandFunction: "brandCostAllocationRunId",
    toFunction: "toCostAllocationRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ActivityTypeId",
    brandFunction: "brandActivityTypeId",
    toFunction: "toActivityTypeId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ProfitCenterReportId",
    brandFunction: "brandProfitCenterReportId",
    toFunction: "toProfitCenterReportId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly ControllingDomainBrandedIdEntry[];

export const CONTROLLING_DOMAIN_BRANDED_ID_TYPE_NAMES =
  CONTROLLING_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const CONTROLLING_DOMAIN_WIRE_CONTEXT = {
  id: "controlling-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "controlling-domain-wire-context.contract.ts",
  typeExport: "ControllingDomainWireContext",
  assertExport: "assertControllingDomainWireContextJsonSerializable",
} as const;

export const CONTROLLING_DOMAIN_AUDIT_VOCABULARY = {
  id: "controlling-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "controlling-audit-actions.contract.ts",
  constantExport: "CONTROLLING_AUDIT_ACTIONS",
  typeExport: "ControllingAuditAction",
  narrowerExport: "isControllingAuditAction",
  valueCount: CONTROLLING_AUDIT_ACTIONS.length,
} as const;

export const CONTROLLING_DOMAIN_PERMISSION_VOCABULARY = {
  id: "controlling-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "controlling-permission-vocabulary.contract.ts",
  domainsExport: "CONTROLLING_PERMISSION_DOMAINS",
  keysExport: "CONTROLLING_PERMISSION_KEY_VOCABULARY",
  domainCount: CONTROLLING_PERMISSION_DOMAINS.length,
  keyCount: CONTROLLING_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const CONTROLLING_DOMAIN_AUTHORITY_METADATA = {
  id: "controlling-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "controlling-authority.contract.ts",
  lifecycleExport: "CONTROLLING_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "CONTROLLING_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: CONTROLLING_PACKAGE_LIFECYCLE,
  phaseCount: CONTROLLING_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const CONTROLLING_DOMAIN_VOCABULARY_REGISTRY = {
  id: CONTROLLING_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: CONTROLLING_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: CONTROLLING_DOMAIN_BRANDED_IDS,
  wireContext: CONTROLLING_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: CONTROLLING_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: CONTROLLING_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: CONTROLLING_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof CONTROLLING_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isControllingAuditAction
  >[0]
    ? true
    : never;

export type assertControllingDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
