import { describe, expect, it } from "vitest";

import {
  assertCompanySlug,
  assertIso3166Alpha2CountryCode,
  assertIso4217CurrencyCode,
  buildCompanyInsertRow,
  InvalidCompanySlugError,
  InvalidCountryCodeError,
  InvalidCurrencyCodeError,
  normalizeCompanySlug,
} from "../company/company.contract.js";

describe("company contract", () => {
  it("normalizes slugs to lowercase kebab-case", () => {
    expect(normalizeCompanySlug("My Company")).toBe("my-company");
    expect(normalizeCompanySlug("  ACME_Corp  ")).toBe("acme-corp");
    expect(assertCompanySlug("My Company")).toBe("my-company");
  });

  it("rejects invalid slugs", () => {
    expect(() => assertCompanySlug("")).toThrow(InvalidCompanySlugError);
    expect(() => assertCompanySlug("---")).toThrow(InvalidCompanySlugError);
  });

  it("validates governed ISO country and currency codes", () => {
    expect(assertIso3166Alpha2CountryCode("my")).toBe("MY");
    expect(assertIso4217CurrencyCode("myr")).toBe("MYR");
    expect(() => assertIso3166Alpha2CountryCode("Malaysia")).toThrow(
      InvalidCountryCodeError
    );
    expect(() => assertIso4217CurrencyCode("Ringgit")).toThrow(
      InvalidCurrencyCodeError
    );
  });

  it("builds normalized insert rows", () => {
    const row = buildCompanyInsertRow({
      tenantId: "00000000-0000-4000-8000-000000000001",
      slug: "My Company",
      legalName: " ACME Sdn Bhd ",
      displayName: " ACME ",
      baseCurrency: "myr",
      countryCode: "my",
      registrationNumber: " 123456-A ",
    });

    expect(row).toMatchObject({
      slug: "my-company",
      legalName: "ACME Sdn Bhd",
      displayName: "ACME",
      baseCurrency: "MYR",
      countryCode: "MY",
      registrationNumber: "123456-A",
      status: "active",
    });
  });
});
