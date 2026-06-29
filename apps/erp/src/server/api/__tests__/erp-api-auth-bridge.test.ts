import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  buildErpApiAuthBridgeAttestation,
  collectErpApiAuthBridgeViolations,
  ERP_API_AUTH_ACTOR_MODULE,
  ERP_API_AUTH_SPINE_WIRING,
  ERP_API_ROUTE_PERMISSION_MODULE,
  summarizeContextBridgeForAuthBridge,
} from "@/server/api/contracts/erp-api-auth-bridge.contract";
import {
  buildErpApiContextBridgeAttestation,
  ERP_API_CONTEXT_AUTHORIZATION_MODULE,
} from "@/server/api/contracts/erp-api-context-bridge.contract";

describe("ErpApiAuthBridge (PAS-001A-API-BINDING-S4)", () => {
  it("declares IS-001 bridge from IS-004 API-006/API-008 policy declarations", () => {
    const attestation = buildErpApiAuthBridgeAttestation({
      contracts: API_CONTRACTS,
    });

    expect(attestation.bindingKind).toBe("erp-api-auth-bridge");
    expect(attestation.integrationSurfaceId).toBe("IS-001");
    expect(attestation.upstreamApiSurfaceId).toBe("IS-004");
    expect(attestation.consumesFamilyInvariants).toEqual([
      "API-006",
      "API-008",
    ]);
    expect(attestation.authorizationModule).toBe(
      ERP_API_CONTEXT_AUTHORIZATION_MODULE
    );
    expect(attestation.authActorModule).toBe(ERP_API_AUTH_ACTOR_MODULE);
    expect(attestation.routePermissionModule).toBe(
      ERP_API_ROUTE_PERMISSION_MODULE
    );
    expect(attestation.protectedOperationCount).toBeGreaterThan(0);
    expect(attestation.spineWiringEntryCount).toBe(
      ERP_API_AUTH_SPINE_WIRING.length
    );
  });

  it("keeps auth bridge attestation JSON-serializable", () => {
    const attestation = buildErpApiAuthBridgeAttestation({
      contracts: API_CONTRACTS,
    });
    const serialized = JSON.parse(
      JSON.stringify(attestation)
    ) as typeof attestation;

    expect(serialized.integrationSurfaceId).toBe("IS-001");
    expect(serialized.consumesFamilyInvariants).toContain("API-008");
  });

  it("proves contracts declare auth intent and defer evaluation to IS-001 spine", () => {
    const violations = collectErpApiAuthBridgeViolations({
      contracts: API_CONTRACTS,
    });

    expect(violations).toEqual([]);

    const contextAttestation = buildErpApiContextBridgeAttestation({
      contracts: API_CONTRACTS,
    });
    const lineage = summarizeContextBridgeForAuthBridge(contextAttestation);

    expect(lineage.upstreamSurface).toBe("IS-002");
    expect(lineage.operationCount).toBe(API_CONTRACTS.length);
  });
});
