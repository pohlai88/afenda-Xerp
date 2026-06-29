import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  API_OPERATION_REGISTRY,
  GOVERNED_ROUTE_CONTRACT_EXPORTS,
} from "@/server/api/contracts/api-contract-registry";
import { getRegistryOperationIds } from "@/server/api/contracts/erp-api-consumption.contract";
import {
  buildErpRestBindingConsumptionAttestation,
  collectErpRestBindingConsumptionViolations,
  ERP_INTERNAL_V1_ROUTE_ROOT,
} from "@/server/api/contracts/erp-rest-binding-consumption.contract";
import { REST_INTERNAL_V1_NAMESPACE } from "@/server/api/contracts/rest-operation-binding.contract";

const apiRoot = join(import.meta.dirname, "../../../app/api");

describe("ErpRestBindingConsumption (PAS-001A-API-BINDING-S2)", () => {
  it("declares IS-004 consumption of PAS-API-REST-001 internal v1 bindings", () => {
    const attestation = buildErpRestBindingConsumptionAttestation({
      apiRoot,
      contracts: API_CONTRACTS,
    });

    expect(attestation.bindingKind).toBe("erp-rest-binding-consumption");
    expect(attestation.integrationSurfaceId).toBe("IS-004");
    expect(attestation.namespace).toBe(REST_INTERNAL_V1_NAMESPACE);
    expect(attestation.consumesStyleBindingPas).toBe("PAS-API-REST-001");
    expect(attestation.routeRoot).toBe(ERP_INTERNAL_V1_ROUTE_ROOT);
    expect(attestation.operationCount).toBe(API_CONTRACTS.length);
    expect(attestation.governedRouteCount).toBeGreaterThan(0);
  });

  it("keeps REST binding consumption attestation JSON-serializable", () => {
    const attestation = buildErpRestBindingConsumptionAttestation({
      apiRoot,
      contracts: API_CONTRACTS,
    });
    const serialized = JSON.parse(
      JSON.stringify(attestation)
    ) as typeof attestation;

    expect(serialized.integrationSurfaceId).toBe("IS-004");
    expect(serialized.parentConsumption.role).toBe("consumer");
  });

  it("proves all governed internal v1 routes reference the API registry", () => {
    const operationIds = getRegistryOperationIds(API_OPERATION_REGISTRY);
    const violations = collectErpRestBindingConsumptionViolations({
      apiRoot,
      contractExports: GOVERNED_ROUTE_CONTRACT_EXPORTS,
      operationIds,
      registryContracts: API_CONTRACTS,
    });

    expect(violations).toEqual([]);
  });
});
