import { describe, expect, it } from "vitest";

import type {
  AccountingReadinessContext,
  LegalEntityContext,
} from "../context/index.js";
import { toAccountingDomainContext } from "../contracts/accounting-domain/bridge/to-accounting-domain-context.js";
import {
  brandRequiredCountryCode,
  brandRequiredCurrencyCode,
} from "../identity/index.js";

const SAMPLE_LEGAL_ENTITY: LegalEntityContext = {
  companyId: "company-1",
  tenantId: "tenant-1",
  entityGroupId: "group-1",
  slug: "acme-co",
  legalName: "Acme Co",
  displayName: "Acme Co",
  registrationNumber: null,
  taxRegistrationNumber: null,
  countryCode: brandRequiredCountryCode("AU"),
  baseCurrency: brandRequiredCurrencyCode("AUD"),
  reportingCurrency: "USD",
  companyType: "standalone",
  fiscalCalendarId: "fc-2026",
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

const SAMPLE_READINESS: AccountingReadinessContext = {
  baseCurrency: "AUD",
  reportingCurrency: "USD",
  legalEntity: SAMPLE_LEGAL_ENTITY,
  entityGroup: {
    entityGroupId: "group-1",
    tenantId: "tenant-1",
    displayName: "Acme Group",
    slug: "acme-group",
    parentLegalEntityId: null,
    status: "active",
  },
  organizationUnit: {
    organizationUnitId: "ou-cc-1",
    tenantId: "tenant-1",
    companyId: "company-1",
    displayName: "Finance CC",
    slug: "finance-cc",
    organizationUnitType: "cost_center",
    parentOrganizationUnitId: null,
    status: "active",
    effectiveFrom: null,
    effectiveTo: null,
  },
  ownershipInterests: [],
  consolidationScope: null,
};

describe("toAccountingDomainContext", () => {
  it("maps kernel readiness to domain wire context with matching tenant and company ids", () => {
    const domain = toAccountingDomainContext(SAMPLE_READINESS);

    expect(domain.tenantId).toBe("tenant-1");
    expect(domain.companyId).toBe("company-1");
    expect(domain.baseCurrency).toBe("AUD");
    expect(domain.reportingCurrency).toBe("USD");
    expect(domain.entityGroupId).toBe("group-1");
    expect(domain.organizationUnitId).toBe("ou-cc-1");
    expect(domain.fiscalCalendarId).toBe("fc-2026");
    expect(domain.companyType).toBe("standalone");
    expect(domain.countryCode).toBe("AU");
  });

  it("does not include journal lines, balances, or posting amounts", () => {
    const domain = toAccountingDomainContext(SAMPLE_READINESS);
    const keys = Object.keys(domain).sort();

    expect(keys).toEqual([
      "baseCurrency",
      "companyId",
      "companyType",
      "countryCode",
      "entityGroupId",
      "fiscalCalendarId",
      "organizationUnitId",
      "reportingCurrency",
      "tenantId",
    ]);
  });

  it("produces JSON-serializable output at rest", () => {
    const domain = toAccountingDomainContext(SAMPLE_READINESS);

    expect(JSON.parse(JSON.stringify(domain))).toEqual(domain);
  });

  it("nulls optional hierarchy refs when absent on readiness context", () => {
    const domain = toAccountingDomainContext({
      ...SAMPLE_READINESS,
      entityGroup: null,
      organizationUnit: null,
    });

    expect(domain.entityGroupId).toBeNull();
    expect(domain.organizationUnitId).toBeNull();
  });
});
