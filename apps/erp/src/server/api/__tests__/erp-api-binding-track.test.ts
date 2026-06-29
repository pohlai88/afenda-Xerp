import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { API_CONTRACTS } from "@/server/api/contracts/api-contract-registry";
import { ERP_API_BINDING_ATTESTATION_TEST_PATHS } from "@/server/api/contracts/api-governance.constants";
import {
  assertBindingTrackSliceModulesComplete,
  ERP_API_BINDING_SLICE_MODULES,
  ERP_API_BINDING_TRACK_SLICE_COUNT,
  ERP_API_BINDING_TRACK_STATUS,
  ERP_API_BRIDGE_SLICE_MODULES,
  ERP_API_RUNTIME_MATURITY,
} from "@/server/api/contracts/erp-api-binding-track.contract";
import {
  buildErpApiReleaseGateAttestation,
  ERP_API_BINDING_TRACK_SLICE_COUNT as releaseGateSliceCount,
  ERP_API_BINDING_SLICE_MODULES as releaseGateSliceModules,
  ERP_API_BINDING_TRACK_STATUS as releaseGateTrackStatus,
} from "@/server/api/contracts/erp-api-release-gate.contract";
import { buildErpApiRuntimeEvidenceAttestation } from "@/server/api/contracts/erp-api-runtime-evidence.contract";

const repoRoot = join(import.meta.dirname, "../../../../../../");

describe("ErpApiBindingTrack (PAS-001A-API-BINDING SSOT)", () => {
  it("declares complete S1-S7 track with four bridge modules", () => {
    assertBindingTrackSliceModulesComplete();
    expect(ERP_API_BINDING_SLICE_MODULES).toHaveLength(
      ERP_API_BINDING_TRACK_SLICE_COUNT
    );
    expect(ERP_API_BRIDGE_SLICE_MODULES).toHaveLength(4);
    expect(ERP_API_BINDING_TRACK_STATUS).toBe("delivered");
    expect(ERP_API_RUNTIME_MATURITY).toBe("production-accepted");
  });

  it("maps every slice module to an existing contract file", () => {
    for (const modulePath of ERP_API_BINDING_SLICE_MODULES) {
      expect(existsSync(join(repoRoot, modulePath))).toBe(true);
    }
  });

  it("re-exports track constants from S7 release gate without drift", () => {
    expect(releaseGateSliceModules).toEqual(ERP_API_BINDING_SLICE_MODULES);
    expect(releaseGateSliceCount).toBe(ERP_API_BINDING_TRACK_SLICE_COUNT);
    expect(releaseGateTrackStatus).toBe(ERP_API_BINDING_TRACK_STATUS);
  });

  it("registers all S1-S7 attestation tests in governance constants", () => {
    expect(ERP_API_BINDING_ATTESTATION_TEST_PATHS).toHaveLength(
      ERP_API_BINDING_TRACK_SLICE_COUNT
    );

    for (const testPath of ERP_API_BINDING_ATTESTATION_TEST_PATHS) {
      expect(existsSync(join(repoRoot, testPath))).toBe(true);
    }
  });

  it("uses bindingKind (not legacy kind) on S5 runtime evidence attestation", () => {
    const attestation = buildErpApiRuntimeEvidenceAttestation({
      apiRoot: join(import.meta.dirname, "../../../app/api"),
      contracts: API_CONTRACTS,
    });

    expect(attestation.bindingKind).toBe("erp-api-runtime-evidence");
    expect(attestation).not.toHaveProperty("kind");
  });

  it("keeps track and release gate attestations JSON-serializable", () => {
    const releaseGate = buildErpApiReleaseGateAttestation({
      contracts: API_CONTRACTS,
    });
    const serialized = JSON.parse(
      JSON.stringify(releaseGate)
    ) as typeof releaseGate;

    expect(serialized.bindingKind).toBe("erp-api-release-gate");
    expect(serialized.bindingSliceModules).toHaveLength(
      ERP_API_BINDING_TRACK_SLICE_COUNT
    );
    expect(serialized).not.toHaveProperty("kind");
  });
});
