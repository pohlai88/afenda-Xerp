/**
 * PAS-001B B83 — tax ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/tax`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed tax-domain export surface.

export {
  isTaxAuditAction,
  parseTaxAuditAction,
  TAX_AUDIT_ACTIONS,
  type TaxAuditAction,
} from "./tax-audit-actions.contract.js";
export {
  isTaxPackageLifecyclePhase,
  TAX_AUTHORITY_FINGERPRINT,
  TAX_AUTHORITY_PAS,
  TAX_CONTRACTS_OWNER,
  TAX_MODULE_KV_ID,
  TAX_PACKAGE_LIFECYCLE,
  TAX_PACKAGE_LIFECYCLE_PHASES,
  TAX_REGISTRY_ID,
  type TaxPackageLifecyclePhase,
} from "./tax-authority.contract.js";
export {
  isTaxCalculationMethod,
  TAX_CALCULATION_METHODS,
  type TaxCalculationMethod,
} from "./tax-calculation-method.contract.js";
export {
  isTaxDocumentStatus,
  TAX_DOCUMENT_STATUSES,
  type TaxDocumentStatus,
} from "./tax-document-status.contract.js";
export {
  TAX_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  TAX_DOMAIN_VOCABULARY_POLICY,
  type TaxDomainProhibitedRuntimeSurface,
} from "./tax-domain-vocabulary.policy.js";
export {
  type assertTaxDomainVocabularyRegistryIntegrity,
  TAX_DOMAIN_AUDIT_VOCABULARY,
  TAX_DOMAIN_AUTHORITY_METADATA,
  TAX_DOMAIN_BRANDED_ID_TYPE_NAMES,
  TAX_DOMAIN_BRANDED_IDS,
  TAX_DOMAIN_CLOSED_VOCABULARIES,
  TAX_DOMAIN_PERMISSION_VOCABULARY,
  TAX_DOMAIN_VOCABULARY_REGISTRY,
  TAX_DOMAIN_VOCABULARY_REGISTRY_ID,
  TAX_DOMAIN_WIRE_CONTEXT,
  type TaxDomainBrandedIdEntry,
  type TaxDomainClosedVocabularyEntry,
  type TaxDomainVocabularyKind,
} from "./tax-domain-vocabulary.registry.js";
export type {
  assertTaxDomainWireContextJsonSerializable,
  TaxDomainWireContext,
} from "./tax-domain-wire-context.contract.js";
export {
  brandTaxDeclarationId,
  brandTaxDeterminationContextId,
  brandWithholdingRunId,
  type TaxDeclarationId,
  type TaxDeterminationContextId,
  toTaxDeclarationId,
  toTaxDeterminationContextId,
  toWithholdingRunId,
  type WithholdingRunId,
} from "./tax-id.contract.js";
export {
  isTaxJurisdictionScope,
  TAX_JURISDICTION_SCOPES,
  type TaxJurisdictionScope,
} from "./tax-jurisdiction-scope.contract.js";
export {
  TAX_PERMISSION_ACTIONS,
  TAX_PERMISSION_DOMAINS,
  TAX_PERMISSION_KEY_VOCABULARY,
  type TaxPermissionAction,
  type TaxPermissionDomain,
  type TaxPermissionKey,
  toTaxPermissionKey,
} from "./tax-permission-vocabulary.contract.js";
export {
  isWithholdingType,
  WITHHOLDING_TYPES,
  type WithholdingType,
} from "./withholding-type.contract.js";
