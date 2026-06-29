/**
 * PAS-001A-API-BINDING-S2 — ERP REST binding consumption.
 *
 * Proves `apps/erp` internal v1 routes consume PAS-API-REST-001 registry +
 * handler discipline via IS-004 — without claiming REST family authority.
 */

import type { ApiRouteContract } from "./api-contract";
import {
  collectGovernedRouteContractExportNames,
  validateApiContractRegistryCoverage,
} from "./api-route-coverage";
import type { ApiOperationId } from "./core/api-operation-id.contract";
import {
  ERP_API_CONSUMPTION_BOUNDARY,
  type ErpApiConsumptionBoundary,
} from "./erp-api-consumption.contract";
import type { RestOperationBinding } from "./rest-operation-binding.contract";
import {
  buildRestOperationBindingRegistry,
  REST_INTERNAL_V1_NAMESPACE,
} from "./rest-operation-binding.contract";
import type { RestSchemaBinding } from "./rest-schema-binding.contract";
import { buildRestSchemaBindingRegistry } from "./rest-schema-binding.contract";

export const ERP_INTERNAL_V1_ROUTE_ROOT = "apps/erp/src/app/api" as const;

export interface ErpRestBindingConsumptionAttestation {
  readonly bindingKind: "erp-rest-binding-consumption";
  readonly consumesStyleBindingPas: "PAS-API-REST-001";
  readonly governedRouteCount: number;
  readonly integrationSurfaceId: "IS-004";
  readonly namespace: typeof REST_INTERNAL_V1_NAMESPACE;
  readonly operationCount: number;
  readonly parentConsumption: ErpApiConsumptionBoundary;
  readonly routeRoot: typeof ERP_INTERNAL_V1_ROUTE_ROOT;
  readonly schemaBindingCount: number;
}

export function buildErpRestBindingConsumptionAttestation(input: {
  readonly apiRoot: string;
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): ErpRestBindingConsumptionAttestation {
  const schemaBindings = buildRestSchemaBindingRegistry(input.contracts);
  const governedRoutes = collectGovernedRouteContractExportNames(input.apiRoot);

  return {
    bindingKind: "erp-rest-binding-consumption",
    consumesStyleBindingPas: "PAS-API-REST-001",
    governedRouteCount: governedRoutes.length,
    integrationSurfaceId: "IS-004",
    namespace: REST_INTERNAL_V1_NAMESPACE,
    operationCount: input.contracts.length,
    parentConsumption: ERP_API_CONSUMPTION_BOUNDARY,
    routeRoot: ERP_INTERNAL_V1_ROUTE_ROOT,
    schemaBindingCount: schemaBindings.length,
  };
}

export function assertRestBindingRegistryParity(
  contracts: readonly ApiRouteContract<unknown, unknown>[],
  restBindings: readonly RestOperationBinding[]
): void {
  if (contracts.length !== restBindings.length) {
    throw new Error(
      `REST binding count ${restBindings.length} must match registry count ${contracts.length}.`
    );
  }

  for (const [index, contract] of contracts.entries()) {
    const binding = restBindings[index];
    if (binding === undefined) {
      throw new Error(`Missing REST binding for contract ${contract.id}.`);
    }

    if (String(binding.operationId) !== contract.id) {
      throw new Error(
        `REST binding operationId ${String(binding.operationId)} must match contract id ${contract.id}.`
      );
    }

    if (binding.method !== contract.method || binding.path !== contract.path) {
      throw new Error(
        `REST binding ${contract.id} method/path drift from registry contract.`
      );
    }
  }
}

export function assertRestSchemaBindingRegistryParity(
  contracts: readonly ApiRouteContract<unknown, unknown>[],
  schemaBindings: readonly RestSchemaBinding[]
): void {
  if (contracts.length !== schemaBindings.length) {
    throw new Error(
      `REST schema binding count ${schemaBindings.length} must match registry count ${contracts.length}.`
    );
  }

  for (const [index, contract] of contracts.entries()) {
    const binding = schemaBindings[index];
    if (binding === undefined) {
      throw new Error(
        `Missing REST schema binding for contract ${contract.id}.`
      );
    }

    if (String(binding.operationId) !== contract.id) {
      throw new Error(
        `REST schema binding operationId drift for contract ${contract.id}.`
      );
    }
  }
}

export function collectErpRestBindingConsumptionViolations(input: {
  readonly apiRoot: string;
  readonly contractExports: Record<string, ApiRouteContract<unknown, unknown>>;
  readonly operationIds: readonly ApiOperationId[];
  readonly registryContracts: readonly ApiRouteContract<unknown, unknown>[];
}): readonly string[] {
  const violations: string[] = [];

  violations.push(
    ...validateApiContractRegistryCoverage({
      apiRoot: input.apiRoot,
      contractExports: input.contractExports,
      registryContracts: input.registryContracts,
    })
  );

  const restBindings = buildRestOperationBindingRegistry(
    input.registryContracts
  );
  const schemaBindings = buildRestSchemaBindingRegistry(
    input.registryContracts
  );

  try {
    assertRestBindingRegistryParity(input.registryContracts, restBindings);
  } catch (error) {
    violations.push(
      error instanceof Error ? error.message : "REST binding parity failed."
    );
  }

  try {
    assertRestSchemaBindingRegistryParity(
      input.registryContracts,
      schemaBindings
    );
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "REST schema binding parity failed."
    );
  }

  for (const { filePath } of collectGovernedRouteContractExportNames(
    input.apiRoot
  )) {
    if (
      !(filePath.includes("internal\\v1") || filePath.includes("internal/v1"))
    ) {
      violations.push(
        `Governed route ${filePath} must live under internal/v1 namespace.`
      );
    }
  }

  if (input.operationIds.length !== input.registryContracts.length) {
    violations.push(
      "Family operation registry length must match API_CONTRACTS length."
    );
  }

  return violations;
}
