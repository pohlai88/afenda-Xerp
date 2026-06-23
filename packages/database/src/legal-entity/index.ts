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
  type CompanyInsertRow,
  type CompanyInsertRow as LegalEntityInsertRow,
  type CompanyUpdatePatch,
  type CompanyUpdatePatch as LegalEntityUpdatePatch,
  type CompanyWriteInput,
  type CompanyWriteInput as LegalEntityWriteInput,
  InvalidCompanySlugError,
  InvalidCountryCodeError,
  InvalidCurrencyCodeError,
  InvalidEffectiveDateError,
  InvalidLegalEntityCompanyTypeError,
  normalizeCompanySlug,
  normalizeOptionalIsoDateOnly,
} from "../company/company.contract.js";
export {
  type CompanyAuditContext,
  type CompanyAuditContext as LegalEntityAuditContext,
  type CompanyMutationResult,
  type CompanyMutationResult as LegalEntityMutationResult,
  type InsertCompanyInput,
  type InsertCompanyInput as InsertLegalEntityInput,
  insertCompany,
  type UpdateCompanyInput,
  type UpdateCompanyInput as UpdateLegalEntityInput,
  updateCompany,
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
  type IsoRegistryIntegrityIssue,
  type IsoRegistryIntegrityReport,
  isGovernedIso3166Alpha2CountryCode,
  isGovernedIso4217CurrencyCode,
  isIso3166Alpha2Format,
  isIso4217CurrencyFormat,
  validateIsoRegistryIntegrity,
} from "../company/iso-codes.js";
export type { CompanyLookupRow as LegalEntityLookupRow } from "../workspace/workspace-lookup.service.js";
