import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import { isPublicAuthPolicy } from "@/server/api/contracts/auth-policy.contract";
import {
  assertRegistryValidationDirection,
  buildOperationValidationDirectionRegistry,
  classifyOperationExposure,
  classifyOperationInteraction,
  resolveValidationDirectionPolicy,
} from "@/server/api/contracts/core";
import { isMutationMethod } from "@/server/api/contracts/method-policy.contract";

describe("ApiValidationDirectionPolicy", () => {
  it("requires ingress validation on protected operations", () => {
    for (const contract of API_CONTRACTS) {
      if (isPublicAuthPolicy(contract.authPolicy)) {
        continue;
      }

      const policy = resolveValidationDirectionPolicy(contract);
      expect(policy.ingress).toEqual({
        phase: "before-business-execution",
        required: true,
      });
    }
  });

  it("requires egress validation on mutating operations", () => {
    for (const contract of API_CONTRACTS) {
      if (!isMutationMethod(contract.method)) {
        continue;
      }

      const policy = resolveValidationDirectionPolicy(contract);
      expect(policy.egress).toEqual({
        phase: "before-serialization",
        required: true,
      });
    }
  });

  it("uses style-agnostic policy shapes without HTTP-specific fields", () => {
    const policy = resolveValidationDirectionPolicy(
      API_CONTRACTS[0] as (typeof API_CONTRACTS)[number]
    );

    expect(Object.keys(policy.ingress).sort()).toEqual(["phase", "required"]);
    expect(Object.keys(policy.egress).sort()).toEqual(["phase", "required"]);
    expect(policy.ingress.phase).toBe("before-business-execution");
    expect(policy.egress.phase).toBe("before-serialization");
  });

  it("classifies public health read with optional ingress and required egress for protected reads", () => {
    const health = API_CONTRACTS.find(
      (contract) => contract.id === "internal.v1.health.get"
    );
    expect(health).toBeDefined();
    if (health === undefined) {
      return;
    }

    expect(classifyOperationExposure(health.authPolicy)).toBe("public");
    expect(classifyOperationInteraction(health.method)).toBe("read");

    const policy = resolveValidationDirectionPolicy(health);
    expect(policy.ingress.required).toBe(false);
    expect(policy.egress.required).toBe(false);
  });

  it("classifies protected inventory mutation with bidirectional validation", () => {
    const createProduct = API_CONTRACTS.find(
      (contract) => contract.id === "internal.v1.inventory.products.post"
    );
    expect(createProduct).toBeDefined();
    if (createProduct === undefined) {
      return;
    }

    expect(classifyOperationExposure(createProduct.authPolicy)).toBe("protected");
    expect(classifyOperationInteraction(createProduct.method)).toBe("mutation");

    const policy = resolveValidationDirectionPolicy(createProduct);
    expect(policy.ingress.required).toBe(true);
    expect(policy.egress.required).toBe(true);
  });

  it("asserts registry-wide validation direction invariants", () => {
    const policies = assertRegistryValidationDirection(API_CONTRACTS);
    expect(policies).toHaveLength(API_CONTRACTS.length);

    const registry = buildOperationValidationDirectionRegistry(API_CONTRACTS);
    expect(registry.size).toBe(API_CONTRACTS.length);
  });
});
