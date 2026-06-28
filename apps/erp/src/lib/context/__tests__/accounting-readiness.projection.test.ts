import {
  brandRequiredCurrencyCode,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  isOwnershipInterestEffectiveAt,
  type LegalEntityWireContext,
  type OperatingContext,
  type OrganizationUnitContext,
  type OwnershipInterestContext,
  type OwnershipInterestWireContext,
  parseLegalEntityContext,
  parseOwnershipInterestContext,
  parseUnknownEntityGroupContext,
  parseUnknownOrganizationUnitContext,
  parseUnknownPermissionScopeContext,
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

const SAMPLE_OWNERSHIP_INTEREST_WIRE: OwnershipInterestWireContext = {
  ownershipInterestId: "own_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  parentLegalEntityId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  childLegalEntityId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FBV",
  ownershipPercentage: 100,
  votingPercentage: 100,
  controlType: "control",
  consolidationTreatment: "full_consolidation",
  nonControllingInterestApplicable: false,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

const SAMPLE_OWNERSHIP_INTEREST: OwnershipInterestContext =
  parseOwnershipInterestContext(SAMPLE_OWNERSHIP_INTEREST_WIRE);

const SAMPLE_LEGAL_ENTITY_WIRE: LegalEntityWireContext = {
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  slug: "acme-co",
  legalName: "Acme Co",
  displayName: "Acme Co",
  registrationNumber: null,
  taxRegistrationNumber: null,
  countryCode: "AU",
  baseCurrency: "AUD",
  reportingCurrency: null,
  companyType: "standalone",
  relationshipToHoldingCompany: null,
  fiscalCalendarId: null,
  effectiveFrom: "2026-01-01",
  effectiveTo: null,
  status: "active",
};

const SAMPLE_LEGAL_ENTITY = parseLegalEntityContext(SAMPLE_LEGAL_ENTITY_WIRE);

const SAMPLE_ENTITY_GROUP = parseUnknownEntityGroupContext({
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  slug: "acme-group",
  displayName: "Acme Group",
  parentLegalEntityId: null,
  status: "active",
});

const SAMPLE_ORGANIZATION_UNIT = parseUnknownOrganizationUnitContext({
  organizationUnitId: "org_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  slug: "finance-cc",
  displayName: "Finance CC",
  organizationUnitType: "cost_center",
  parentOrganizationUnitId: null,
  status: "active",
  effectiveFrom: null,
  effectiveTo: null,
});

const SAMPLE_PERMISSION_SCOPE = parseUnknownPermissionScopeContext({
  grantScopeType: "organization",
  tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  entityGroupId: "egp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  organizationId: "org_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  teamId: null,
  projectId: null,
  membershipId: "mem_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  roleId: "rol_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
});

describe("resolveReportingCurrency", () => {
  it("falls back to base currency when reporting currency is unset", () => {
    expect(resolveReportingCurrency(SAMPLE_LEGAL_ENTITY)).toBe("AUD");
  });

  it("prefers explicit reporting currency when present", () => {
    expect(
      resolveReportingCurrency({
        ...SAMPLE_LEGAL_ENTITY,
        reportingCurrency: brandRequiredCurrencyCode("USD"),
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

const TENANT_WIRE_ID = "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV";

describe("toAccountingReadinessContext", () => {
  it("bundles required authority fields for future accounting modules", () => {
    const operatingContext = {
      actor: { userId: "user-1" },
      correlationId: "corr-1",
      tenant: {
        tenantId: TENANT_WIRE_ID,
        slug: "acme",
        displayName: "Acme",
        status: "active",
      },
      entityGroup: SAMPLE_ENTITY_GROUP,
      legalEntity: SAMPLE_LEGAL_ENTITY,
      ownershipInterests: [SAMPLE_OWNERSHIP_INTEREST],
      organizationUnit: SAMPLE_ORGANIZATION_UNIT,
      team: null,
      project: null,
      workspace: {
        tenantId: TENANT_WIRE_ID,
        companyId: "cmp_01ARZ3NDEKTSV4RRFFQ69G5FAV",
        organizationId: "org_01ARZ3NDEKTSV4RRFFQ69G5FAV",
        projectId: null,
      },
      permissionScope: SAMPLE_PERMISSION_SCOPE,
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
      tenantId: SAMPLE_OWNERSHIP_INTEREST.tenantId,
      entityGroupId: SAMPLE_OWNERSHIP_INTEREST.entityGroupId,
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
    reportingCurrency: brandRequiredCurrencyCode("USD"),
    fiscalCalendarId: "fc-2026",
  },
  entityGroup: SAMPLE_ENTITY_GROUP,
  organizationUnit: SAMPLE_ORGANIZATION_UNIT,
  ownershipInterests: [],
  consolidationScope: null,
};

describe("toAccountingDomainContext", () => {
  it("maps readiness to domain wire context with matching tenant and company ids", () => {
    const domain = toAccountingDomainContext(SAMPLE_READINESS);

    expect(domain.tenantId).toBe(SAMPLE_LEGAL_ENTITY_WIRE.tenantId);
    expect(domain.companyId).toBe(SAMPLE_LEGAL_ENTITY_WIRE.companyId);
    expect(domain.baseCurrency).toBe("AUD");
    expect(domain.reportingCurrency).toBe("USD");
    expect(domain.entityGroupId).toBe("egp_01ARZ3NDEKTSV4RRFFQ69G5FAV");
    expect(domain.organizationUnitId).toBe("org_01ARZ3NDEKTSV4RRFFQ69G5FAV");
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
