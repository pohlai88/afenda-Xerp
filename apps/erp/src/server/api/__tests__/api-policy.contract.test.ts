import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "@/server/api/contracts/auth-policy.contract";
import { requiresOperatingContext } from "@/server/api/contracts/context-policy.contract";
import {
  assertRegistryOperationPolicyDeclarations,
  buildOperationPolicyDeclarationRegistry,
  extractOperationPolicyDeclaration,
  isHumanSessionActor,
  isServiceActor,
  resolveActorPolicy,
} from "@/server/api/contracts/core";

describe("ApiOperationPolicyDeclaration", () => {
  it("keeps human-session and service-actor kinds distinct at contract layer", () => {
    const human = resolveActorPolicy("session-required");
    const service = resolveActorPolicy("service-token-required");

    expect(human).toEqual({ kind: "human-session", sessionClass: "standard" });
    expect(service).toEqual({
      kind: "service-actor",
      actorClass: "service-token",
    });
    expect(isHumanSessionActor(human)).toBe(true);
    expect(isServiceActor(service)).toBe(true);
    expect(isHumanSessionActor(service)).toBe(false);
    expect(isServiceActor(human)).toBe(false);
  });

  it("declares operating context policy fields for every registry operation", () => {
    for (const contract of API_CONTRACTS) {
      const declaration = extractOperationPolicyDeclaration(contract);
      expect(declaration.context.policy).toBe(contract.contextPolicy);
      expect(declaration.context.required).toBe(
        requiresOperatingContext(contract.contextPolicy)
      );
    }
  });

  it("declares permission capability intent on protected session operations", () => {
    for (const contract of API_CONTRACTS) {
      if (isPublicAuthPolicy(contract.authPolicy)) {
        expect(extractOperationPolicyDeclaration(contract).permission).toEqual({
          kind: "not-required",
        });
        continue;
      }

      if (contract.id === "internal.v1.auth.memberships.get") {
        continue;
      }

      if (!requiresSessionAuth(contract.authPolicy)) {
        continue;
      }

      const permission = extractOperationPolicyDeclaration(contract).permission;
      expect(permission.kind).toBe("capability-required");
      if (permission.kind === "capability-required") {
        expect(permission.permission.length).toBeGreaterThan(0);
      }
    }
  });

  it("does not conflate service actor policies with human session actors", () => {
    for (const contract of API_CONTRACTS) {
      const declaration = extractOperationPolicyDeclaration(contract);

      if (contract.authPolicy === "service-token-required") {
        expect(declaration.actor.kind).toBe("service-actor");
      }

      if (requiresSessionAuth(contract.authPolicy)) {
        expect(declaration.actor.kind).toBe("human-session");
      }
    }
  });

  it("asserts registry-wide family policy declarations", () => {
    const declarations =
      assertRegistryOperationPolicyDeclarations(API_CONTRACTS);
    expect(declarations).toHaveLength(API_CONTRACTS.length);

    const registry = buildOperationPolicyDeclarationRegistry(API_CONTRACTS);
    expect(registry.size).toBe(API_CONTRACTS.length);
  });
});
