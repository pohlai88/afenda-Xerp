import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  buildErpApiContextBridgeAttestation,
  collectErpApiContextBridgeViolations,
  ERP_API_CONTEXT_PROTECTED_SURFACE,
  ERP_API_CONTEXT_RESOLVER_MODULE,
  ERP_API_CONTEXT_SPINE_WIRING,
  summarizeRestConsumptionForContextBridge,
} from "@/server/api/contracts/erp-api-context-bridge.contract";
import { buildErpRestBindingConsumptionAttestation } from "@/server/api/contracts/erp-rest-binding-consumption.contract";

const apiRoot = join(import.meta.dirname, "../../../app/api");

describe("ErpApiContextBridge (PAS-001A-API-BINDING-S3)", () => {
  it("declares IS-002 bridge from IS-004 API-007 context policies", () => {
    const attestation = buildErpApiContextBridgeAttestation({
      contracts: API_CONTRACTS,
    });

    expect(attestation.bindingKind).toBe("erp-api-context-bridge");
    expect(attestation.integrationSurfaceId).toBe("IS-002");
    expect(attestation.upstreamApiSurfaceId).toBe("IS-004");
    expect(attestation.consumesFamilyInvariant).toBe("API-007");
    expect(attestation.resolverModule).toBe(ERP_API_CONTEXT_RESOLVER_MODULE);
    expect(attestation.contextRequiredOperationCount).toBeGreaterThan(0);
    expect(attestation.spineWiringEntryCount).toBe(
      ERP_API_CONTEXT_SPINE_WIRING.length
    );
  });

  it("keeps context bridge attestation JSON-serializable", () => {
    const attestation = buildErpApiContextBridgeAttestation({
      contracts: API_CONTRACTS,
    });
    const serialized = JSON.parse(
      JSON.stringify(attestation)
    ) as typeof attestation;

    expect(serialized.integrationSurfaceId).toBe("IS-002");
    expect(serialized.protectedApiSurfaceId).toBe(
      ERP_API_CONTEXT_PROTECTED_SURFACE.id
    );
  });

  it("proves protected operations declare spine-resolved operating context", () => {
    const violations = collectErpApiContextBridgeViolations({
      contracts: API_CONTRACTS,
    });

    expect(violations).toEqual([]);

    const restAttestation = buildErpRestBindingConsumptionAttestation({
      apiRoot,
      contracts: API_CONTRACTS,
    });
    const lineage = summarizeRestConsumptionForContextBridge(restAttestation);

    expect(lineage.upstreamSurface).toBe("IS-004");
    expect(lineage.operationCount).toBe(API_CONTRACTS.length);
  });
});
