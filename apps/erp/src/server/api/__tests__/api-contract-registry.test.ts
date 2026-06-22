import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  assertMutationCachePolicy,
  isMutationMethod,
} from "@/server/api/contracts/api-route-policy.contract";

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
});
