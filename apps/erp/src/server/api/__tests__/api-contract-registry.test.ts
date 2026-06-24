import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  GOVERNED_ROUTE_CONTRACT_EXPORTS,
} from "@/server/api/contracts/api-contract-registry";
import { validateApiContractRegistryCoverage } from "@/server/api/contracts/api-route-coverage";
import { assertIdempotencyPolicy } from "@/server/api/contracts/idempotency.contract";
import {
  assertMethodPolicy,
  assertMutationCachePolicy,
  isMutationMethod,
} from "@/server/api/contracts/method-policy.contract";
import { paginationMetaSchema } from "@/server/api/contracts/pagination.contract";

const apiRoot = join(import.meta.dirname, "../../../app/api");

describe("API contract registry", () => {
  it("uses unique contract ids", () => {
    const ids = API_CONTRACTS.map((contract) => contract.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses unique method and path pairs", () => {
    const pairs = API_CONTRACTS.map(
      (contract) => `${contract.method}:${contract.path}`
    );
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it("requires permission on protected contracts", () => {
    for (const contract of API_CONTRACTS) {
      const isPublic = contract.tags.some((tag) => tag === "public");
      if (isPublic) {
        expect("permission" in contract).toBe(false);
        continue;
      }

      expect("permission" in contract).toBe(true);
      if ("permission" in contract) {
        expect(contract.permission.permission.length).toBeGreaterThan(0);
      }
    }
  });

  it("requires audit policy on mutation contracts", () => {
    for (const contract of API_CONTRACTS) {
      if (!isMutationMethod(contract.method)) {
        continue;
      }

      if (contract.tags.some((tag) => tag === "telemetry")) {
        expect(contract.cache.kind).toBe("no-store");
        assertMutationCachePolicy(contract);
        continue;
      }

      expect(contract.cache.kind).toBe("no-store");
      assertMutationCachePolicy(contract);
      expect("audit" in contract && contract.audit?.enabled).toBe(true);
    }
  });

  it("includes version, runtime, cache, and tags on every contract", () => {
    for (const contract of API_CONTRACTS) {
      expect(contract.version).toBe("v1");
      expect(contract.runtime).toBe("nodejs");
      expect(contract.tags.length).toBeGreaterThan(0);
      expect(contract.cache).toBeDefined();
    }
  });

  it("satisfies method policy for every registered contract", () => {
    for (const contract of API_CONTRACTS) {
      expect(() => assertMethodPolicy(contract)).not.toThrow();
    }
  });

  it("satisfies idempotency policy for every registered contract", () => {
    for (const contract of API_CONTRACTS) {
      expect(() => assertIdempotencyPolicy(contract)).not.toThrow();
    }
  });

  it("requires idempotency on dashboard layout PUT", () => {
    const putContract = API_CONTRACTS.find(
      (contract) => contract.id === "internal.v1.workspace.dashboard-layout.put"
    );
    expect(putContract?.idempotency).toEqual({ mode: "required" });
  });

  it("defines serializable pagination meta contract", () => {
    expect(
      paginationMetaSchema.parse({
        hasMore: false,
        limit: 20,
        nextCursor: null,
      })
    ).toBeDefined();
  });

  it("registers every governed route handler contract", () => {
    const violations = validateApiContractRegistryCoverage({
      apiRoot,
      contractExports: GOVERNED_ROUTE_CONTRACT_EXPORTS,
      registryContracts: API_CONTRACTS,
    });

    expect(violations).toEqual([]);
  });

  it("keeps API_CONTRACTS aligned with GOVERNED_ROUTE_CONTRACT_EXPORTS", () => {
    const exportIds = Object.values(GOVERNED_ROUTE_CONTRACT_EXPORTS).map(
      (contract) => contract.id
    );
    const registryIds = API_CONTRACTS.map((contract) => contract.id);

    expect(new Set(exportIds)).toEqual(new Set(registryIds));
    expect(exportIds).toHaveLength(registryIds.length);
  });
});
