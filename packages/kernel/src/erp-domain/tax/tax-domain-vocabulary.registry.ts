import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import {
  type isTaxAuditAction,
  TAX_AUDIT_ACTIONS,
} from "./tax-audit-actions.contract.js";
import {
  TAX_PACKAGE_LIFECYCLE,
  TAX_PACKAGE_LIFECYCLE_PHASES,
} from "./tax-authority.contract.js";
import { TAX_CALCULATION_METHODS } from "./tax-calculation-method.contract.js";
import { TAX_DOCUMENT_STATUSES } from "./tax-document-status.contract.js";
import { TAX_JURISDICTION_SCOPES } from "./tax-jurisdiction-scope.contract.js";
import {
  TAX_PERMISSION_DOMAINS,
  TAX_PERMISSION_KEY_VOCABULARY,
} from "./tax-permission-vocabulary.contract.js";
import { WITHHOLDING_TYPES } from "./withholding-type.contract.js";

export const TAX_DOMAIN_VOCABULARY_REGISTRY_ID = "PAS-001B-4.8-TAX" as const;

export type TaxDomainVocabularyKind = ErpDomainVocabularyKind;

export type TaxDomainClosedVocabularyEntry = ErpDomainClosedVocabularyEntry;

export const TAX_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "tax-jurisdiction-scope",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "tax-jurisdiction-scope.contract.ts",
    constantExport: "TAX_JURISDICTION_SCOPES",
    typeExport: "TaxJurisdictionScope",
    narrowerExport: "isTaxJurisdictionScope",
    valueCount: TAX_JURISDICTION_SCOPES.length,
  },
  {
    id: "tax-calculation-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "tax-calculation-method.contract.ts",
    constantExport: "TAX_CALCULATION_METHODS",
    typeExport: "TaxCalculationMethod",
    narrowerExport: "isTaxCalculationMethod",
    valueCount: TAX_CALCULATION_METHODS.length,
  },
  {
    id: "tax-document-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "tax-document-status.contract.ts",
    constantExport: "TAX_DOCUMENT_STATUSES",
    typeExport: "TaxDocumentStatus",
    narrowerExport: "isTaxDocumentStatus",
    valueCount: TAX_DOCUMENT_STATUSES.length,
  },
  {
    id: "withholding-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "withholding-type.contract.ts",
    constantExport: "WITHHOLDING_TYPES",
    typeExport: "WithholdingType",
    narrowerExport: "isWithholdingType",
    valueCount: WITHHOLDING_TYPES.length,
  },
] as const satisfies readonly TaxDomainClosedVocabularyEntry[];

export type TaxDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const TAX_DOMAIN_BRANDED_IDS = [
  {
    typeName: "TaxDeclarationId",
    brandFunction: "brandTaxDeclarationId",
    toFunction: "toTaxDeclarationId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "TaxDeterminationContextId",
    brandFunction: "brandTaxDeterminationContextId",
    toFunction: "toTaxDeterminationContextId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "WithholdingRunId",
    brandFunction: "brandWithholdingRunId",
    toFunction: "toWithholdingRunId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly TaxDomainBrandedIdEntry[];

export const TAX_DOMAIN_BRANDED_ID_TYPE_NAMES = TAX_DOMAIN_BRANDED_IDS.map(
  (entry) => entry.typeName
);

export const TAX_DOMAIN_WIRE_CONTEXT = {
  id: "tax-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "tax-domain-wire-context.contract.ts",
  typeExport: "TaxDomainWireContext",
  assertExport: "assertTaxDomainWireContextJsonSerializable",
} as const;

export const TAX_DOMAIN_AUDIT_VOCABULARY = {
  id: "tax-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "tax-audit-actions.contract.ts",
  constantExport: "TAX_AUDIT_ACTIONS",
  typeExport: "TaxAuditAction",
  narrowerExport: "isTaxAuditAction",
  valueCount: TAX_AUDIT_ACTIONS.length,
} as const;

export const TAX_DOMAIN_PERMISSION_VOCABULARY = {
  id: "tax-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "tax-permission-vocabulary.contract.ts",
  domainsExport: "TAX_PERMISSION_DOMAINS",
  keysExport: "TAX_PERMISSION_KEY_VOCABULARY",
  domainCount: TAX_PERMISSION_DOMAINS.length,
  keyCount: TAX_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const TAX_DOMAIN_AUTHORITY_METADATA = {
  id: "tax-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "tax-authority.contract.ts",
  lifecycleExport: "TAX_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "TAX_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: TAX_PACKAGE_LIFECYCLE,
  phaseCount: TAX_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const TAX_DOMAIN_VOCABULARY_REGISTRY = {
  id: TAX_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: TAX_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: TAX_DOMAIN_BRANDED_IDS,
  wireContext: TAX_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: TAX_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: TAX_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: TAX_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof TAX_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isTaxAuditAction
  >[0]
    ? true
    : never;

export type assertTaxDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
