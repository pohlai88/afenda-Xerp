import { describe, expect, it } from "vitest";
import { METADATA_RUNTIME_STATES } from "../metadata.constants.js";
import { METADATA_CONTRACT_VERSION } from "../metadata.version.js";
import {
  createMetadataRuntimeContext,
  RUNTIME_CONTRACT_OWNERSHIPS,
  RUNTIME_CONTRACT_PROHIBITIONS,
  runtimeContract,
} from "../runtime.contract.js";

function expectUniqueValues(values: readonly string[]): void {
  expect(new Set(values).size).toBe(values.length);
}

describe("runtimeContract", () => {
  it("declares runtime authority", () => {
    expect(runtimeContract.authority).toBe("runtime");
  });

  it("uses the canonical metadata contract version", () => {
    expect(runtimeContract.version).toBe(METADATA_CONTRACT_VERSION);
  });

  it("owns only canonical runtime responsibilities", () => {
    expect(runtimeContract.owns).toEqual(RUNTIME_CONTRACT_OWNERSHIPS);
  });

  it("exposes canonical runtime states", () => {
    expect(runtimeContract.states).toEqual(METADATA_RUNTIME_STATES);
  });

  it("declares canonical runtime prohibitions", () => {
    expect(runtimeContract.prohibits).toEqual(RUNTIME_CONTRACT_PROHIBITIONS);
  });

  it("does not contain duplicate values", () => {
    expectUniqueValues(runtimeContract.owns);
    expectUniqueValues(runtimeContract.states);
    expectUniqueValues(runtimeContract.prohibits);
  });

  it("does not own prohibited responsibilities", () => {
    const owns = new Set(runtimeContract.owns);

    for (const prohibited of runtimeContract.prohibits) {
      expect(owns.has(prohibited as never)).toBe(false);
    }
  });

  it("keeps runtime contract separate from execution services", () => {
    expect(runtimeContract.prohibits).toEqual(
      expect.arrayContaining([
        "permission-execution",
        "policy-execution",
        "database-access",
        "auth-services",
        "observability-services",
        "business-logic",
      ])
    );
  });
});

describe("createMetadataRuntimeContext", () => {
  it("creates a safe default runtime context", () => {
    expect(createMetadataRuntimeContext()).toEqual({
      density: "default",
      presentationMode: "default",
      state: "ready",
      diagnosticsEnabled: false,
      readonlyMode: false,
    });
  });

  it("creates a runtime context from resolved execution carriers", () => {
    const context = createMetadataRuntimeContext({
      actorId: "user_001",
      tenantId: "tenant_001",
      organizationId: "org_001",
      workspaceId: "workspace_001",
      correlationId: "corr_001",
      permissions: ["system_admin.users.read"],
      capabilities: ["metadata.surface.render"],
      featureFlags: ["metadata-diagnostics"],
      density: "comfortable",
      presentationMode: "diagnostic",
      state: "ready",
      diagnosticsEnabled: true,
      readonlyMode: true,
    });

    expect(context).toEqual({
      actorId: "user_001",
      tenantId: "tenant_001",
      organizationId: "org_001",
      workspaceId: "workspace_001",
      correlationId: "corr_001",
      permissions: ["system_admin.users.read"],
      capabilities: ["metadata.surface.render"],
      featureFlags: ["metadata-diagnostics"],
      density: "comfortable",
      presentationMode: "diagnostic",
      state: "ready",
      diagnosticsEnabled: true,
      readonlyMode: true,
    });
  });
});
