import { describe, expect, it } from "vitest";

import {
  assertCompanySlug,
  assertIso3166Alpha2CountryCode,
  assertIso4217CurrencyCode,
  assertIsoDateOnly,
  assertLegalEntityCompanyType,
  buildCompanyInsertRow,
  InvalidCompanySlugError,
  InvalidCountryCodeError,
  InvalidCurrencyCodeError,
  InvalidEffectiveDateError,
  InvalidLegalEntityCompanyTypeError,
  normalizeCompanySlug,
} from "../company/company.contract.js";
import { LEGAL_ENTITY_COMPANY_TYPES as DATABASE_COMPANY_TYPES } from "../database.types.js";

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
    expect(() => assertIso3166Alpha2CountryCode("ZZ")).toThrow(
      InvalidCountryCodeError
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
      companyType: "subsidiary",
      effectiveFrom: "2024-01-15",
    });

    expect(row).toMatchObject({
      slug: "my-company",
      legalName: "ACME Sdn Bhd",
      displayName: "ACME",
      baseCurrency: "MYR",
      countryCode: "MY",
      registrationNumber: "123456-A",
      companyType: "subsidiary",
      fiscalCalendarId: null,
      effectiveFrom: "2024-01-15",
      effectiveTo: null,
      status: "active",
    });
  });

  it("defaults companyType to standalone and validates governed types", () => {
    expect(assertLegalEntityCompanyType("holding")).toBe("holding");
    expect(() => assertLegalEntityCompanyType("invalid")).toThrow(
      InvalidLegalEntityCompanyTypeError
    );

    const row = buildCompanyInsertRow({
      tenantId: "00000000-0000-4000-8000-000000000001",
      slug: "standalone-co",
      legalName: "Standalone Co",
      displayName: "Standalone",
      baseCurrency: "USD",
      countryCode: "US",
    });

    expect(row.companyType).toBe("standalone");
  });

  it("validates ISO calendar effective dates", () => {
    expect(assertIsoDateOnly("2025-06-01")).toBe("2025-06-01");
    expect(() => assertIsoDateOnly("06/01/2025")).toThrow(
      InvalidEffectiveDateError
    );
  });

  it("keeps legal entity company types aligned with kernel vocabulary", () => {
    const kernelAlignedCompanyTypes = [
      "holding",
      "parent",
      "subsidiary",
      "associate",
      "joint_venture",
      "minority_interest",
      "branch_entity",
      "standalone",
    ] as const;

    expect(DATABASE_COMPANY_TYPES).toEqual(kernelAlignedCompanyTypes);
  });
});
