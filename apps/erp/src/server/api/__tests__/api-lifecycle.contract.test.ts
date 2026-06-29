import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  assertLifecycleMigrationRule,
  assertRegistryLifecyclePolicy,
  buildOperationLifecycleRegistry,
  extractOperationLifecycleDeclaration,
  mapRouteLifecycleToFamily,
  resolveBreakingChangeClass,
} from "@/server/api/contracts/core";
import { isMutationMethod } from "@/server/api/contracts/method-policy.contract";

describe("ApiFamilyLifecycleStatus", () => {
  it("maps route lifecycle statuses to family vocabulary", () => {
    expect(mapRouteLifecycleToFamily("planned")).toBe("proposed");
    expect(mapRouteLifecycleToFamily("active")).toBe("active");
    expect(mapRouteLifecycleToFamily("deprecated")).toBe("deprecated");
    expect(mapRouteLifecycleToFamily("removed")).toBe("retired");
  });

  it("enforces lifecycle states on registry entries", () => {
    const declarations = assertRegistryLifecyclePolicy(API_CONTRACTS);
    expect(declarations).toHaveLength(API_CONTRACTS.length);

    for (const contract of API_CONTRACTS) {
      const declaration = extractOperationLifecycleDeclaration(contract);
      expect(declaration.familyLifecycle).toBe(
        mapRouteLifecycleToFamily(contract.lifecycle)
      );
      expect(declaration.routeLifecycle).toBe(contract.lifecycle);
    }

    const registry = buildOperationLifecycleRegistry(API_CONTRACTS);
    expect(registry.size).toBe(API_CONTRACTS.length);
  });
});

describe("ApiBreakingChangeClass", () => {
  it("requires breaking-change class on mutation operations", () => {
    for (const contract of API_CONTRACTS) {
      if (!isMutationMethod(contract.method)) {
        continue;
      }

      const breakingChange = resolveBreakingChangeClass(contract);
      expect(["additive", "breaking", "compatible", "deprecated"]).toContain(
        breakingChange
      );
    }
  });
});

describe("ApiLifecycleMigrationMetadata", () => {
  it("rejects deprecated active operations without migration metadata", () => {
    expect(() =>
      assertLifecycleMigrationRule({
        id: "internal.v1.example.get",
        lifecycle: "active",
        stability: "deprecated",
      })
    ).toThrow(/requires lifecycle migration metadata/);
  });

  it("allows deprecated active operations with migration metadata", () => {
    expect(() =>
      assertLifecycleMigrationRule({
        id: "internal.v1.example.get",
        lifecycle: "active",
        lifecycleMigration: {
          replacementOperationId: "internal.v1.example.v2.get",
          sunsetAt: "2026-12-31",
        },
        stability: "deprecated",
      })
    ).not.toThrow();
  });
});
