import {
  type AccountingReadinessContext,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  type LegalEntityContext,
  type OperatingContext,
  toAccountingReadinessContext,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import { toAccountingDomainContext } from "../index.js";

const SAMPLE_LEGAL_ENTITY: LegalEntityContext = {
  companyId: "company-1",
  tenantId: "tenant-1",
  entityGroupId: "group-1",
  slug: "acme-co",
  legalName: "Acme Co",
  displayName: "Acme Co",
  registrationNumber: null,
  taxRegistrationNumber: null,
  countryCode: "AU",
  baseCurrency: "AUD",
  reportingCurrency: "USD",
  companyType: "standalone",
  fiscalCalendarId: "fc-2026",
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

const SAMPLE_OPERATING_CONTEXT = {
  actor: { userId: "user-1" },
  correlationId: "corr-1",
  tenant: {
    tenantId: "tenant-1",
    slug: "acme",
    displayName: "Acme",
    status: "active",
  },
  entityGroup: {
    entityGroupId: "group-1",
    tenantId: "tenant-1",
    displayName: "Acme Group",
    slug: "acme-group",
    parentLegalEntityId: null,
    status: "active",
  },
  legalEntity: SAMPLE_LEGAL_ENTITY,
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
  team: null,
  project: null,
  workspace: {
    tenantId: "tenant-1",
    companyId: "company-1",
    organizationId: "ou-cc-1",
    projectId: null,
  },
  permissionScope: {
    grantScopeType: "organization",
    tenantId: "tenant-1",
    entityGroupId: "group-1",
    companyId: "company-1",
    organizationId: "ou-cc-1",
    teamId: null,
    projectId: null,
    membershipId: "membership-1",
    roleId: "role-1",
    elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  },
  consolidationScope: null,
  surface: null,
  workflow: null,
} satisfies OperatingContext;

describe("toAccountingDomainContext", () => {
  it("maps kernel readiness to domain wire context with matching tenant and company ids", () => {
    const readiness: AccountingReadinessContext = toAccountingReadinessContext(
      SAMPLE_OPERATING_CONTEXT
    );
    const domain = toAccountingDomainContext(readiness);

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
    const readiness = toAccountingReadinessContext(SAMPLE_OPERATING_CONTEXT);
    const domain = toAccountingDomainContext(readiness);
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
    const readiness = toAccountingReadinessContext(SAMPLE_OPERATING_CONTEXT);
    const domain = toAccountingDomainContext(readiness);

    expect(JSON.parse(JSON.stringify(domain))).toEqual(domain);
  });

  it("nulls optional hierarchy refs when absent on readiness context", () => {
    const readiness = toAccountingReadinessContext({
      ...SAMPLE_OPERATING_CONTEXT,
      entityGroup: null,
      organizationUnit: null,
    });
    const domain = toAccountingDomainContext(readiness);

    expect(domain.entityGroupId).toBeNull();
    expect(domain.organizationUnitId).toBeNull();
  });
});
