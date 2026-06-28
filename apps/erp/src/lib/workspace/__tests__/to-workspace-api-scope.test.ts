import type { OperatingContext } from "@afenda/kernel";
import {
  createTestEnterpriseId,
  DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
} from "@afenda/kernel";
import { describe, expect, it } from "vitest";
import {
  testLegalEntityCurrencyFields,
  testStandaloneLegalEntityProfileFields,
} from "@/lib/context/__tests__/legal-entity-test-fixtures";
import { toWorkspaceApiScope } from "../to-workspace-api-scope";

const TEST_TENANT_ID = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5T01"
);
const TEST_COMPANY_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5C01"
);
const TEST_USER_ID = createTestEnterpriseId(
  "user",
  "01ARZ3NDEKTSV4RRFFQ69G5U01"
);
const TEST_MEMBERSHIP_ID = createTestEnterpriseId(
  "membership",
  "01ARZ3NDEKTSV4RRFFQ69G5M01"
);
const TEST_ROLE_ID = createTestEnterpriseId(
  "role",
  "01ARZ3NDEKTSV4RRFFQ69G5R01"
);
const TEST_CORRELATION_ID = createTestEnterpriseId(
  "correlation",
  "01ARZ3NDEKTSV4RRFFQ69G5X01"
);

const BASE_OPERATING_CONTEXT = {
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
    grantScopeType: "tenant",
    tenantId: TEST_TENANT_ID,
    entityGroupId: null,
    companyId: null,
    organizationId: null,
    teamId: null,
    projectId: null,
    membershipId: TEST_MEMBERSHIP_ID,
    roleId: TEST_ROLE_ID,
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
          organizationUnitId: createTestEnterpriseId(
            "organization",
            "01ARZ3NDEKTSV4RRFFQ69G5O01"
          ),
          tenantId: TEST_TENANT_ID,
          companyId: TEST_COMPANY_ID,
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
