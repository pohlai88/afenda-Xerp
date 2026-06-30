import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  API_OPERATION_REGISTRY,
} from "@/server/api/contracts/api-contract-registry";
import {
  assertRegistrySchemaAuthority,
  buildOperationSchemaAuthorityRegistry,
  extractOperationSchemaAuthority,
  isValidSchemaAuthorityRefFormat,
  parseApiSchemaAuthorityRef,
  unbrandApiSchemaAuthorityRef,
} from "@/server/api/contracts/core";

describe("ApiSchemaAuthorityRef contract", () => {
  it("accepts family schema authority pointer format", () => {
    expect(
      isValidSchemaAuthorityRefFormat(
        "apps/erp/src/server/api/contracts/health.api-contract.ts#healthResponseSchema"
      )
    ).toBe(true);
    expect(
      isValidSchemaAuthorityRefFormat(
        "apps/erp/src/server/api/contracts/health.api-contract.ts#request:none"
      )
    ).toBe(true);
  });

  it("rejects binding-specific or external schema locators", () => {
    expect(
      isValidSchemaAuthorityRefFormat("openapi/components/HealthResponse")
    ).toBe(false);
    expect(
      isValidSchemaAuthorityRefFormat("https://example.com/schema.json")
    ).toBe(false);
    expect(isValidSchemaAuthorityRefFormat("")).toBe(false);
  });

  it("brands valid refs at the trust boundary", () => {
    const ref = parseApiSchemaAuthorityRef(
      "apps/erp/src/server/api/contracts/health.api-contract.ts#healthResponseSchema"
    );
    expect(unbrandApiSchemaAuthorityRef(ref)).toContain(
      "#healthResponseSchema"
    );
  });

  it("throws when parsing invalid refs", () => {
    expect(() => parseApiSchemaAuthorityRef("invalid-ref")).toThrow(
      /Invalid ApiSchemaAuthorityRef format/
    );
  });
});

describe("ApiOperationSchemaAuthority", () => {
  it("extracts declared-before-runtime authority from contracts", () => {
    const healthContract = API_CONTRACTS.find(
      (contract) => contract.id === "internal.v1.health.get"
    );
    expect(healthContract).toBeDefined();
    if (healthContract === undefined) {
      return;
    }

    const authority = extractOperationSchemaAuthority(healthContract);
    expect(authority.authorityKind).toBe("declared-before-runtime");
    expect(unbrandApiSchemaAuthorityRef(authority.response)).toContain(
      "healthResponseSchema"
    );
  });

  it("validates schema authority for every active registry operation", () => {
    const authorities = assertRegistrySchemaAuthority(API_CONTRACTS);
    expect(authorities).toHaveLength(API_CONTRACTS.length);
    for (const authority of authorities) {
      expect(authority.authorityKind).toBe("declared-before-runtime");
    }
  });

  it("builds an operation-id keyed schema authority registry", () => {
    const registry = buildOperationSchemaAuthorityRegistry(API_CONTRACTS);
    expect(registry.size).toBe(API_CONTRACTS.length);

    for (const entry of API_OPERATION_REGISTRY) {
      const authority = registry.get(entry.contract.id);
      expect(authority).toBeDefined();
      expect(authority?.authorityKind).toBe("declared-before-runtime");
    }
  });
});
