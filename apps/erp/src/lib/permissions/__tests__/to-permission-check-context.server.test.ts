import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import type { PermissionCheckRequest } from "@afenda/permissions";
import { describe, expect, it } from "vitest";

import { toPermissionCheckContextFromOperatingContext } from "../to-permission-check-context.server";

function createOperatingContextFixture(): OperatingContext {
  return {
    actor: { userId: "user-001" },
    correlationId: "corr-permission-context",
    tenant: {
      tenantId: "tenant-001",
      slug: "acme",
      displayName: "Acme",
      status: "active",
    },
    entityGroup: null,
    legalEntity: {
      companyId: "company-a",
      tenantId: "tenant-001",
      entityGroupId: null,
      slug: "acme-co",
      legalName: "Acme Co",
      displayName: "Acme Co",
      registrationNumber: null,
      taxRegistrationNumber: null,
      countryCode: "AU",
      baseCurrency: "AUD",
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
      companyId: "company-a",
      organizationId: null,
      projectId: null,
    },
    permissionScope: {
      grantScopeType: "company",
      tenantId: "tenant-001",
      entityGroupId: null,
      companyId: "company-a",
      organizationId: "org-001",
      teamId: null,
      projectId: null,
      membershipId: "membership-001",
      roleId: "role-admin",
      elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
    },
    consolidationScope: null,
    surface: null,
    workflow: null,
  };
}

describe("toPermissionCheckContextFromOperatingContext", () => {
  it("maps operating context permission scope into permission checker context", () => {
    const operatingContext = createOperatingContextFixture();
    const context =
      toPermissionCheckContextFromOperatingContext(operatingContext);

    expect(context).toEqual({
      tenantId: "tenant-001",
      companyId: "company-a",
      organizationId: "org-001",
      workspaceId: null,
    } satisfies PermissionCheckRequest["context"]);
  });
});
