/**
 * PAS-API-001 API-006 / API-007 / API-008 — family policy declarations.
 * Declaration only — no session storage, context assembly, or permission evaluation.
 */

import type { ApiRouteContract } from "../api-contract";
import type { ApiAuthPolicy } from "../auth-policy.contract";
import {
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "../auth-policy.contract";
import type { ApiContextPolicy } from "../context-policy.contract";
import { requiresOperatingContext } from "../context-policy.contract";

/** API-006 — actor class at contract boundary (distinct from runtime credentials). */
export type ApiActorPolicy =
  | { readonly kind: "anonymous" }
  | {
      readonly kind: "human-session";
      readonly sessionClass: "email-verified" | "standard";
    }
  | {
      readonly actorClass: "internal" | "service-token";
      readonly kind: "service-actor";
    };

/** API-007 — operating context requirement declared per operation. */
export interface ApiOperatingContextPolicyDeclaration {
  readonly policy: ApiContextPolicy;
  readonly required: boolean;
}

/** API-008 — capability intent declared on protected operations (not evaluated here). */
export type ApiPermissionDeclaration =
  | { readonly kind: "not-required" }
  | { readonly kind: "capability-required"; readonly permission: string };

/** Unified family policy bundle for a governed operation. */
export interface ApiOperationPolicyDeclaration {
  readonly actor: ApiActorPolicy;
  readonly context: ApiOperatingContextPolicyDeclaration;
  readonly permission: ApiPermissionDeclaration;
}

export function resolveActorPolicy(authPolicy: ApiAuthPolicy): ApiActorPolicy {
  if (isPublicAuthPolicy(authPolicy)) {
    return { kind: "anonymous" };
  }

  if (authPolicy === "service-token-required") {
    return { kind: "service-actor", actorClass: "service-token" };
  }

  if (authPolicy === "internal-only") {
    return { kind: "service-actor", actorClass: "internal" };
  }

  if (authPolicy === "session-required-email-verified") {
    return { kind: "human-session", sessionClass: "email-verified" };
  }

  if (requiresSessionAuth(authPolicy)) {
    return { kind: "human-session", sessionClass: "standard" };
  }

  throw new Error(
    `Unsupported auth policy for actor resolution: ${authPolicy}`
  );
}

export function resolveOperatingContextPolicyDeclaration(
  contextPolicy: ApiContextPolicy
): ApiOperatingContextPolicyDeclaration {
  return {
    policy: contextPolicy,
    required: requiresOperatingContext(contextPolicy),
  };
}

export function resolvePermissionDeclaration(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "id" | "permission"
  >
): ApiPermissionDeclaration {
  if (isPublicAuthPolicy(contract.authPolicy)) {
    return { kind: "not-required" };
  }

  if (
    requiresSessionAuth(contract.authPolicy) &&
    !("permission" in contract) &&
    contract.id === "internal.v1.auth.memberships.get"
  ) {
    return { kind: "not-required" };
  }

  if (
    contract.authPolicy === "service-token-required" &&
    contract.id === "internal.v1.auth.service-actor.ping.get"
  ) {
    return { kind: "not-required" };
  }

  if ("permission" in contract && contract.permission !== undefined) {
    return {
      kind: "capability-required",
      permission: contract.permission.permission,
    };
  }

  return { kind: "not-required" };
}

export function extractOperationPolicyDeclaration(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "contextPolicy" | "id" | "permission"
  >
): ApiOperationPolicyDeclaration {
  return {
    actor: resolveActorPolicy(contract.authPolicy),
    context: resolveOperatingContextPolicyDeclaration(contract.contextPolicy),
    permission: resolvePermissionDeclaration(contract),
  };
}

export function isHumanSessionActor(actor: ApiActorPolicy): boolean {
  return actor.kind === "human-session";
}

export function isServiceActor(actor: ApiActorPolicy): boolean {
  return actor.kind === "service-actor";
}

export function assertRegistryOperationPolicyDeclarations<
  TContract extends ApiRouteContract<unknown, unknown>,
>(contracts: readonly TContract[]): readonly ApiOperationPolicyDeclaration[] {
  return contracts.map((contract) => {
    const declaration = extractOperationPolicyDeclaration(contract);

    if (
      contract.authPolicy === "service-token-required" &&
      isHumanSessionActor(declaration.actor)
    ) {
      throw new Error(
        `Service-token operation ${contract.id} must not resolve to human-session actor.`
      );
    }

    if (
      requiresSessionAuth(contract.authPolicy) &&
      isServiceActor(declaration.actor)
    ) {
      throw new Error(
        `Session-required operation ${contract.id} must not resolve to service-actor.`
      );
    }

    if (
      !isPublicAuthPolicy(contract.authPolicy) &&
      requiresSessionAuth(contract.authPolicy) &&
      contract.id !== "internal.v1.auth.memberships.get" &&
      declaration.permission.kind !== "capability-required"
    ) {
      throw new Error(
        `Protected operation ${contract.id} must declare permission capability intent.`
      );
    }

    return declaration;
  });
}

export function buildOperationPolicyDeclarationRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(
  contracts: readonly TContract[]
): ReadonlyMap<string, ApiOperationPolicyDeclaration> {
  const declarations = assertRegistryOperationPolicyDeclarations(contracts);
  const registry = new Map<string, ApiOperationPolicyDeclaration>();

  for (const [index, contract] of contracts.entries()) {
    const declaration = declarations[index];
    if (declaration === undefined) {
      throw new Error(
        `Missing operation policy declaration for contract index ${index}.`
      );
    }
    registry.set(contract.id, declaration);
  }

  return registry;
}
