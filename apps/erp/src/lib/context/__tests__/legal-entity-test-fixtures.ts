import {
  brandRequiredCountryCode,
  brandRequiredCurrencyCode,
  type CountryCode,
  type CurrencyCode,
  type RelationshipToHoldingCompanyType,
} from "@afenda/kernel";

/** Branded AU/AUD defaults for ERP test fixtures — trust-boundary shape only. */
export const TEST_COUNTRY_AU: CountryCode = brandRequiredCountryCode("AU");
export const TEST_CURRENCY_AUD: CurrencyCode = brandRequiredCurrencyCode("AUD");

export function testLegalEntityCurrencyFields(input?: {
  readonly baseCurrency?: string;
  readonly countryCode?: string;
}): {
  readonly baseCurrency: CurrencyCode;
  readonly countryCode: CountryCode;
} {
  return {
    countryCode: brandRequiredCountryCode(input?.countryCode ?? "AU"),
    baseCurrency: brandRequiredCurrencyCode(input?.baseCurrency ?? "AUD"),
  };
}

/** Standalone legal entity profile fields required by kernel LegalEntityContext. */
export function testStandaloneLegalEntityProfileFields(): {
  readonly companyType: "standalone";
  readonly relationshipToHoldingCompany: null;
  readonly fiscalCalendarId: null;
  readonly effectiveFrom: null;
  readonly effectiveTo: null;
  readonly status: "active";
  readonly reportingCurrency: null;
} {
  return {
    companyType: "standalone",
    relationshipToHoldingCompany: null,
    fiscalCalendarId: null,
    effectiveFrom: null,
    effectiveTo: null,
    status: "active",
    reportingCurrency: null,
  };
}

/** Group-company legal entity profile fields for consolidation hierarchy tests. */
export function testGroupCompanyLegalEntityProfileFields(input?: {
  readonly relationshipToHoldingCompany?: RelationshipToHoldingCompanyType;
}): {
  readonly companyType: "group_company";
  readonly relationshipToHoldingCompany: RelationshipToHoldingCompanyType;
  readonly fiscalCalendarId: null;
  readonly effectiveFrom: null;
  readonly effectiveTo: null;
  readonly status: "active";
  readonly reportingCurrency: null;
} {
  return {
    companyType: "group_company",
    relationshipToHoldingCompany:
      input?.relationshipToHoldingCompany ?? "subsidiary",
    fiscalCalendarId: null,
    effectiveFrom: null,
    effectiveTo: null,
    status: "active",
    reportingCurrency: null,
  };
}
