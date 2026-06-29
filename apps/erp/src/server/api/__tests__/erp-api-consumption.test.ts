import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  API_OPERATION_REGISTRY,
} from "@/server/api/contracts/api-contract-registry";
import {
  buildErpApiConsumptionAttestation,
  collectErpApiConsumptionViolations,
  ERP_API_CONSUMPTION_BOUNDARY,
  ERP_API_PROHIBITED_OWNERSHIP,
  ERP_API_SPINE_OWNED_SURFACES,
  getRegistryOperationIds,
} from "@/server/api/contracts/erp-api-consumption.contract";
import { buildRestOperationBindingRegistry } from "@/server/api/contracts/rest-operation-binding.contract";

describe("ErpApiConsumptionBoundary (PAS-001A-API-BINDING-S1)", () => {
  it("declares ERP as consumer of PAS-API-001 and PAS-API-REST-001", () => {
    const attestation = buildErpApiConsumptionAttestation();

    expect(attestation.role).toBe("consumer");
    expect(attestation.integrationSurfaceId).toBe("IS-004");
    expect(attestation.consumesFamilyPas).toBe("PAS-API-001");
    expect(attestation.consumesStyleBindingPas).toBe("PAS-API-REST-001");
    expect(attestation.consumesConsumerBindingPas).toBe("PAS-001A-API-BINDING");
  });

  it("keeps consumption attestation JSON-serializable", () => {
    const serialized = JSON.parse(
      JSON.stringify(ERP_API_CONSUMPTION_BOUNDARY)
    ) as typeof ERP_API_CONSUMPTION_BOUNDARY;

    expect(serialized.integrationSurfaceId).toBe("IS-004");
    expect(serialized.role).toBe("consumer");
  });

  it("proves family registry consumption without violations", () => {
    const operationIds = getRegistryOperationIds(API_OPERATION_REGISTRY);
    const restBindings = buildRestOperationBindingRegistry(API_CONTRACTS);

    expect(
      collectErpApiConsumptionViolations({ operationIds, restBindings })
    ).toEqual([]);
    expect(operationIds.length).toBe(API_CONTRACTS.length);
  });

  it("documents spine-owned surfaces separately from prohibited API ownership", () => {
    expect(ERP_API_SPINE_OWNED_SURFACES.handlerRuntimeWiring).toBe("IS-004");
    expect(ERP_API_PROHIBITED_OWNERSHIP).toContain("api-family-doctrine");
    expect(ERP_API_PROHIBITED_OWNERSHIP).not.toContain("IS-004");
  });
});
