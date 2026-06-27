import { describe, expect, it } from "vitest";

import type { LocalizationContext } from "../context/localization-context.contract.js";
import {
  brandCountryCode,
  brandCurrencyCode,
  brandDateFormat,
  brandLocaleCode,
  brandNumberFormat,
  brandTimezoneId,
  brandUomCode,
  createCanonicalId,
  createCustomerId,
  createEmployeeId,
  createFixtureCanonicalIdBodyGenerator,
  createProductId,
  createTenantId,
  createTestEnterpriseId,
  ENTERPRISE_ID_FAMILIES,
  FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS,
  ID_FAMILIES,
  isCanonicalEnterpriseId,
  isCanonicalEnterpriseIdForFamily,
  normalizeCompanyIdForWire,
  normalizeCorrelationIdForWire,
  normalizeMembershipIdForWire,
  normalizeRoleIdForWire,
  normalizeTenantIdForWire,
  parseCanonicalId,
  parseCompanyId,
  parseCorrelationId,
  parseCustomerId,
  parseEmployeeId,
  parseExecutionId,
  parseMembershipId,
  parseOptionalProjectId,
  parseOptionalTeamId,
  parseOptionalTenantId,
  parseProductId,
  parseRoleId,
  parseTenantId,
  toCountryCode,
  toCurrencyCode,
  toDateFormat,
  toLocaleCode,
  toMembershipId,
  toNumberFormat,
  toProjectId,
  toRoleId,
  toTeamId,
  toTenantId,
  toTimezoneId,
  toUomCode,
  tryParseCanonicalId,
} from "../identity/index.js";

const TENANT_FIXTURE = createTestEnterpriseId("tenant");
const CORRELATION_FIXTURE = createTestEnterpriseId("correlation");
const EXECUTION_FIXTURE = createTestEnterpriseId("execution");
const FIXTURE_GENERATOR = createFixtureCanonicalIdBodyGenerator();

