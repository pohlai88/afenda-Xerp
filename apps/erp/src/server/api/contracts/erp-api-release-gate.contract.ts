/**
 * PAS-001A-API-BINDING-S7 — ERP release gate.
 *
 * IS-004 closure gate on PAS-001A — ERP cannot release with API contract drift.
 * Aggregates S1–S6 binding attestation; does not activate reserved style bindings.
 */

import type { ApiRouteContract } from "./api-contract";
import type { ApiOperationId } from "./core/api-operation-id.contract";
import { collectErpApiConsumerImpactSyncViolations } from "./erp-api-consumer-impact-sync.contract";
import {
  ERP_API_CONSUMPTION_BOUNDARY,
  type ErpApiConsumptionBoundary,
} from "./erp-api-consumption.contract";
import {
  collectErpApiRuntimeEvidenceViolations,
  ERP_API_RUNTIME_MATURITY,
} from "./erp-api-runtime-evidence.contract";

export const ERP_API_BINDING_TRACK_SLICE_COUNT = 7 as const;

export const ERP_API_BINDING_SLICE_MODULES = [
  "apps/erp/src/server/api/contracts/erp-api-consumption.contract.ts",
  "apps/erp/src/server/api/contracts/erp-rest-binding-consumption.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-context-bridge.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-auth-bridge.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-runtime-evidence.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-consumer-impact-sync.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-release-gate.contract.ts",
] as const;

/** Release gates — drift must be zero before ERP ships API surface changes. */
export const ERP_API_RELEASE_GATES = [
  "check:api-contracts",
  "check:openapi-drift",
  "check:api-route-catalog",
  "check:foundation-disposition",
] as const;

/** Reserved style bindings — not activated by this release gate (hard stop). */
export const ERP_API_RELEASE_RESERVED_STYLE_BINDINGS = [
  "PAS-API-RPC-001",
  "PAS-API-GRAPHQL-001",
  "PAS-API-EVENT-001",
  "PAS-API-AGENT-001",
] as const;

export const ERP_API_BINDING_TRACK_STATUS = "delivered" as const;

export interface ErpApiReleaseGateAttestation {
  readonly activeStyleBindingPas: ErpApiConsumptionBoundary["consumesStyleBindingPas"];
  readonly bindingKind: "erp-api-release-gate";
  readonly bindingSliceCount: typeof ERP_API_BINDING_TRACK_SLICE_COUNT;
  readonly bindingSliceModules: typeof ERP_API_BINDING_SLICE_MODULES;
  readonly bindingTrackStatus: typeof ERP_API_BINDING_TRACK_STATUS;
  readonly integrationSurfaceId: "IS-004";
  readonly maturity: typeof ERP_API_RUNTIME_MATURITY;
  readonly operationCount: number;
  readonly releaseGateCount: number;
  readonly releaseGates: typeof ERP_API_RELEASE_GATES;
  readonly reservedStyleBindingCount: number;
}

export function buildErpApiReleaseGateAttestation(input: {
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): ErpApiReleaseGateAttestation {
  return {
    activeStyleBindingPas: ERP_API_CONSUMPTION_BOUNDARY.consumesStyleBindingPas,
    bindingKind: "erp-api-release-gate",
    bindingSliceCount: ERP_API_BINDING_TRACK_SLICE_COUNT,
    bindingSliceModules: ERP_API_BINDING_SLICE_MODULES,
    bindingTrackStatus: ERP_API_BINDING_TRACK_STATUS,
    integrationSurfaceId: "IS-004",
    maturity: ERP_API_RUNTIME_MATURITY,
    operationCount: input.contracts.length,
    releaseGateCount: ERP_API_RELEASE_GATES.length,
    releaseGates: ERP_API_RELEASE_GATES,
    reservedStyleBindingCount: ERP_API_RELEASE_RESERVED_STYLE_BINDINGS.length,
  };
}

export function assertReleaseGateStyleBindingScope(): void {
  if (
    ERP_API_CONSUMPTION_BOUNDARY.consumesStyleBindingPas !== "PAS-API-REST-001"
  ) {
    throw new Error(
      "ERP release gate permits only PAS-API-REST-001 as the active style binding."
    );
  }

  if (ERP_API_CONSUMPTION_BOUNDARY.role !== "consumer") {
    throw new Error(
      "ERP release gate requires consumer role at API binding boundary."
    );
  }
}

export function assertBindingTrackSliceModulesComplete(): void {
  if (
    ERP_API_BINDING_SLICE_MODULES.length !== ERP_API_BINDING_TRACK_SLICE_COUNT
  ) {
    throw new Error(
      `API binding track must declare ${ERP_API_BINDING_TRACK_SLICE_COUNT} slice modules.`
    );
  }
}

export function collectErpApiReleaseGateViolations(input: {
  readonly apiRoot: string;
  readonly contractExports: Record<string, ApiRouteContract<unknown, unknown>>;
  readonly operationIds: readonly ApiOperationId[];
  readonly registryContracts: readonly ApiRouteContract<unknown, unknown>[];
}): readonly string[] {
  const violations: string[] = [];

  violations.push(
    ...collectErpApiRuntimeEvidenceViolations({
      apiRoot: input.apiRoot,
      contractExports: input.contractExports,
      operationIds: input.operationIds,
      registryContracts: input.registryContracts,
    })
  );

  violations.push(
    ...collectErpApiConsumerImpactSyncViolations({
      contracts: input.registryContracts,
    })
  );

  try {
    assertReleaseGateStyleBindingScope();
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "Style binding scope assertion failed."
    );
  }

  try {
    assertBindingTrackSliceModulesComplete();
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "Binding track module assertion failed."
    );
  }

  return violations;
}
