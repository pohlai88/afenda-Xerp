/**
 * Legal Entity domain barrel — glossary-aligned alias over `company/` (table: `companies`).
 * Legacy `company/*` paths remain canonical for writes; import from here for domain clarity.
 */
export {
  assertCompanySlug,
  assertIso3166Alpha2CountryCode,
  assertIso4217CurrencyCode,
  assertIsoDateOnly,
  assertLegalEntityCompanyType,
  buildCompanyInsertRow,
  buildCompanyUpdatePatch,
  InvalidCompanySlugError,
  InvalidCountryCodeError,
  InvalidCurrencyCodeError,
  InvalidEffectiveDateError,
  InvalidLegalEntityCompanyTypeError,
  normalizeCompanySlug,
  normalizeOptionalIsoDateOnly,
  type CompanyInsertRow,
  type CompanyInsertRow as LegalEntityInsertRow,
  type CompanyUpdatePatch,
  type CompanyUpdatePatch as LegalEntityUpdatePatch,
  type CompanyWriteInput,
  type CompanyWriteInput as LegalEntityWriteInput,
} from "../company/company.contract.js";
export {
  insertCompany,
  updateCompany,
  type CompanyAuditContext,
  type CompanyAuditContext as LegalEntityAuditContext,
  type CompanyMutationResult,
  type CompanyMutationResult as LegalEntityMutationResult,
  type InsertCompanyInput,
  type InsertCompanyInput as InsertLegalEntityInput,
  type UpdateCompanyInput,
  type UpdateCompanyInput as UpdateLegalEntityInput,
} from "../company/company.service.js";
export {
  assertValidIsoRegistry,
  GOVERNED_ISO_REQUIRED_COUNTRY_CODES,
  GOVERNED_ISO_REQUIRED_CURRENCY_CODES,
  ISO_REGISTRY_ONBOARDING_STEPS,
  ISO3166_ALPHA2_COUNTRY_CODES,
  ISO3166_ALPHA2_REGISTRY_SCOPE,
  ISO4217_CURRENCY_CODES,
  ISO4217_REGISTRY_SCOPE,
  isGovernedIso3166Alpha2CountryCode,
  isGovernedIso4217CurrencyCode,
  isIso3166Alpha2Format,
  isIso4217CurrencyFormat,
  type IsoRegistryIntegrityIssue,
  type IsoRegistryIntegrityReport,
  validateIsoRegistryIntegrity,
} from "../company/iso-codes.js";
export type { CompanyLookupRow as LegalEntityLookupRow } from "../workspace/workspace-lookup.service.js";