describe("@afenda/kernel identity constitution (PAS-001 §4.1 / ADR-0021)", () => {
  it("rejects empty canonical ID", () => {
    expect(() => parseTenantId("")).toThrow();
  });

  it("parses and creates canonical enterprise ids", () => {
    const created = createTenantId(FIXTURE_GENERATOR);
    expect(isCanonicalEnterpriseId(created)).toBe(true);
    expect(parseTenantId(created)).toBe(created);

    expect(parseCustomerId(createCustomerId(FIXTURE_GENERATOR))).toMatch(
      /^cus_/
    );
    expect(parseEmployeeId(createEmployeeId(FIXTURE_GENERATOR))).toMatch(
      /^emp_/
    );
    expect(parseProductId(createProductId(FIXTURE_GENERATOR))).toMatch(/^prd_/);
  });

  it("round-trips create then parse for registry families", () => {
    for (const family of ENTERPRISE_ID_FAMILIES) {
      const created = createCanonicalId(family, FIXTURE_GENERATOR);
      expect(parseCanonicalId(created, family)).toBe(created);
    }
  });

  it("registry enforces unique enterprise prefixes", () => {
    const prefixes = ENTERPRISE_ID_FAMILIES.map(
      (family) => ID_FAMILIES[family].prefix
    );
    expect(new Set(prefixes).size).toBe(prefixes.length);
    expect(prefixes).toHaveLength(22);
  });

  it("forbids fiscal ids on the platform floor", () => {
    expect(FORBIDDEN_PLATFORM_FLOOR_ID_SYMBOLS).toEqual([
      "FiscalCalendarId",
      "FiscalPeriodId",
    ]);
  });

  it("validates family-specific canonical ids", () => {
    const customerId = createTestEnterpriseId("customer");
    expect(isCanonicalEnterpriseIdForFamily(customerId, "customer")).toBe(true);
    expect(isCanonicalEnterpriseIdForFamily(customerId, "tenant")).toBe(false);
    expect(tryParseCanonicalId("cus_invalid", "customer")).toBeNull();
  });

  it("rejects wrong prefix, wrong family, and invalid body", () => {
    const customerFixture = createTestEnterpriseId("customer");

    expect(() => parseCustomerId("prd_01ARZ3NDEKTSV4RRFFQ69G5FAV")).toThrow(
      /CustomerId must start with cus_\./
    );
    expect(() => parseTenantId(customerFixture)).toThrow(
      /TenantId must start with ten_\./
    );
    expect(() => parseTenantId("ten_invalid")).toThrow(
      /TenantId has invalid canonical ID format\./
    );
  });

  it("enforces PAS §4.1.3 family validation for product ids", () => {
    expect(parseProductId("prd_01ARZ3NDEKTSV4RRFFQ69G5FBV")).toBe(
      "prd_01ARZ3NDEKTSV4RRFFQ69G5FBV"
    );
    expect(() => parseProductId("cus_01ARZ3NDEKTSV4RRFFQ69G5FCV")).toThrow(
      /ProductId must start with prd_\./
    );
  });

  it("parses identifiers at the trust boundary", () => {
    const tenantId = parseOptionalTenantId(TENANT_FIXTURE);
    const correlationId = parseCorrelationId(CORRELATION_FIXTURE);
    const executionId = parseExecutionId(EXECUTION_FIXTURE);

    expect(toTenantId(tenantId as NonNullable<typeof tenantId>)).toBe(
      TENANT_FIXTURE
    );
    expect(normalizeCorrelationIdForWire(correlationId)).toBe(
      CORRELATION_FIXTURE
    );
    expect(executionId).toBe(EXECUTION_FIXTURE);
  });

  it("brands localization and reference primitive codes separately from enterprise ids", () => {
    const localeCode = brandLocaleCode("en-US");
    const timezoneId = brandTimezoneId("America/New_York");
    const dateFormat = brandDateFormat("yyyy-MM-dd");
    const numberFormat = brandNumberFormat("#,##0.00");
    const currencyCode = brandCurrencyCode("USD");
    const countryCode = brandCountryCode("US");
    const uomCode = brandUomCode("EA");

    expect(toLocaleCode(localeCode)).toBe("en-US");
    expect(toTimezoneId(timezoneId)).toBe("America/New_York");
    expect(toDateFormat(dateFormat)).toBe("yyyy-MM-dd");
    expect(toNumberFormat(numberFormat)).toBe("#,##0.00");
    expect(
      toCurrencyCode(currencyCode as NonNullable<typeof currencyCode>)
    ).toBe("USD");
    expect(toCountryCode(countryCode as NonNullable<typeof countryCode>)).toBe(
      "US"
    );
    expect(toUomCode(uomCode as NonNullable<typeof uomCode>)).toBe("EA");
    expect(isCanonicalEnterpriseId("en-US")).toBe(false);
  });

  it("accepts LocalizationContext as JSON-serializable wire shape", () => {
    const context: LocalizationContext = {
      localeCode: brandLocaleCode("en-GB"),
      timezoneId: brandTimezoneId("Europe/London"),
      dateFormat: brandDateFormat("dd/MM/yyyy"),
      numberFormat: brandNumberFormat("#,##0.##"),
    };

    expect(JSON.parse(JSON.stringify(context))).toEqual({
      localeCode: "en-GB",
      timezoneId: "Europe/London",
      dateFormat: "dd/MM/yyyy",
      numberFormat: "#,##0.##",
    });
  });

  it("rejects empty required identifiers", () => {
    expect(() => parseCorrelationId("   ")).toThrow();
    expect(() => parseTenantId("")).toThrow();
    expect(() => brandLocaleCode("")).toThrow("localeCode");
    expect(() => brandTimezoneId("   ")).toThrow("timezoneId");
  });

  it("returns null for optional absent identifiers", () => {
    expect(parseOptionalTenantId(null)).toBeNull();
    expect(parseOptionalTenantId(undefined)).toBeNull();
    expect(brandCurrencyCode(null)).toBeNull();
    expect(brandUomCode(null)).toBeNull();
  });

  it("exposes to* helpers for identity and access ids", () => {
    const roleId = parseRoleId(createTestEnterpriseId("role"));
    const membershipId = parseMembershipId(
      createTestEnterpriseId("membership")
    );
    const teamId = parseOptionalTeamId(createTestEnterpriseId("team"));
    const projectId = parseOptionalProjectId(createTestEnterpriseId("project"));

    expect(toRoleId(roleId)).toMatch(/^rol_/);
    expect(toMembershipId(membershipId)).toMatch(/^mem_/);
    expect(toTeamId(teamId as NonNullable<typeof teamId>)).toMatch(/^tea_/);
    expect(toProjectId(projectId as NonNullable<typeof projectId>)).toMatch(
      /^prj_/
    );
  });

  it("normalizes parsed ids to wire strings through the boundary layer", () => {
    const tenantId = parseTenantId(TENANT_FIXTURE);
    const companyId = parseCompanyId(createTestEnterpriseId("company"));
    const roleId = parseRoleId(createTestEnterpriseId("role"));
    const membershipId = parseMembershipId(
      createTestEnterpriseId("membership")
    );

    expect(normalizeTenantIdForWire(tenantId)).toBe(TENANT_FIXTURE);
    expect(normalizeTenantIdForWire(TENANT_FIXTURE)).toBe(TENANT_FIXTURE);
    expect(normalizeCompanyIdForWire(companyId)).toMatch(/^cmp_/);
    expect(normalizeCompanyIdForWire(null)).toBeNull();
    expect(normalizeRoleIdForWire(roleId)).toMatch(/^rol_/);
    expect(normalizeMembershipIdForWire(membershipId)).toMatch(/^mem_/);
  });
});
