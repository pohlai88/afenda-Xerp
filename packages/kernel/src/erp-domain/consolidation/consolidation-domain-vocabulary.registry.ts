import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import {
  CONSOLIDATION_AUDIT_ACTIONS,
  type isConsolidationAuditAction,
} from "./consolidation-audit-actions.contract.js";
import {
  CONSOLIDATION_PACKAGE_LIFECYCLE,
  CONSOLIDATION_PACKAGE_LIFECYCLE_PHASES,
} from "./consolidation-authority.contract.js";
import {
  CONSOLIDATION_PERMISSION_DOMAINS,
  CONSOLIDATION_PERMISSION_KEY_VOCABULARY,
} from "./consolidation-permission-vocabulary.contract.js";
import { CONSOLIDATION_RUN_STATUSES } from "./consolidation-run-status.contract.js";
import { CONSOLIDATION_SCOPES } from "./consolidation-scope.contract.js";
import { ELIMINATION_TYPES } from "./elimination-type.contract.js";
import { REPORTING_CURRENCY_METHODS } from "./reporting-currency-method.contract.js";

export const CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-CONSOLIDATION" as const;

export type ConsolidationDomainVocabularyKind = ErpDomainVocabularyKind;

export type ConsolidationDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const CONSOLIDATION_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "consolidation-scope",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "consolidation-scope.contract.ts",
    constantExport: "CONSOLIDATION_SCOPES",
    typeExport: "ConsolidationScope",
    narrowerExport: "isConsolidationScope",
    valueCount: CONSOLIDATION_SCOPES.length,
  },
  {
    id: "elimination-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "elimination-type.contract.ts",
    constantExport: "ELIMINATION_TYPES",
    typeExport: "EliminationType",
    narrowerExport: "isEliminationType",
    valueCount: ELIMINATION_TYPES.length,
  },
  {
    id: "reporting-currency-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "reporting-currency-method.contract.ts",
    constantExport: "REPORTING_CURRENCY_METHODS",
    typeExport: "ReportingCurrencyMethod",
    narrowerExport: "isReportingCurrencyMethod",
    valueCount: REPORTING_CURRENCY_METHODS.length,
  },
  {
    id: "consolidation-run-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "consolidation-run-status.contract.ts",
    constantExport: "CONSOLIDATION_RUN_STATUSES",
    typeExport: "ConsolidationRunStatus",
    narrowerExport: "isConsolidationRunStatus",
    valueCount: CONSOLIDATION_RUN_STATUSES.length,
  },
] as const satisfies readonly ConsolidationDomainClosedVocabularyEntry[];

export type ConsolidationDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const CONSOLIDATION_DOMAIN_BRANDED_IDS = [
  {
    typeName: "ConsolidationRunId",
    brandFunction: "brandConsolidationRunId",
    toFunction: "toConsolidationRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "EliminationEntryId",
    brandFunction: "brandEliminationEntryId",
    toFunction: "toEliminationEntryId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ReportingUnitId",
    brandFunction: "brandReportingUnitId",
    toFunction: "toReportingUnitId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly ConsolidationDomainBrandedIdEntry[];

export const CONSOLIDATION_DOMAIN_BRANDED_ID_TYPE_NAMES =
  CONSOLIDATION_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const CONSOLIDATION_DOMAIN_WIRE_CONTEXT = {
  id: "consolidation-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "consolidation-domain-wire-context.contract.ts",
  typeExport: "ConsolidationDomainWireContext",
  assertExport: "assertConsolidationDomainWireContextJsonSerializable",
} as const;

export const CONSOLIDATION_DOMAIN_AUDIT_VOCABULARY = {
  id: "consolidation-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "consolidation-audit-actions.contract.ts",
  constantExport: "CONSOLIDATION_AUDIT_ACTIONS",
  typeExport: "ConsolidationAuditAction",
  narrowerExport: "isConsolidationAuditAction",
  valueCount: CONSOLIDATION_AUDIT_ACTIONS.length,
} as const;

export const CONSOLIDATION_DOMAIN_PERMISSION_VOCABULARY = {
  id: "consolidation-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "consolidation-permission-vocabulary.contract.ts",
  domainsExport: "CONSOLIDATION_PERMISSION_DOMAINS",
  keysExport: "CONSOLIDATION_PERMISSION_KEY_VOCABULARY",
  domainCount: CONSOLIDATION_PERMISSION_DOMAINS.length,
  keyCount: CONSOLIDATION_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const CONSOLIDATION_DOMAIN_AUTHORITY_METADATA = {
  id: "consolidation-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "consolidation-authority.contract.ts",
  lifecycleExport: "CONSOLIDATION_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "CONSOLIDATION_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: CONSOLIDATION_PACKAGE_LIFECYCLE,
  phaseCount: CONSOLIDATION_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY = {
  id: CONSOLIDATION_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: CONSOLIDATION_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: CONSOLIDATION_DOMAIN_BRANDED_IDS,
  wireContext: CONSOLIDATION_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: CONSOLIDATION_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: CONSOLIDATION_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: CONSOLIDATION_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof CONSOLIDATION_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isConsolidationAuditAction
  >[0]
    ? true
    : never;

export type assertConsolidationDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
