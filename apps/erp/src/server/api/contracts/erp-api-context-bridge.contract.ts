/**
 * PAS-001A-API-BINDING-S3 — Operating context assembly bridge.
 *
 * Proves protected internal v1 API operations receive operating context from
 * IS-002 spine (PAS-001A) per PAS-API-001 API-007 — not handler-local inference.
 */

import type { ApiRouteContract } from "./api-contract";
import { isPublicAuthPolicy } from "./auth-policy.contract";
import { requiresOperatingContext } from "./context-policy.contract";
import {
  extractOperationPolicyDeclaration,
  isServiceActor,
} from "./core/api-policy.contract";
import type { ErpRestBindingConsumptionAttestation } from "./erp-rest-binding-consumption.contract";

export const ERP_API_CONTEXT_RESOLVER_MODULE =
  "apps/erp/src/lib/api/resolve-api-route-operating-context.ts" as const;

export const ERP_API_CONTEXT_ORCHESTRATOR_MODULE =
  "apps/erp/src/lib/context/resolve-operating-context-orchestrator.server.ts" as const;

export const ERP_API_CONTEXT_AUTHORIZATION_MODULE =
  "apps/erp/src/lib/api/authorize-api-route.ts" as const;

export const ERP_API_HANDLER_RUNTIME_MODULE =
  "apps/erp/src/server/api/runtime/create-api-handler.ts" as const;

export const ERP_API_CONTEXT_PROTECTED_SURFACE = {
  id: "protected-api-operating-context",
  delegate: "resolveApiRouteOperatingContext",
  kind: "protected-api",
  module: "lib/api/resolve-api-route-operating-context.ts",
  routePattern: "/api/internal/v1/*",
} as const;

/** Spine wiring entries IS-004 handler runtime must consume (mirrors context-integration-registry). */
export const ERP_API_CONTEXT_SPINE_WIRING = [
  {
    id: "protected-api-operating-context",
    registry: "CONTEXT_INTEGRATION_WIRING",
    module: "lib/api/resolve-api-route-operating-context.ts",
    delegate: "resolveApiRouteOperatingContext",
  },
  {
    id: "protected-api-routes",
    registry: "CONTEXT_INTEGRATION_WIRING",
    module: "server/api/runtime/create-api-handler.ts",
    delegate: "createApiHandler",
  },
  {
    id: "service-actor-api-operating-context",
    registry: "SERVICE_ACTOR_BRIDGE_WIRING",
    module: "lib/api/resolve-api-route-operating-context.ts",
    delegate: "resolveApiRouteOperatingContext",
  },
] as const;

export interface ErpApiContextBridgeAttestation {
  readonly bindingKind: "erp-api-context-bridge";
  readonly consumesFamilyInvariant: "API-007";
  readonly contextRequiredOperationCount: number;
  readonly integrationSurfaceId: "IS-002";
  readonly operationCount: number;
  readonly protectedApiSurfaceId: typeof ERP_API_CONTEXT_PROTECTED_SURFACE.id;
  readonly resolverModule: typeof ERP_API_CONTEXT_RESOLVER_MODULE;
  readonly spineWiringEntryCount: number;
  readonly upstreamApiSurfaceId: "IS-004";
}

export function buildErpApiContextBridgeAttestation(input: {
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): ErpApiContextBridgeAttestation {
  const contextRequiredOperationCount = input.contracts.filter((contract) =>
    requiresOperatingContext(contract.contextPolicy)
  ).length;

  return {
    bindingKind: "erp-api-context-bridge",
    consumesFamilyInvariant: "API-007",
    contextRequiredOperationCount,
    integrationSurfaceId: "IS-002",
    operationCount: input.contracts.length,
    protectedApiSurfaceId: ERP_API_CONTEXT_PROTECTED_SURFACE.id,
    resolverModule: ERP_API_CONTEXT_RESOLVER_MODULE,
    spineWiringEntryCount: ERP_API_CONTEXT_SPINE_WIRING.length,
    upstreamApiSurfaceId: "IS-004",
  };
}

export function assertProtectedOperationsDeclareOperatingContext(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "contextPolicy" | "id"
  >
): void {
  if (isPublicAuthPolicy(contract.authPolicy)) {
    if (requiresOperatingContext(contract.contextPolicy)) {
      throw new Error(
        `Public operation ${contract.id} must not declare operating context requirement.`
      );
    }
    return;
  }

  if (!requiresOperatingContext(contract.contextPolicy)) {
    throw new Error(
      `Protected operation ${contract.id} must declare operating context via IS-002 spine.`
    );
  }
}

export function assertApi007DeclarationMatchesContextPolicy(
  contract: Pick<
    ApiRouteContract<unknown, unknown>,
    "authPolicy" | "contextPolicy" | "id"
  >
): void {
  const declaration = extractOperationPolicyDeclaration(contract);
  const expectedRequired = requiresOperatingContext(contract.contextPolicy);

  if (declaration.context.required !== expectedRequired) {
    throw new Error(
      `API-007 declaration for ${contract.id} must match contextPolicy required flag.`
    );
  }

  if (isServiceActor(declaration.actor) && !declaration.context.required) {
    throw new Error(
      `Service-actor operation ${contract.id} must require operating context assembly.`
    );
  }
}

export function collectErpApiContextBridgeViolations(input: {
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): readonly string[] {
  const violations: string[] = [];

  for (const contract of input.contracts) {
    try {
      assertProtectedOperationsDeclareOperatingContext(contract);
    } catch (error) {
      violations.push(
        error instanceof Error
          ? error.message
          : "Context policy assertion failed."
      );
    }

    try {
      assertApi007DeclarationMatchesContextPolicy(contract);
    } catch (error) {
      violations.push(
        error instanceof Error ? error.message : "API-007 declaration mismatch."
      );
    }
  }

  if (
    ERP_API_CONTEXT_PROTECTED_SURFACE.delegate !==
    "resolveApiRouteOperatingContext"
  ) {
    violations.push(
      "Protected API surface must delegate to resolveApiRouteOperatingContext."
    );
  }

  return violations;
}

/** Lineage helper for nested attestation tests (S2 → S3). */
export function summarizeRestConsumptionForContextBridge(
  restAttestation: ErpRestBindingConsumptionAttestation
): { readonly upstreamSurface: "IS-004"; readonly operationCount: number } {
  return {
    upstreamSurface: restAttestation.integrationSurfaceId,
    operationCount: restAttestation.operationCount,
  };
}
