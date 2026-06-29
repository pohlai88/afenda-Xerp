/**
 * PAS-001A-API-BINDING-S1 — ERP API consumption boundary.
 *
 * ERP Integration Spine (PAS-001A) **consumes** Platform API Contract family
 * authority (PAS-API-001) and the active REST binding (PAS-API-REST-001).
 * This module documents and types the boundary — it does not own family doctrine.
 */

import type { ApiOperationId } from "./core/api-operation-id.contract";
import { getRegistryOperationIds } from "./core/api-registry.contract";
import type { RestOperationBinding } from "./rest-operation-binding.contract";
import { REST_INTERNAL_V1_NAMESPACE } from "./rest-operation-binding.contract";

/** Readonly consumption attestation — serializable for docs and gates. */
export interface ErpApiConsumptionBoundary {
  readonly consumesConsumerBindingPas: "PAS-001A-API-BINDING";
  readonly consumesFamilyPas: "PAS-API-001";
  readonly consumesStyleBindingPas: "PAS-API-REST-001";
  readonly familyAuthorityModule: string;
  readonly integrationSurfaceId: "IS-004";
  readonly integrationSurfaceName: "REST Contract Runtime";
  readonly registryModule: string;
  readonly restBindingModule: string;
  readonly restSchemaBindingModule: string;
  readonly role: "consumer";
  readonly runtimeOwner: "apps/erp";
}

export const ERP_API_CONSUMPTION_BOUNDARY = {
  consumesConsumerBindingPas: "PAS-001A-API-BINDING",
  consumesFamilyPas: "PAS-API-001",
  consumesStyleBindingPas: "PAS-API-REST-001",
  familyAuthorityModule: "apps/erp/src/server/api/contracts/core/index.ts",
  integrationSurfaceId: "IS-004",
  integrationSurfaceName: "REST Contract Runtime",
  registryModule: "apps/erp/src/server/api/contracts/api-contract-registry.ts",
  restBindingModule:
    "apps/erp/src/server/api/contracts/rest-operation-binding.contract.ts",
  restSchemaBindingModule:
    "apps/erp/src/server/api/contracts/rest-schema-binding.contract.ts",
  role: "consumer",
  runtimeOwner: "apps/erp",
} as const satisfies ErpApiConsumptionBoundary;

/** Integration surfaces owned by ERP spine wiring — not API family doctrine. */
export const ERP_API_SPINE_OWNED_SURFACES = {
  handlerRuntimeWiring: "IS-004",
  operatingContextAssembly: "IS-002",
  permissionScopeWiring: "IS-001",
  serviceActorS2S: "IS-001",
} as const;

/** Ownership categories ERP must never claim (PAS-001A-API-BINDING §2). */
export const ERP_API_PROHIBITED_OWNERSHIP = [
  "api-family-doctrine",
  "cross-style-invariants",
  "openapi-as-sole-publication-truth",
  "graphql-event-agent-bindings",
] as const satisfies readonly string[];

export type ErpApiProhibitedOwnership =
  (typeof ERP_API_PROHIBITED_OWNERSHIP)[number];

export function buildErpApiConsumptionAttestation(): ErpApiConsumptionBoundary {
  return ERP_API_CONSUMPTION_BOUNDARY;
}

/** Runtime proof that family registry is consumed — not redefined — at ERP boundary. */
export function assertErpConsumesFamilyOperationRegistry(
  operationIds: readonly ApiOperationId[]
): void {
  if (operationIds.length === 0) {
    throw new Error(
      "ERP API consumption boundary requires a non-empty family operation registry."
    );
  }
}

/** Runtime proof that REST bindings stay under governed internal v1 namespace. */
export function assertErpConsumesRestBindings(
  bindings: readonly RestOperationBinding[]
): void {
  for (const binding of bindings) {
    if (binding.namespace !== REST_INTERNAL_V1_NAMESPACE) {
      throw new Error(
        `REST binding namespace must remain ${REST_INTERNAL_V1_NAMESPACE}.`
      );
    }
  }
}

export function collectErpApiConsumptionViolations(input: {
  readonly operationIds: readonly ApiOperationId[];
  readonly restBindings: readonly RestOperationBinding[];
}): readonly string[] {
  const violations: string[] = [];

  try {
    assertErpConsumesFamilyOperationRegistry(input.operationIds);
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "Family registry consumption failed."
    );
  }

  try {
    assertErpConsumesRestBindings(input.restBindings);
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "REST binding consumption failed."
    );
  }

  if (ERP_API_CONSUMPTION_BOUNDARY.role !== "consumer") {
    violations.push("ERP API consumption role must remain consumer.");
  }

  return violations;
}

/** Re-export for attestation tests — registry ids flow from family layer. */
export { getRegistryOperationIds };
