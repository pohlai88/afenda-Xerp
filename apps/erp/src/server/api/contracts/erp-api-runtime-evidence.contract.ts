/**
 * PAS-001A-API-BINDING-S5 — ERP runtime evidence.
 *
 * Composite attestation for IS-004 Production Accepted — route, handler,
 * context, auth, and audit proof. Evidence sync only; no new API meaning.
 */

import { readFileSync } from "node:fs";

import type { ApiRouteContract } from "./api-contract";
import {
  API_HANDLER_BOUNDARY_TEST_PATH,
  API_OPENAPI_DOCUMENT_TEST_PATH,
  API_POLICY_CONTRACTS_TEST_PATH,
  API_ROUTE_CATALOG_TEST_PATH,
  ERP_API_AUTH_BRIDGE_TEST_PATH,
  ERP_API_CONSUMPTION_TEST_PATH,
  ERP_API_CONTEXT_BRIDGE_TEST_PATH,
  ERP_REST_BINDING_CONSUMPTION_TEST_PATH,
} from "./api-governance.constants";
import {
  collectGovernedRouteContractExportNames,
  collectRouteFiles,
  isAllowlistedRoute,
  isGovernedRouteSource,
} from "./api-route-coverage";
import { assertMethodPolicy } from "./api-route-policy.contract";
import { assertRegistryCorrelationPolicy } from "./core/api-audit-replay.contract";
import type { ApiOperationId } from "./core/api-operation-id.contract";
import { collectErpApiAuthBridgeViolations } from "./erp-api-auth-bridge.contract";
import {
  collectErpApiConsumptionViolations,
  getRegistryOperationIds,
} from "./erp-api-consumption.contract";
import { collectErpApiContextBridgeViolations } from "./erp-api-context-bridge.contract";
import {
  collectErpRestBindingConsumptionViolations,
  ERP_INTERNAL_V1_ROUTE_ROOT,
} from "./erp-rest-binding-consumption.contract";
import { buildRestOperationBindingRegistry } from "./rest-operation-binding.contract";

export const ERP_API_RUNTIME_HANDLER_MODULE =
  "apps/erp/src/server/api/runtime/create-api-handler.ts" as const;

export const ERP_API_RUNTIME_AUDIT_MODULE =
  "apps/erp/src/server/api/runtime/api-handler-audit.ts" as const;

export const ERP_API_RUNTIME_MATURITY = "production-accepted" as const;

export const ERP_API_RUNTIME_EVIDENCE_GATES = [
  "check:api-contracts",
  "check:openapi-drift",
  "check:api-route-catalog",
  "lint:openapi",
] as const;

export const ERP_API_BINDING_SLICE_MODULES = [
  "apps/erp/src/server/api/contracts/erp-api-consumption.contract.ts",
  "apps/erp/src/server/api/contracts/erp-rest-binding-consumption.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-context-bridge.contract.ts",
  "apps/erp/src/server/api/contracts/erp-api-auth-bridge.contract.ts",
] as const;

export const ERP_API_RUNTIME_EVIDENCE_TEST_PATHS = [
  API_HANDLER_BOUNDARY_TEST_PATH,
  API_ROUTE_CATALOG_TEST_PATH,
  API_OPENAPI_DOCUMENT_TEST_PATH,
  API_POLICY_CONTRACTS_TEST_PATH,
  ERP_API_CONSUMPTION_TEST_PATH,
  ERP_REST_BINDING_CONSUMPTION_TEST_PATH,
  ERP_API_CONTEXT_BRIDGE_TEST_PATH,
  ERP_API_AUTH_BRIDGE_TEST_PATH,
] as const;

