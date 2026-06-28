import { createTestEnterpriseId } from "@afenda/kernel";

/** Canonical enterprise IDs for ERP API ingress and authorization tests. */
export const API_TEST_TENANT_ID = createTestEnterpriseId("tenant");
export const API_TEST_COMPANY_ID = createTestEnterpriseId("company");
export const API_TEST_COMPANY_B_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);
export const API_TEST_ENTITY_GROUP_A_ID = createTestEnterpriseId("entityGroup");
export const API_TEST_ENTITY_GROUP_B_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FBV"
);
export const API_TEST_ENTITY_GROUP_FALLBACK_ID = createTestEnterpriseId(
  "entityGroup",
  "01ARZ3NDEKTSV4RRFFQ69G5FCV"
);
export const API_TEST_ACTOR_ID = createTestEnterpriseId("user");
export const API_TEST_ROLE_ID = createTestEnterpriseId("role");
export const API_TEST_ROLE_READONLY_ID = createTestEnterpriseId(
  "role",
  "01ARZ3NDEKTSV4RRFFQ69G5FCV"
);
export const API_TEST_MEMBERSHIP_ID = createTestEnterpriseId("membership");
export const API_TEST_CORRELATION_ID = createTestEnterpriseId("correlation");
export const API_TEST_ORGANIZATION_ID = createTestEnterpriseId("organization");
export const API_TEST_PROJECT_ID = createTestEnterpriseId("project");
export const API_TEST_TEAM_ID = createTestEnterpriseId("team");
export const API_TEST_CUSTOMER_ID = createTestEnterpriseId("customer");
export const API_TEST_PRODUCT_ID = createTestEnterpriseId("product");
export const API_TEST_EMPLOYEE_ID = createTestEnterpriseId("employee");
export const API_TEST_COMPANY_UNKNOWN_ID = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FDV"
);
