import type { OperatingContext } from "@afenda/kernel";
import { DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS } from "@afenda/kernel";
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
import { toWorkspaceApiScope } from "../to-workspace-api-scope";

const BASE_OPERATING_CONTEXT = {
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
    organizationId: null,
    teamId: null,
    projectId: null,
    membershipId: API_TEST_MEMBERSHIP_ID,
    roleId: API_TEST_ROLE_ID,
    elevations: DEFAULT_PERMISSION_GRANT_ELEVATION_FLAGS,
  },
  consolidationScope: null,
  surface: null,
  workflow: null,
} satisfies OperatingContext;

describe("toWorkspaceApiScope", () => {
  it("maps tenant and company slugs into workspace API scope", () => {
    expect(toWorkspaceApiScope(BASE_OPERATING_CONTEXT)).toEqual({
      tenantSlug: "acme",
      companySlug: "acme-co",
    });
  });

  it("includes organization slug when organization unit is present", () => {
    const operatingContext: OperatingContext = {
      ...BASE_OPERATING_CONTEXT,
      organizationUnit: {
        organizationUnitId: API_TEST_ORGANIZATION_ID,
        tenantId: API_TEST_TENANT_ID,
        companyId: API_TEST_COMPANY_ID,
        slug: "hq",
        displayName: "HQ",
        status: "active",
      },
      workspace: {
        ...BASE_OPERATING_CONTEXT.workspace,
        organizationId: API_TEST_ORGANIZATION_ID,
      },
    };

    expect(toWorkspaceApiScope(operatingContext)).toEqual({
      tenantSlug: "acme",
      companySlug: "acme-co",
      organizationSlug: "hq",
    });
  });
});
