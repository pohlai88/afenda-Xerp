import { describe, expect, it } from "vitest";

import {
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
  validateIsoRegistryIntegrity,
} from "../company/iso-codes.js";

describe("iso code registries", () => {
  it("documents governed subset scope", () => {
    expect(ISO3166_ALPHA2_REGISTRY_SCOPE).toBe("governed_active_subset");
    expect(ISO4217_REGISTRY_SCOPE).toBe("governed_active_subset");
    expect(ISO_REGISTRY_ONBOARDING_STEPS).toHaveLength(4);
  });

  it("passes offline registry integrity checks", () => {
    const report = assertValidIsoRegistry();

    expect(report.issues).toEqual([]);
    expect(report.countryCodeCount).toBe(ISO3166_ALPHA2_COUNTRY_CODES.size);
    expect(report.currencyCodeCount).toBe(ISO4217_CURRENCY_CODES.size);
    expect(validateIsoRegistryIntegrity().issues).toEqual([]);
  });

  it("keeps required business codes in the governed registry", () => {
    for (const code of GOVERNED_ISO_REQUIRED_COUNTRY_CODES) {
      expect(isGovernedIso3166Alpha2CountryCode(code)).toBe(true);
    }

    for (const code of GOVERNED_ISO_REQUIRED_CURRENCY_CODES) {
      expect(isGovernedIso4217CurrencyCode(code)).toBe(true);
    }
  });

  it("accepts governed Malaysia codes", () => {
    expect(isIso3166Alpha2Format("MY")).toBe(true);
    expect(isGovernedIso3166Alpha2CountryCode("MY")).toBe(true);
    expect(ISO3166_ALPHA2_COUNTRY_CODES.has("MY")).toBe(true);

    expect(isIso4217CurrencyFormat("MYR")).toBe(true);
    expect(isGovernedIso4217CurrencyCode("MYR")).toBe(true);
    expect(ISO4217_CURRENCY_CODES.has("MYR")).toBe(true);
  });

  it("rejects format-valid codes outside the governed registry", () => {
    expect(isIso3166Alpha2Format("ZZ")).toBe(true);
    expect(isGovernedIso3166Alpha2CountryCode("ZZ")).toBe(false);
    expect(ISO3166_ALPHA2_COUNTRY_CODES.has("ZZ")).toBe(false);
  });
});
