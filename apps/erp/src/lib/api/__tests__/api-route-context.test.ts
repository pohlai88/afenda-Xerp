import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import {
  testGroupCompanyLegalEntityProfileFields,
  testLegalEntityCurrencyFields,
} from "@/lib/context/__tests__/legal-entity-test-fixtures";
import {
  AFENDA_TENANT_ID_HEADER,
  AFENDA_WORKSPACE_ID_HEADER,
  toAuthorizationContextFromOperatingContext,
} from "../api-route-context";

import {
  API_TEST_ACTOR_ID,
  API_TEST_COMPANY_ID,
  API_TEST_CORRELATION_ID,
  API_TEST_ENTITY_GROUP_A_ID,
  API_TEST_ENTITY_GROUP_FALLBACK_ID,
  API_TEST_MEMBERSHIP_ID,
  API_TEST_PROJECT_ID,
  API_TEST_ROLE_ID,
  API_TEST_TEAM_ID,
  API_TEST_TENANT_ID,
} from "./api-id-test-fixtures";

const TENANT_ID = API_TEST_TENANT_ID;
const COMPANY_ID = API_TEST_COMPANY_ID;
const ENTITY_GROUP_ID = API_TEST_ENTITY_GROUP_A_ID;
const PROJECT_ID = API_TEST_PROJECT_ID;
const TEAM_ID = API_TEST_TEAM_ID;
const ACTOR_ID = API_TEST_ACTOR_ID;

function createOperatingContextFixture(
  overrides: Partial<OperatingContext> = {}
): OperatingContext {
  return {
    actor: { userId: ACTOR_ID },
    correlationId: API_TEST_CORRELATION_ID,
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
      ...testLegalEntityCurrencyFields(),
      ...testGroupCompanyLegalEntityProfileFields(),
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
      membershipId: API_TEST_MEMBERSHIP_ID,
      roleId: API_TEST_ROLE_ID,
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
          entityGroupId: API_TEST_ENTITY_GROUP_FALLBACK_ID,
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
