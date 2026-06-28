import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
import type { PermissionCheckRequest } from "@afenda/permissions";
import { describe, expect, it } from "vitest";
import {
  API_TEST_ACTOR_ID,
  API_TEST_COMPANY_ID,
  API_TEST_CORRELATION_ID,
  API_TEST_MEMBERSHIP_ID,
  API_TEST_ORGANIZATION_ID,
  API_TEST_ROLE_ID,
  API_TEST_TENANT_ID,
} from "@/lib/api/__tests__/api-id-test-fixtures";
import {
  testLegalEntityCurrencyFields,
  testStandaloneLegalEntityProfileFields,
} from "@/lib/context/__tests__/legal-entity-test-fixtures";
import { toPermissionCheckContextFromOperatingContext } from "../to-permission-check-context.server";

function createOperatingContextFixture(): OperatingContext {
  return {
    actor: { userId: API_TEST_ACTOR_ID },
    correlationId: API_TEST_CORRELATION_ID,
    tenant: {
      tenantId: API_TEST_TENANT_ID,
      slug: "acme",
      displayName: "Acme",
      status: "active",
    },
    entityGroup: null,
    legalEntity: {
      companyId: API_TEST_COMPANY_ID,
      tenantId: API_TEST_TENANT_ID,
      entityGroupId: null,
      slug: "acme-co",
      legalName: "Acme Co",
      displayName: "Acme Co",
      registrationNumber: null,
      taxRegistrationNumber: null,
      ...testLegalEntityCurrencyFields(),
      ...testStandaloneLegalEntityProfileFields(),
    },
    ownershipInterests: [],
    organizationUnit: null,
    team: null,
    project: null,
    workspace: {
      tenantId: API_TEST_TENANT_ID,
      companyId: API_TEST_COMPANY_ID,
      organizationId: null,
      projectId: null,
    },
    permissionScope: {
      grantScopeType: "company",
      tenantId: API_TEST_TENANT_ID,
      entityGroupId: null,
      companyId: API_TEST_COMPANY_ID,
      organizationId: API_TEST_ORGANIZATION_ID,
      teamId: null,
      projectId: null,
      membershipId: API_TEST_MEMBERSHIP_ID,
      roleId: API_TEST_ROLE_ID,
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
      tenantId: API_TEST_TENANT_ID,
      companyId: API_TEST_COMPANY_ID,
      organizationId: API_TEST_ORGANIZATION_ID,
      workspaceId: null,
    } satisfies PermissionCheckRequest["context"]);
  });
});
