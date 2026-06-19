import { describe, expect, it } from "vitest";

import {
  ISO_REGISTRY_ONBOARDING_STEPS,
  ISO3166_ALPHA2_COUNTRY_CODES,
  ISO3166_ALPHA2_REGISTRY_SCOPE,
  ISO4217_CURRENCY_CODES,
  ISO4217_REGISTRY_SCOPE,
  isGovernedIso3166Alpha2CountryCode,
  isGovernedIso4217CurrencyCode,
  isIso3166Alpha2Format,
  isIso4217CurrencyFormat,
} from "../company/iso-codes.js";

describe("iso code registries", () => {
  it("documents governed subset scope", () => {
    expect(ISO3166_ALPHA2_REGISTRY_SCOPE).toBe("governed_active_subset");
    expect(ISO4217_REGISTRY_SCOPE).toBe("governed_active_subset");
    expect(ISO_REGISTRY_ONBOARDING_STEPS).toHaveLength(4);
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
