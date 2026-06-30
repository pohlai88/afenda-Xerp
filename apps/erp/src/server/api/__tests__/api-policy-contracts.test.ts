import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  API_AUTH_POLICIES,
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "@/server/api/contracts/auth-policy.contract";
import { API_CONTEXT_POLICIES } from "@/server/api/contracts/context-policy.contract";
import {
  API_CONSUMER_IMPACT_CLASSES,
  assertActiveOperationOwnership,
  assertRegistryConsumerImpactPolicy,
  assertRegistryCorrelationPolicy,
  buildOperationConsumerImpactRegistry,
  buildOperationOwnershipRegistry,
  resolveConsumerImpactDeclaration,
  resolveOperationOwnership,
} from "@/server/api/contracts/core";
import { API_ROUTE_LIFECYCLE_STATUSES } from "@/server/api/contracts/lifecycle.contract";
import { API_RATE_LIMIT_POLICIES } from "@/server/api/contracts/rate-limit.contract";
import { API_STABILITY_CLASSIFICATIONS } from "@/server/api/contracts/stability.contract";

describe("API policy contracts", () => {
  it("defines serializable auth policies", () => {
    expect(API_AUTH_POLICIES.length).toBeGreaterThan(0);
    expect(isPublicAuthPolicy("public")).toBe(true);
    expect(requiresSessionAuth("session-required")).toBe(true);
  });

  it("defines serializable context policies", () => {
    expect(API_CONTEXT_POLICIES).toContain("tenant-company-org-required");
  });

  it("defines serializable rate-limit policies", () => {
    expect(API_RATE_LIMIT_POLICIES).toContain("authenticated-standard");
  });

  it("defines route lifecycle statuses", () => {
    expect(API_ROUTE_LIFECYCLE_STATUSES).toContain("active");
  });

  it("defines stability classifications", () => {
    expect(API_STABILITY_CLASSIFICATIONS).toContain("internal-stable");
  });

  it("declares consumer impact on active registry contracts", () => {
    for (const contract of API_CONTRACTS) {
      if (contract.lifecycle !== "active") {
        continue;
      }

      const impact = resolveConsumerImpactDeclaration(contract);
      expect(impact.consumerImpact.affected.length).toBeGreaterThan(0);
      for (const impactClass of impact.consumerImpact.affected) {
        expect(API_CONSUMER_IMPACT_CLASSES).toContain(impactClass);
      }
    }
  });

  it("declares four ownership dimensions on active registry contracts", () => {
    for (const contract of API_CONTRACTS) {
      if (contract.lifecycle !== "active") {
        continue;
      }

      const ownership = resolveOperationOwnership(contract);
      expect(ownership.domainOwner).toBeTruthy();
      expect(ownership.technicalOwner).toBeTruthy();
      expect(ownership.lifecycleOwner).toBeTruthy();
      expect(ownership.consumerImpactOwner).toBeTruthy();
    }
  });
});

describe("PAS-001A R3d governance closure", () => {
  it("attests audit replay minimum correlation policy on the registry", () => {
    expect(() => assertRegistryCorrelationPolicy(API_CONTRACTS)).not.toThrow();
  });

  it("attests ownership and consumer impact registries for every contract", () => {
    expect(() =>
      assertRegistryConsumerImpactPolicy(API_CONTRACTS)
    ).not.toThrow();
    expect(buildOperationConsumerImpactRegistry(API_CONTRACTS).size).toBe(
      API_CONTRACTS.length
    );

    for (const contract of API_CONTRACTS) {
      if (contract.lifecycle === "active" || contract.lifecycle === "planned") {
        expect(() => assertActiveOperationOwnership(contract)).not.toThrow();
      }
    }

    expect(buildOperationOwnershipRegistry(API_CONTRACTS).size).toBe(
      API_CONTRACTS.length
    );
  });
});
