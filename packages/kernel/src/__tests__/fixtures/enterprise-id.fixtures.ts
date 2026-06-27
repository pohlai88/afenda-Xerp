import { createTestEnterpriseId } from "../../identity/index.js";

export const TEST_TENANT_ID = createTestEnterpriseId("tenant");
export const TEST_COMPANY_ID = createTestEnterpriseId("company");
export const TEST_USER_ID = createTestEnterpriseId("user");
export const TEST_ROLE_ID = createTestEnterpriseId("role");
export const TEST_MEMBERSHIP_ID = createTestEnterpriseId("membership");
export const TEST_CORRELATION_ID = createTestEnterpriseId("correlation");
export const TEST_EXECUTION_ID = createTestEnterpriseId("execution");
export const TEST_PRODUCT_ID = createTestEnterpriseId("product");
export const TEST_CUSTOMER_ID = createTestEnterpriseId("customer");
export const TEST_WAREHOUSE_ID = createTestEnterpriseId("warehouse");

/** Wire-safe tenant id string for context contract tests (plain string on wire). */
export const TEST_TENANT_WIRE = TEST_TENANT_ID;
