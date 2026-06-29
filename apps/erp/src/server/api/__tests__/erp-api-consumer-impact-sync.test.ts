import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import {
  buildErpApiConsumerImpactSyncAttestation,
  collectErpApiConsumerImpactSyncViolations,
  ERP_API_CONSUMER_IMPACT_FAMILY_INVARIANT,
  ERP_API_CONSUMER_IMPACT_OWNER,
  ERP_API_CONSUMER_IMPACT_SURFACES,
  summarizeRuntimeEvidenceForConsumerImpactSync,
} from "@/server/api/contracts/erp-api-consumer-impact-sync.contract";
import { buildErpApiRuntimeEvidenceAttestation } from "@/server/api/contracts/erp-api-runtime-evidence.contract";

const apiRoot = join(import.meta.dirname, "../../../app/api");

describe("ErpApiConsumerImpactSync (PAS-001A-API-BINDING-S6)", () => {
  it("declares IS-004 consumer impact sync for ERP UI and internal services", () => {
    const attestation = buildErpApiConsumerImpactSyncAttestation({
      contracts: API_CONTRACTS,
    });

    expect(attestation.bindingKind).toBe("erp-api-consumer-impact-sync");
    expect(attestation.integrationSurfaceId).toBe("IS-004");
    expect(attestation.consumesFamilyInvariant).toBe(
      ERP_API_CONSUMER_IMPACT_FAMILY_INVARIANT
    );
    expect(attestation.consumerImpactOwner).toBe(ERP_API_CONSUMER_IMPACT_OWNER);
    expect(attestation.erpConsumerSurfaceCount).toBe(
      ERP_API_CONSUMER_IMPACT_SURFACES.length
    );
    expect(attestation.activeOperationCount).toBeGreaterThan(0);
  });

  it("keeps consumer impact sync attestation JSON-serializable", () => {
    const attestation = buildErpApiConsumerImpactSyncAttestation({
      contracts: API_CONTRACTS,
    });
    const serialized = JSON.parse(
      JSON.stringify(attestation)
    ) as typeof attestation;

    expect(serialized.consumesFamilyInvariant).toBe("API-014");
    expect(serialized.consumerImpactOwner).toBe("platform-api-contract");
  });

  it("classifies ERP consumer impact on all registry operations without violations", () => {
    const violations = collectErpApiConsumerImpactSyncViolations({
      contracts: API_CONTRACTS,
    });

    expect(violations).toEqual([]);

    const runtimeAttestation = buildErpApiRuntimeEvidenceAttestation({
      apiRoot,
      contracts: API_CONTRACTS,
    });
    const lineage =
      summarizeRuntimeEvidenceForConsumerImpactSync(runtimeAttestation);

    expect(lineage.maturity).toBe("production-accepted");
    expect(lineage.operationCount).toBe(API_CONTRACTS.length);
  });
});
