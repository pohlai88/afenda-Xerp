import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  API_CONTRACTS,
  API_OPERATION_REGISTRY,
  GOVERNED_ROUTE_CONTRACT_EXPORTS,
} from "@/server/api/contracts/api-contract-registry";
import {
  ERP_API_BRIDGE_SLICE_MODULES,
  ERP_API_RUNTIME_MATURITY,
} from "@/server/api/contracts/erp-api-binding-track.contract";
import {
  buildErpApiRuntimeEvidenceAttestation,
  collectErpApiRuntimeEvidenceViolations,
  ERP_API_RUNTIME_EVIDENCE_GATES,
  ERP_API_RUNTIME_EVIDENCE_TEST_PATHS,
  ERP_API_RUNTIME_HANDLER_MODULE,
  getRegistryOperationIds,
} from "@/server/api/contracts/erp-api-runtime-evidence.contract";

const apiRoot = join(import.meta.dirname, "../../../app/api");

describe("ErpApiRuntimeEvidence (PAS-001A-API-BINDING-S5)", () => {
  it("declares IS-004 production-accepted runtime evidence bundle", () => {
    const attestation = buildErpApiRuntimeEvidenceAttestation({
      apiRoot,
      contracts: API_CONTRACTS,
    });

    expect(attestation.bindingKind).toBe("erp-api-runtime-evidence");
    expect(attestation.integrationSurfaceId).toBe("IS-004");
    expect(attestation.maturity).toBe(ERP_API_RUNTIME_MATURITY);
    expect(attestation.handlerModule).toBe(ERP_API_RUNTIME_HANDLER_MODULE);
    expect(attestation.bindingSliceCount).toBe(
      ERP_API_BRIDGE_SLICE_MODULES.length
    );
    expect(attestation.evidenceGateCount).toBe(
      ERP_API_RUNTIME_EVIDENCE_GATES.length
    );
    expect(attestation.evidenceTestPathCount).toBe(
      ERP_API_RUNTIME_EVIDENCE_TEST_PATHS.length
    );
    expect(attestation.governedRouteCount).toBeGreaterThan(0);
  });

  it("keeps runtime evidence attestation JSON-serializable", () => {
    const attestation = buildErpApiRuntimeEvidenceAttestation({
      apiRoot,
      contracts: API_CONTRACTS,
    });
    const serialized = JSON.parse(
      JSON.stringify(attestation)
    ) as typeof attestation;

    expect(serialized.maturity).toBe("production-accepted");
    expect(serialized.bindingSliceModules).toHaveLength(4);
  });

  it("proves composite route handler context auth and audit evidence", () => {
    const operationIds = getRegistryOperationIds(API_OPERATION_REGISTRY);
    const violations = collectErpApiRuntimeEvidenceViolations({
      apiRoot,
      contractExports: GOVERNED_ROUTE_CONTRACT_EXPORTS,
      operationIds,
      registryContracts: API_CONTRACTS,
    });

    expect(violations).toEqual([]);
    expect(operationIds.length).toBe(API_CONTRACTS.length);
  });
});
