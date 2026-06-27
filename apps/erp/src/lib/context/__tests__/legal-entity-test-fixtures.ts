import {
  brandRequiredCountryCode,
  brandRequiredCurrencyCode,
  type CountryCode,
  type CurrencyCode,
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
