/**
 * PAS-001A-API-BINDING-S4 — Auth and authorization bridge.
 *
 * Proves ERP API contract layer declares PAS-API-001 API-006/API-008 policy
 * intent only — identity ingress and permission evaluation run via IS-001 spine.
 */

import type { ApiRouteContract } from "./api-contract";
import {
  isPublicAuthPolicy,
  requiresSessionAuth,
} from "./auth-policy.contract";
import {
  assertRegistryOperationPolicyDeclarations,
  extractOperationPolicyDeclaration,
  isHumanSessionActor,
  isServiceActor,
} from "./core/api-policy.contract";
import type { ErpApiContextBridgeAttestation } from "./erp-api-context-bridge.contract";
import { ERP_API_CONTEXT_AUTHORIZATION_MODULE } from "./erp-api-context-bridge.contract";

export const ERP_API_AUTH_ACTOR_MODULE =
  "apps/erp/src/lib/auth/resolve-api-route-auth-actor.server.ts" as const;

export const ERP_API_ROUTE_PERMISSION_MODULE =
  "apps/erp/src/server/api/runtime/api-request-context.ts" as const;

/** Session membership bootstrap — permission intent waived at contract layer. */
export const ERP_API_AUTH_MEMBERSHIP_BOOTSTRAP_OPERATION_ID =
  "internal.v1.auth.memberships.get" as const;

/** Spine wiring entries IS-004 auth runtime must consume (mirrors context-integration-registry). */
export const ERP_API_AUTH_SPINE_WIRING = [
  {
    id: "permission-checks",
    registry: "CONTEXT_INTEGRATION_WIRING",
    module: "lib/api/authorize-api-route.ts",
    delegate: "checkPermission",
  },
  {
    id: "auth-actor-api",
    registry: "AUTH_ACTOR_BRIDGE_WIRING",
    module: "lib/api/authorize-api-route.ts",
    delegate: "resolveWireActorUserIdFromAfendaAuthSession",
  },
  {
    id: "service-actor-api-route",
    registry: "SERVICE_ACTOR_BRIDGE_WIRING",
    module: "lib/auth/resolve-api-route-auth-actor.server.ts",
    delegate: "resolveApiRouteAuthActor",
  },
  {
    id: "protected-api-routes",
    registry: "CONTEXT_INTEGRATION_WIRING",
    module: "server/api/runtime/create-api-handler.ts",
    delegate: "createApiHandler",
  },
] as const;

export interface ErpApiAuthBridgeAttestation {
  readonly authActorModule: typeof ERP_API_AUTH_ACTOR_MODULE;
  readonly authorizationModule: typeof ERP_API_CONTEXT_AUTHORIZATION_MODULE;
  readonly bindingKind: "erp-api-auth-bridge";
  readonly consumesFamilyInvariants: readonly ["API-006", "API-008"];
  readonly integrationSurfaceId: "IS-001";
  readonly operationCount: number;
  readonly permissionRequiredOperationCount: number;
  readonly protectedOperationCount: number;
  readonly routePermissionModule: typeof ERP_API_ROUTE_PERMISSION_MODULE;
  readonly spineWiringEntryCount: number;
  readonly upstreamApiSurfaceId: "IS-004";
}

export function buildErpApiAuthBridgeAttestation(input: {
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): ErpApiAuthBridgeAttestation {
  let protectedOperationCount = 0;
  let permissionRequiredOperationCount = 0;

  for (const contract of input.contracts) {
    if (isPublicAuthPolicy(contract.authPolicy)) {
      continue;
    }

    protectedOperationCount += 1;

    const declaration = extractOperationPolicyDeclaration(contract);
    if (declaration.permission.kind === "capability-required") {
      permissionRequiredOperationCount += 1;
    }
  }

  return {
    authActorModule: ERP_API_AUTH_ACTOR_MODULE,
    authorizationModule: ERP_API_CONTEXT_AUTHORIZATION_MODULE,
    bindingKind: "erp-api-auth-bridge",
    consumesFamilyInvariants: ["API-006", "API-008"],
    integrationSurfaceId: "IS-001",
    operationCount: input.contracts.length,
    permissionRequiredOperationCount,
    protectedOperationCount,
    routePermissionModule: ERP_API_ROUTE_PERMISSION_MODULE,
    spineWiringEntryCount: ERP_API_AUTH_SPINE_WIRING.length,
    upstreamApiSurfaceId: "IS-004",
  };
}

export function assertPublicOperationsDeclareNoPermission(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "id" | "permission"
  >
): void {
  if (!isPublicAuthPolicy(contract.authPolicy)) {
    return;
  }

  if ("permission" in contract && contract.permission !== undefined) {
    throw new Error(
      `Public operation ${contract.id} must not declare permission policy — IS-001 evaluates at runtime only.`
    );
  }
}

export function assertProtectedOperationsDeclareActorAndPermissionIntent(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "contextPolicy" | "id" | "permission"
  >
): void {
  if (isPublicAuthPolicy(contract.authPolicy)) {
    return;
  }

  const declaration = extractOperationPolicyDeclaration(contract);

  if (
    requiresSessionAuth(contract.authPolicy) &&
    !isHumanSessionActor(declaration.actor) &&
    contract.id !== ERP_API_AUTH_MEMBERSHIP_BOOTSTRAP_OPERATION_ID
  ) {
    throw new Error(
      `Session-required operation ${contract.id} must declare human-session actor policy (API-006).`
    );
  }

  if (
    (contract.authPolicy === "service-token-required" ||
      contract.authPolicy === "internal-only") &&
    !isServiceActor(declaration.actor)
  ) {
    throw new Error(
      `Service-auth operation ${contract.id} must declare service-actor policy (API-006).`
    );
  }

  if (
    requiresSessionAuth(contract.authPolicy) &&
    contract.id !== ERP_API_AUTH_MEMBERSHIP_BOOTSTRAP_OPERATION_ID &&
    declaration.permission.kind !== "capability-required"
  ) {
    throw new Error(
      `Protected operation ${contract.id} must declare permission capability intent (API-008).`
    );
  }
}

export function collectErpApiAuthBridgeViolations(input: {
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): readonly string[] {
  const violations: string[] = [];

  for (const contract of input.contracts) {
    try {
      assertPublicOperationsDeclareNoPermission(contract);
    } catch (error) {
      violations.push(
        error instanceof Error
          ? error.message
          : "Public permission assertion failed."
      );
    }

    try {
      assertProtectedOperationsDeclareActorAndPermissionIntent(contract);
    } catch (error) {
      violations.push(
        error instanceof Error
          ? error.message
          : "Protected auth assertion failed."
      );
    }
  }

  try {
    assertRegistryOperationPolicyDeclarations(input.contracts);
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "Family API-006/API-008 registry assertion failed."
    );
  }

  return violations;
}

/** Lineage helper for nested attestation tests (S3 → S4). */
export function summarizeContextBridgeForAuthBridge(
  contextAttestation: ErpApiContextBridgeAttestation
): { readonly upstreamSurface: "IS-002"; readonly operationCount: number } {
  return {
    upstreamSurface: contextAttestation.integrationSurfaceId,
    operationCount: contextAttestation.operationCount,
  };
}
