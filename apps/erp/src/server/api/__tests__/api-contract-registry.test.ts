import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  GOVERNED_ROUTE_CONTRACT_EXPORTS,
} from "@/server/api/contracts/api-contract-registry";
import { validateApiRouteCatalogCompleteness } from "@/server/api/contracts/api-route-catalog";
import { validateApiContractRegistryCoverage } from "@/server/api/contracts/api-route-coverage";
import {
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "@/server/api/contracts/auth-policy.contract";
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
      if (isPublicAuthPolicy(contract.authPolicy)) {
        expect("permission" in contract).toBe(false);
        continue;
      }

      if (
        requiresSessionAuth(contract.authPolicy) &&
        !("permission" in contract) &&
        contract.id === "internal.v1.auth.memberships.get"
      ) {
        continue;
      }

      expect("permission" in contract).toBe(true);
      if ("permission" in contract) {
        expect(contract.permission.permission.length).toBeGreaterThan(0);
      }
    }
  });

  it("requires governance metadata on every contract", () => {
    expect(validateApiRouteCatalogCompleteness(API_CONTRACTS)).toEqual([]);
  });

  it("requires non-empty summary on every contract", () => {
    for (const contract of API_CONTRACTS) {
      expect(contract.summary.trim().length).toBeGreaterThan(0);
    }
  });

  it("requires authPolicy, contextPolicy, lifecycle, and stability on every contract", () => {
    for (const contract of API_CONTRACTS) {
      expect(contract.authPolicy.length).toBeGreaterThan(0);
      expect(contract.contextPolicy.length).toBeGreaterThan(0);
      expect(contract.lifecycle).toBe("active");
      expect(contract.stability).toBe("internal-stable");
      expect(contract.rateLimitPolicy.length).toBeGreaterThan(0);
      expect(contract.owner).toBe("apps/erp");
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

  it("declares cursor pagination on audit events GET contract", () => {
    const auditEventsContract = API_CONTRACTS.find(
      (contract) => contract.id === "internal.v1.system-admin.audit-events.get"
    );

    expect(auditEventsContract?.pagination).toEqual({ mode: "cursor" });
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

  it("keeps API_CONTRACTS JSON-serializable for catalog and OpenAPI pipelines", () => {
    const serialized = JSON.parse(JSON.stringify(API_CONTRACTS));
    expect(serialized).toHaveLength(API_CONTRACTS.length);
    for (const contract of API_CONTRACTS) {
      expect(typeof contract.id).toBe("string");
      expect(typeof contract.path).toBe("string");
    }
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
