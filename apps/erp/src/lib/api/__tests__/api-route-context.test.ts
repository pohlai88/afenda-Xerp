import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { describe, expect, it } from "vitest";

import {
  AFENDA_TENANT_ID_HEADER,
  AFENDA_WORKSPACE_ID_HEADER,
  toAuthorizationContextFromOperatingContext,
} from "../api-route-context";

const TENANT_ID = "tenant-001";
const COMPANY_ID = "company-a";
const ENTITY_GROUP_ID = "group-a";
const PROJECT_ID = "project-a";
const TEAM_ID = "team-a";
const ACTOR_ID = "user-001";

function createOperatingContextFixture(
  overrides: Partial<OperatingContext> = {}
): OperatingContext {
  return {
    actor: { userId: ACTOR_ID },
    correlationId: "corr-test",
    tenant: {
      tenantId: TENANT_ID,
      slug: "acme",
      displayName: "Acme",
      status: "active",
    },
    entityGroup: null,
    legalEntity: {
      companyId: COMPANY_ID,
      tenantId: TENANT_ID,
      entityGroupId: ENTITY_GROUP_ID,
      slug: "acme-co",
      legalName: "Acme Co",
      displayName: "Acme Co",
      registrationNumber: null,
      taxRegistrationNumber: null,
      countryCode: "AU",
      baseCurrency: "AUD",
      reportingCurrency: null,
      companyType: "subsidiary",
      fiscalCalendarId: null,
      effectiveFrom: null,
      effectiveTo: null,
      status: "active",
    },
    ownershipInterests: [],
    organizationUnit: null,
    team: {
      teamId: TEAM_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationUnitId: null,
      slug: "ops",
      displayName: "Ops",
      status: "active",
    },
    project: {
      projectId: PROJECT_ID,
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationUnitId: null,
      slug: "alpha",
      displayName: "Alpha",
      status: "active",
    },
    workspace: {
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationId: null,
      projectId: PROJECT_ID,
    },
    permissionScope: {
      grantScopeType: "entity_group",
      tenantId: TENANT_ID,
      entityGroupId: ENTITY_GROUP_ID,
      companyId: COMPANY_ID,
      organizationId: null,
      teamId: TEAM_ID,
      projectId: PROJECT_ID,
      membershipId: "membership-001",
      roleId: "role-001",
      elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
    },
    consolidationScope: null,
    surface: null,
    workflow: null,
    ...overrides,
  };
}

function createRequest(headers: Record<string, string> = {}): Request {
  return new Request(
    "https://erp.local/api/internal/v1/workspace/dashboard-layout",
    {
      headers,
      method: "GET",
    }
  );
}

describe("toAuthorizationContextFromOperatingContext", () => {
  it("maps verified hierarchy dimensions from operating context", () => {
    const context = toAuthorizationContextFromOperatingContext({
      operatingContext: createOperatingContextFixture(),
      request: createRequest(),
    });

    expect(context).toEqual({
      tenantId: TENANT_ID,
      companyId: COMPANY_ID,
      organizationId: null,
      entityGroupId: ENTITY_GROUP_ID,
      projectId: PROJECT_ID,
      teamId: TEAM_ID,
      workspaceId: null,
    });
  });

  it("prefers legalEntity entityGroupId over entityGroup context fallback", () => {
    const context = toAuthorizationContextFromOperatingContext({
      operatingContext: createOperatingContextFixture({
        legalEntity: {
          ...createOperatingContextFixture().legalEntity,
          entityGroupId: ENTITY_GROUP_ID,
        },
        entityGroup: {
          entityGroupId: "group-fallback",
          tenantId: TENANT_ID,
          slug: "fallback-group",
          displayName: "Fallback Group",
          parentLegalEntityId: null,
          status: "active",
        },
      }),
      request: createRequest(),
    });

    expect(context.entityGroupId).toBe(ENTITY_GROUP_ID);
  });

  it("falls back to entityGroup context when legalEntity has no group id", () => {
    const context = toAuthorizationContextFromOperatingContext({
      operatingContext: createOperatingContextFixture({
        legalEntity: {
          ...createOperatingContextFixture().legalEntity,
          entityGroupId: null,
        },
        entityGroup: {
          entityGroupId: ENTITY_GROUP_ID,
          tenantId: TENANT_ID,
          slug: "acme-group",
          displayName: "Acme Group",
          parentLegalEntityId: null,
          status: "active",
        },
      }),
      request: createRequest(),
    });

    expect(context.entityGroupId).toBe(ENTITY_GROUP_ID);
  });

  it("reads workspaceId from governed headers when tenant header is present", () => {
    const context = toAuthorizationContextFromOperatingContext({
      operatingContext: createOperatingContextFixture(),
      request: createRequest({
        [AFENDA_TENANT_ID_HEADER]: TENANT_ID,
        [AFENDA_WORKSPACE_ID_HEADER]: "workspace-001",
      }),
    });

    expect(context.workspaceId).toBe("workspace-001");
  });
});
