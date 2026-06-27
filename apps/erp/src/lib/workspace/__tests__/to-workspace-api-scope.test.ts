import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import { testLegalEntityCurrencyFields } from "@/lib/context/__tests__/legal-entity-test-fixtures";
import { toWorkspaceApiScope } from "../to-workspace-api-scope";

const BASE_OPERATING_CONTEXT = {
  actor: { userId: "user-001" },
  correlationId: "corr-001",
  tenant: {
    tenantId: "tenant-001",
    slug: "acme",
    displayName: "Acme",
    status: "active",
  },
  entityGroup: null,
  legalEntity: {
    companyId: "company-001",
    tenantId: "tenant-001",
    entityGroupId: null,
    slug: "acme-co",
    legalName: "Acme Co",
    displayName: "Acme Co",
    registrationNumber: null,
    taxRegistrationNumber: null,
    ...testLegalEntityCurrencyFields(),
    reportingCurrency: null,
    companyType: "standalone",
    fiscalCalendarId: null,
    effectiveFrom: null,
    effectiveTo: null,
    status: "active",
  },
  ownershipInterests: [],
  organizationUnit: null,
  team: null,
  project: null,
  workspace: {
    tenantId: "tenant-001",
    companyId: "company-001",
    organizationId: null,
    projectId: null,
  },
  permissionScope: {
    grantScopeType: "tenant",
    tenantId: "tenant-001",
    entityGroupId: null,
    companyId: null,
    organizationId: null,
    teamId: null,
    projectId: null,
    membershipId: "membership-001",
    roleId: "role-001",
    elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  },
  consolidationScope: null,
  surface: null,
  workflow: null,
} satisfies OperatingContext;

describe("toWorkspaceApiScope", () => {
  it("maps verified operating context to slug-first client scope", () => {
    expect(toWorkspaceApiScope(BASE_OPERATING_CONTEXT)).toEqual({
      tenantSlug: "acme",
      companySlug: "acme-co",
    });
  });

  it("includes organization slug when an org unit is selected", () => {
    expect(
      toWorkspaceApiScope({
        ...BASE_OPERATING_CONTEXT,
        organizationUnit: {
          organizationUnitId: "org-001",
          tenantId: "tenant-001",
          companyId: "company-001",
          slug: "hq",
          displayName: "HQ",
          organizationUnitType: "department",
          parentOrganizationUnitId: null,
          status: "active",
          effectiveFrom: null,
          effectiveTo: null,
        },
      })
    ).toEqual({
      tenantSlug: "acme",
      companySlug: "acme-co",
      organizationSlug: "hq",
    });
  });
});
