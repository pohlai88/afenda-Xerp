import type { OperatingContext } from "@afenda/kernel";
import {
  createTestEnterpriseId,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
} from "@afenda/kernel";
import type { PermissionCheckRequest } from "@afenda/permissions";
import { describe, expect, it } from "vitest";
import {
  testLegalEntityCurrencyFields,
  testStandaloneLegalEntityProfileFields,
} from "@/lib/context/__tests__/legal-entity-test-fixtures";
import { toPermissionCheckContextFromOperatingContext } from "../to-permission-check-context.server";

const TEST_TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5T03"
);
const TEST_COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5C03"
);
const TEST_ORG_ID = createTestEnterpriseId(
  "organization",
  "01ARZ3NDEKTSV4RRFFQ69G5O03"
);
const TEST_USER_ID = createTestEnterpriseId(
  "user",
  "01ARZ3NDEKTSV4RRFFQ69G5U03"
);
const TEST_MEMBERSHIP_ID = createTestEnterpriseId(
  "membership",
  "01ARZ3NDEKTSV4RRFFQ69G5M03"
);
const TEST_ROLE_ID = createTestEnterpriseId(
  "role",
  "01ARZ3NDEKTSV4RRFFQ69G5R03"
);
const TEST_CORRELATION_ID = createTestEnterpriseId(
  "correlation",
  "01ARZ3NDEKTSV4RRFFQ69G5X03"
);

function createOperatingContextFixture(): OperatingContext {
  return {
    actor: { userId: TEST_USER_ID },
    correlationId: TEST_CORRELATION_ID,
    tenant: {
      tenantId: TEST_TENANT_ID,
      slug: "acme",
      displayName: "Acme",
      status: "active",
    },
    entityGroup: null,
    legalEntity: {
      companyId: TEST_COMPANY_ID,
      tenantId: TEST_TENANT_ID,
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
      tenantId: TEST_TENANT_ID,
      companyId: TEST_COMPANY_ID,
      organizationId: null,
      projectId: null,
    },
    permissionScope: {
      grantScopeType: "company",
      tenantId: TEST_TENANT_ID,
      entityGroupId: null,
      companyId: TEST_COMPANY_ID,
      organizationId: TEST_ORG_ID,
      teamId: null,
      projectId: null,
      membershipId: TEST_MEMBERSHIP_ID,
      roleId: TEST_ROLE_ID,
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
      tenantId: TEST_TENANT_ID,
      companyId: TEST_COMPANY_ID,
      organizationId: TEST_ORG_ID,
      workspaceId: null,
    } satisfies PermissionCheckRequest["context"]);
  });
});
