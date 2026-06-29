export const API_ROUTE_OWNER = "apps/erp" as const;

/** Default governance owner for undifferentiated internal v1 operations (API-016). */
export const API_GOVERNANCE_DOMAIN_OWNER = "platform-api-contract" as const;

export const API_CONTRACT_DEFAULT_OWNERSHIP = {
  consumerImpactOwner: "platform-api-contract",
  domainOwner: API_GOVERNANCE_DOMAIN_OWNER,
  lifecycleOwner: "platform-api-contract",
  technicalOwner: API_ROUTE_OWNER,
} as const satisfies {
  readonly consumerImpactOwner: string;
  readonly domainOwner: string;
  readonly lifecycleOwner: string;
  readonly technicalOwner: string;
};

export const API_GOVERNANCE_DOCUMENTATION_PATH =
  ".cursor/skills/platform-api-contract/SKILL.md" as const;

export const API_CONTRACT_REGISTRY_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-contract-registry.test.ts" as const;

export const API_ENVELOPE_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-envelope.test.ts" as const;

export const API_HANDLER_BOUNDARY_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-handler-boundary.test.ts" as const;

export const API_ROUTE_CATALOG_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-route-catalog.test.ts" as const;

export const API_OPENAPI_DOCUMENT_TEST_PATH =
  "apps/erp/src/server/api/__tests__/openapi-document.test.ts" as const;

export const API_POLICY_CONTRACTS_TEST_PATH =
  "apps/erp/src/server/api/__tests__/api-policy-contracts.test.ts" as const;

export const API_FAMILY_CONFORMANCE_SCRIPT_PATH =
  "scripts/api-contract/check-api-family-conformance.mts" as const;

export const API_FAMILY_CORE_MODULE_PATH =
  "apps/erp/src/server/api/contracts/core/index.ts" as const;

export const API_REST_OPERATION_BINDING_TEST_PATH =
  "apps/erp/src/server/api/__tests__/rest-operation-binding.test.ts" as const;

export const API_REST_SCHEMA_BINDING_TEST_PATH =
  "apps/erp/src/server/api/__tests__/rest-schema-binding.test.ts" as const;

export const ERP_API_CONSUMPTION_TEST_PATH =
  "apps/erp/src/server/api/__tests__/erp-api-consumption.test.ts" as const;

export const ERP_REST_BINDING_CONSUMPTION_TEST_PATH =
  "apps/erp/src/server/api/__tests__/erp-rest-binding-consumption.test.ts" as const;

export const ERP_API_CONTEXT_BRIDGE_TEST_PATH =
  "apps/erp/src/server/api/__tests__/erp-api-context-bridge.test.ts" as const;

export const ERP_API_AUTH_BRIDGE_TEST_PATH =
  "apps/erp/src/server/api/__tests__/erp-api-auth-bridge.test.ts" as const;

/** Attestation tests for PAS-API-001 family invariants (S1–S9). */
export const API_FAMILY_CONTRACT_TEST_PATHS = [
  "apps/erp/src/server/api/__tests__/api-operation-id.contract.test.ts",
  "apps/erp/src/server/api/__tests__/api-validation.contract.test.ts",
  "apps/erp/src/server/api/__tests__/api-validation-direction.test.ts",
  "apps/erp/src/server/api/__tests__/api-policy.contract.test.ts",
  "apps/erp/src/server/api/__tests__/api-audit-replay.contract.test.ts",
  "apps/erp/src/server/api/__tests__/api-lifecycle.contract.test.ts",
  "apps/erp/src/server/api/__tests__/api-consumer-impact-ownership.test.ts",
  "apps/erp/src/server/api/__tests__/api-exception.contract.test.ts",
  API_POLICY_CONTRACTS_TEST_PATH,
] as const;

export const DEFAULT_GOVERNED_ROUTE_TEST_PATHS = [
  API_CONTRACT_REGISTRY_TEST_PATH,
  API_ENVELOPE_TEST_PATH,
  API_HANDLER_BOUNDARY_TEST_PATH,
  API_ROUTE_CATALOG_TEST_PATH,
  API_OPENAPI_DOCUMENT_TEST_PATH,
  API_POLICY_CONTRACTS_TEST_PATH,
  API_REST_OPERATION_BINDING_TEST_PATH,
  API_REST_SCHEMA_BINDING_TEST_PATH,
  ERP_API_CONSUMPTION_TEST_PATH,
  ERP_REST_BINDING_CONSUMPTION_TEST_PATH,
  ERP_API_CONTEXT_BRIDGE_TEST_PATH,
  ERP_API_AUTH_BRIDGE_TEST_PATH,
] as const;
