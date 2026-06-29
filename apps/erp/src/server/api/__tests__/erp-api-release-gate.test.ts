import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  API_OPERATION_REGISTRY,
  GOVERNED_ROUTE_CONTRACT_EXPORTS,
} from "@/server/api/contracts/api-contract-registry";
import {
  buildErpApiReleaseGateAttestation,
  collectErpApiReleaseGateViolations,
  ERP_API_BINDING_TRACK_SLICE_COUNT,
  ERP_API_BINDING_TRACK_STATUS,
  ERP_API_RELEASE_GATES,
  ERP_API_RELEASE_RESERVED_STYLE_BINDINGS,
} from "@/server/api/contracts/erp-api-release-gate.contract";
import { getRegistryOperationIds } from "@/server/api/contracts/erp-api-runtime-evidence.contract";

const apiRoot = join(import.meta.dirname, "../../../app/api");

describe("ErpApiReleaseGate (PAS-001A-API-BINDING-S7)", () => {
  it("declares IS-004 release gate with full S1-S7 binding track closure", () => {
    const attestation = buildErpApiReleaseGateAttestation({
      contracts: API_CONTRACTS,
    });

    expect(attestation.bindingKind).toBe("erp-api-release-gate");
    expect(attestation.integrationSurfaceId).toBe("IS-004");
    expect(attestation.bindingTrackStatus).toBe(ERP_API_BINDING_TRACK_STATUS);
    expect(attestation.bindingSliceCount).toBe(
      ERP_API_BINDING_TRACK_SLICE_COUNT
    );
    expect(attestation.releaseGateCount).toBe(ERP_API_RELEASE_GATES.length);
    expect(attestation.activeStyleBindingPas).toBe("PAS-API-REST-001");
    expect(attestation.maturity).toBe("production-accepted");
    expect(attestation.reservedStyleBindingCount).toBe(
      ERP_API_RELEASE_RESERVED_STYLE_BINDINGS.length
    );
  });

  it("keeps release gate attestation JSON-serializable", () => {
    const attestation = buildErpApiReleaseGateAttestation({
      contracts: API_CONTRACTS,
    });
    const serialized = JSON.parse(
      JSON.stringify(attestation)
    ) as typeof attestation;

    expect(serialized.bindingTrackStatus).toBe("delivered");
    expect(serialized.releaseGates).toContain("check:api-contracts");
    expect(serialized.releaseGates).toContain("check:foundation-disposition");
  });

  it("proves composite S1-S6 evidence passes with zero release gate violations", () => {
    const operationIds = getRegistryOperationIds(API_OPERATION_REGISTRY);
    const violations = collectErpApiReleaseGateViolations({
      apiRoot,
      contractExports: GOVERNED_ROUTE_CONTRACT_EXPORTS,
      operationIds,
      registryContracts: API_CONTRACTS,
    });

    expect(violations).toEqual([]);
    expect(operationIds.length).toBe(API_CONTRACTS.length);
  });
});
