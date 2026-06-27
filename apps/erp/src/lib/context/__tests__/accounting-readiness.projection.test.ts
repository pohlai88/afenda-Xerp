import {
  brandRequiredCountryCode,
  brandRequiredCurrencyCode,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isOwnershipInterestEffectiveAt,
  type LegalEntityContext,
  type OperatingContext,
  type OrganizationUnitContext,
  type OwnershipInterestContext,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import {
  isCostCenterOrganizationUnit,
  resolveReportingCurrency,
  toAccountingDomainContext,
  toAccountingReadinessContext,
} from "../accounting-readiness.projection.js";
import type { AccountingReadinessContext } from "../accounting-readiness-context.types.js";
import { deriveConsolidationScopeContext } from "../consolidation-scope-resolution.server.js";

const SAMPLE_OWNERSHIP_INTEREST: OwnershipInterestContext = {
  ownershipInterestId: "oi-1",
  tenantId: "tenant-1",
  entityGroupId: "group-1",
  parentLegalEntityId: "parent-1",
  childLegalEntityId: "child-1",
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

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
  reportingCurrency: null,
  companyType: "standalone",
  fiscalCalendarId: null,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

describe("resolveReportingCurrency", () => {
  it("falls back to base currency when reporting currency is unset", () => {
    expect(resolveReportingCurrency(SAMPLE_LEGAL_ENTITY)).toBe("AUD");
  });

  it("prefers explicit reporting currency when present", () => {
    expect(
      resolveReportingCurrency({
        ...SAMPLE_LEGAL_ENTITY,
        reportingCurrency: "USD",
      })
    ).toBe("USD");
  });
});

describe("isCostCenterOrganizationUnit", () => {
  it("returns true for cost_center organization unit type", () => {
    const unit = {
      organizationUnitType: "cost_center",
    } satisfies Pick<OrganizationUnitContext, "organizationUnitType">;

    expect(isCostCenterOrganizationUnit(unit)).toBe(true);
  });

  it("returns false for non cost-center organization unit types", () => {
    expect(
      isCostCenterOrganizationUnit({ organizationUnitType: "department" })
    ).toBe(false);
  });
});

describe("toAccountingReadinessContext", () => {
  it("bundles required authority fields for future accounting modules", () => {
    const operatingContext = {
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
        slug: "acme-group",
        displayName: "Acme Group",
        parentLegalEntityId: null,
        status: "active",
      },
      legalEntity: SAMPLE_LEGAL_ENTITY,
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
      organizationUnit: {
        organizationUnitId: "org-1",
        tenantId: "tenant-1",
        companyId: "company-1",
        slug: "finance",
        displayName: "Finance",
        organizationUnitType: "cost_center",
        parentOrganizationUnitId: null,
        status: "active",
        effectiveFrom: null,
        effectiveTo: null,
      },
      team: null,
      project: null,
      workspace: {
        tenantId: "tenant-1",
        companyId: "company-1",
        organizationId: "org-1",
        projectId: null,
      },
      permissionScope: {
        grantScopeType: "organization",
        tenantId: "tenant-1",
        entityGroupId: "group-1",
        companyId: "company-1",
        organizationId: "org-1",
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

    const readiness = toAccountingReadinessContext(operatingContext, {
      reportingDate: "2026-06-01",
    });

    expect(readiness.baseCurrency).toBe("AUD");
    expect(readiness.reportingCurrency).toBe("AUD");
    expect(readiness.ownershipInterests).toHaveLength(1);
    expect(readiness.consolidationScope?.legalEntities).toHaveLength(1);
    expect(
      isCostCenterOrganizationUnit(
        readiness.organizationUnit ?? { organizationUnitType: "department" }
      )
    ).toBe(true);
  });
});

describe("deriveConsolidationScopeContext (ERP resolver)", () => {
  it("derives scope for ERP projection via local consolidation module", () => {
    expect(
      isOwnershipInterestEffectiveAt(SAMPLE_OWNERSHIP_INTEREST, "2026-06-01")
    ).toBe(true);

    const scope = deriveConsolidationScopeContext({
      tenantId: "tenant-1",
      entityGroupId: "group-1",
      reportingDate: "2026-06-01",
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
    });

    expect(scope.legalEntities).toHaveLength(1);
  });
});

const SAMPLE_READINESS: AccountingReadinessContext = {
  baseCurrency: "AUD",
  reportingCurrency: "USD",
  legalEntity: {
    ...SAMPLE_LEGAL_ENTITY,
    reportingCurrency: "USD",
    fiscalCalendarId: "fc-2026",
  },
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
  it("maps readiness to domain wire context with matching tenant and company ids", () => {
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
