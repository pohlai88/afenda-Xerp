export const API_ROUTE_OWNER = "apps/erp" as const;

export const API_GOVERNANCE_DOCUMENTATION_PATH =
  "docs/architecture/afenda-rest-api-governance.md" as const;

export const API_CONTRACT_REGISTRY_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-contract-registry.test.ts" as const;

export const API_ENVELOPE_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-envelope.test.ts" as const;

export const API_HANDLER_BOUNDARY_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts" as const;

export const API_ROUTE_CATALOG_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-route-catalog.test.ts" as const;

export const DEFAULT_GOVERNED_ROUTE_TEST_PATHS = [
  API_CONTRACT_REGISTRY_TEST_PATH,
  API_ENVELOPE_TEST_PATH,
  API_HANDLER_BOUNDARY_TEST_PATH,
] as const;
