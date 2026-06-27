import {
  type CompanyId,
  type CorrelationId,
  createFixtureCanonicalIdBodyGenerator,
  createTestEnterpriseId,
  type ExecutionId,
  type OrganizationId,
  type TenantId,
  type UserId,
} from "@afenda/kernel";

/** Deterministic generator for execution package tests. */
export const EXECUTION_TEST_FIXTURE_GENERATOR =
  createFixtureCanonicalIdBodyGenerator();

export const EXECUTION_TEST_ACTOR_ID: UserId = createTestEnterpriseId(
  "user",
  "01ARZ3NDEKTSV4RRFFQ69G5FAV"
);
export const EXECUTION_TEST_COMPANY_ID: CompanyId = createTestEnterpriseId(
  "company",
  "01ARZ3NDEKTSV4RRFFQ69G5FAW"
);
export const EXECUTION_TEST_TENANT_ID: TenantId = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FAX"
);
export const EXECUTION_TEST_ORGANIZATION_ID: OrganizationId =
  createTestEnterpriseId("organization", "01ARZ3NDEKTSV4RRFFQ69G5FAY");
export const EXECUTION_TEST_CORRELATION_ID: CorrelationId =
  createTestEnterpriseId("correlation", "01ARZ3NDEKTSV4RRFFQ69G5FAZ");
export const EXECUTION_TEST_EXECUTION_ID: ExecutionId = createTestEnterpriseId(
  "execution",
  "01ARZ3NDEKTSV4RRFFQ69G5FB0"
);
export const EXECUTION_TEST_EXECUTION_SERVICE_ID: ExecutionId =
  createTestEnterpriseId("execution", "01ARZ3NDEKTSV4RRFFQ69G5FB6");
export const EXECUTION_TEST_CORRELATION_AUDIT_ID: CorrelationId =
  createTestEnterpriseId("correlation", "01ARZ3NDEKTSV4RRFFQ69G5FB2");
export const EXECUTION_TEST_EXECUTION_AUDIT_ID: ExecutionId =
  createTestEnterpriseId("execution", "01ARZ3NDEKTSV4RRFFQ69G5FB3");
export const EXECUTION_TEST_CORRELATION_FAIL_ID: CorrelationId =
  createTestEnterpriseId("correlation", "01ARZ3NDEKTSV4RRFFQ69G5FB4");
export const EXECUTION_TEST_EXECUTION_FAIL_ID: ExecutionId =
  createTestEnterpriseId("execution", "01ARZ3NDEKTSV4RRFFQ69G5FB5");
export const EXECUTION_TEST_TENANT_B_ID: TenantId = createTestEnterpriseId(
  "tenant",
  "01ARZ3NDEKTSV4RRFFQ69G5FB1"
);