export interface ErpApiRuntimeEvidenceAttestation {
  readonly auditModule: typeof ERP_API_RUNTIME_AUDIT_MODULE;
  readonly bindingSliceCount: number;
  readonly bindingSliceModules: typeof ERP_API_BINDING_SLICE_MODULES;
  readonly evidenceGateCount: number;
  readonly evidenceTestPathCount: number;
  readonly governedRouteCount: number;
  readonly handlerModule: typeof ERP_API_RUNTIME_HANDLER_MODULE;
  readonly integrationSurfaceId: "IS-004";
  readonly kind: "erp-api-runtime-evidence";
  readonly maturity: typeof ERP_API_RUNTIME_MATURITY;
  readonly operationCount: number;
  readonly routeRoot: typeof ERP_INTERNAL_V1_ROUTE_ROOT;
}

export function buildErpApiRuntimeEvidenceAttestation(input: {
  readonly apiRoot: string;
  readonly contracts: readonly ApiRouteContract<unknown, unknown>[];
}): ErpApiRuntimeEvidenceAttestation {
  const governedRoutes = collectGovernedRouteContractExportNames(input.apiRoot);

  return {
    auditModule: ERP_API_RUNTIME_AUDIT_MODULE,
    bindingSliceCount: ERP_API_BINDING_SLICE_MODULES.length,
    bindingSliceModules: ERP_API_BINDING_SLICE_MODULES,
    evidenceGateCount: ERP_API_RUNTIME_EVIDENCE_GATES.length,
    evidenceTestPathCount: ERP_API_RUNTIME_EVIDENCE_TEST_PATHS.length,
    governedRouteCount: governedRoutes.length,
    handlerModule: ERP_API_RUNTIME_HANDLER_MODULE,
    integrationSurfaceId: "IS-004",
    kind: "erp-api-runtime-evidence",
    maturity: ERP_API_RUNTIME_MATURITY,
    operationCount: input.contracts.length,
    routeRoot: ERP_INTERNAL_V1_ROUTE_ROOT,
  };
}

export function assertGovernedRoutesUseHandlerRuntime(apiRoot: string): void {
  for (const filePath of collectRouteFiles(apiRoot)) {
    if (isAllowlistedRoute(filePath)) {
      continue;
    }

    const source = readFileSync(filePath, "utf8");
    if (!isGovernedRouteSource(source)) {
      throw new Error(
        `Governed route ${filePath} must use createApiHandler runtime.`
      );
    }
  }
}

export function collectErpApiRuntimeEvidenceViolations(input: {
  readonly apiRoot: string;
  readonly contractExports: Record<string, ApiRouteContract<unknown, unknown>>;
  readonly operationIds: readonly ApiOperationId[];
  readonly registryContracts: readonly ApiRouteContract<unknown, unknown>[];
}): readonly string[] {
  const violations: string[] = [];
  const restBindings = buildRestOperationBindingRegistry(
    input.registryContracts
  );

  violations.push(
    ...collectErpApiConsumptionViolations({
      operationIds: input.operationIds,
      restBindings,
    })
  );

  violations.push(
    ...collectErpRestBindingConsumptionViolations({
      apiRoot: input.apiRoot,
      contractExports: input.contractExports,
      operationIds: input.operationIds,
      registryContracts: input.registryContracts,
    })
  );

  violations.push(
    ...collectErpApiContextBridgeViolations({
      contracts: input.registryContracts,
    })
  );

  violations.push(
    ...collectErpApiAuthBridgeViolations({
      contracts: input.registryContracts,
    })
  );

  try {
    assertGovernedRoutesUseHandlerRuntime(input.apiRoot);
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "Handler runtime assertion failed."
    );
  }

  try {
    assertRegistryCorrelationPolicy(input.registryContracts);
  } catch (error) {
    violations.push(
      error instanceof Error
        ? error.message
        : "Correlation policy assertion failed."
    );
  }

  for (const contract of input.registryContracts) {
    try {
      assertMethodPolicy(contract);
    } catch (error) {
      violations.push(
        error instanceof Error
          ? error.message
          : "Method/audit policy assertion failed."
      );
    }
  }

  return violations;
}

/** Re-export for attestation tests — operation ids flow from family layer. */
export { getRegistryOperationIds };
