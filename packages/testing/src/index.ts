/** Shared testing utilities for the afenda-Xerp monorepo. */

export const PACKAGE_NAME = "@afenda/testing" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export {
  MOCK_EXECUTION_TEST_ACTOR_ID,
  MOCK_EXECUTION_TEST_COMPANY_ID,
  MOCK_EXECUTION_TEST_CORRELATION_ALT_ID,
  MOCK_EXECUTION_TEST_CORRELATION_ID,
  MOCK_EXECUTION_TEST_EXECUTION_ALT_ID,
  MOCK_EXECUTION_TEST_EXECUTION_ID,
  MOCK_EXECUTION_TEST_ORGANIZATION_ID,
  MOCK_EXECUTION_TEST_TENANT_ID,
  MOCK_FIXTURE_CANONICAL_ID_BODY,
  mockFixtureCanonicalIdBodyGenerator,
} from "./execution/execution-test-fixtures.js";
export {
  createMockExecutionContext,
  createMockExecutionProvider,
} from "./execution/mock-execution-provider.js";
export { createMockStorageProvider } from "./storage/mock-storage-provider.js";
