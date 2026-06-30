import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  API_CONSUMER_IMPACT_CLASSES,
  assertActiveOperationOwnership,
  assertRegistryConsumerImpactPolicy,
  buildOperationConsumerImpactRegistry,
  buildOperationOwnershipRegistry,
  resolveConsumerImpactDeclaration,
  resolveOperationOwnership,
} from "@/server/api/contracts/core";

describe("ApiConsumerImpactClass", () => {
  it("defines serializable consumer impact classes", () => {
    expect(API_CONSUMER_IMPACT_CLASSES).toContain("internal-ui");
    expect(API_CONSUMER_IMPACT_CLASSES).toContain("partner");
  });

  it("resolves consumer impact on every active registry operation", () => {
    const declarations = assertRegistryConsumerImpactPolicy(API_CONTRACTS);
    expect(declarations).toHaveLength(API_CONTRACTS.length);

    for (const contract of API_CONTRACTS) {
      if (contract.lifecycle !== "active") {
        continue;
      }

      const declaration = resolveConsumerImpactDeclaration(contract);
      expect(declaration.consumerImpact.affected.length).toBeGreaterThan(0);

      for (const impactClass of declaration.consumerImpact.affected) {
        expect(API_CONSUMER_IMPACT_CLASSES).toContain(impactClass);
      }
    }

    const registry = buildOperationConsumerImpactRegistry(API_CONTRACTS);
    expect(registry.size).toBe(API_CONTRACTS.length);
  });

  it("requires explicit consumer impact on deprecated or breaking operations", () => {
    expect(() =>
      resolveConsumerImpactDeclaration({
        authPolicy: "session-required",
        id: "internal.v1.example.patch",
        lifecycle: "deprecated",
        method: "PATCH",
        stability: "internal-stable",
        tags: ["example"],
      })
    ).toThrow(/must declare consumer impact classes/);

    expect(() =>
      resolveConsumerImpactDeclaration({
        authPolicy: "session-required",
        consumerImpact: { affected: ["internal-ui", "partner"] },
        id: "internal.v1.example.patch",
        lifecycle: "deprecated",
        method: "PATCH",
        stability: "internal-stable",
        tags: ["example"],
      })
    ).not.toThrow();
  });
});

describe("ApiOperationOwnershipMetadata", () => {
  it("resolves four ownership dimensions for active operations", () => {
    for (const contract of API_CONTRACTS) {
      if (contract.lifecycle !== "active") {
        continue;
      }

      const ownership = assertActiveOperationOwnership(contract);
      expect(ownership.domainOwner.trim().length).toBeGreaterThan(0);
      expect(ownership.technicalOwner.trim().length).toBeGreaterThan(0);
      expect(ownership.lifecycleOwner.trim().length).toBeGreaterThan(0);
      expect(ownership.consumerImpactOwner.trim().length).toBeGreaterThan(0);
    }

    const registry = buildOperationOwnershipRegistry(API_CONTRACTS);
    expect(registry.size).toBe(API_CONTRACTS.length);
  });

  it("derives domain owner from contract tags when override omitted", () => {
    const ownership = resolveOperationOwnership({
      id: "internal.v1.inventory.products.get",
      lifecycle: "active",
      owner: "apps/erp",
      tags: ["inventory", "products"],
    });

    expect(ownership.domainOwner).toBe("inventory");
    expect(ownership.technicalOwner).toBe("apps/erp");
  });
});
