import { describe, expect, it } from "vitest";
import {
  createMetadataGovernanceError,
  createMetadataRuntimeContext,
  crossPackageAuthority,
  layoutContract,
  metadataAiGovernanceRules,
  metadataAuthorityMap,
  metadataContract,
  metadataUiIntegrationRule,
  presentationContract,
  RENDERER_COMPATIBILITY_RULES,
  registryContract,
  rendererContract,
  runtimeContract,
  sectionContract,
  surfaceContract,
} from "../index.js";

const serializableContractValues = [
  metadataContract,
  surfaceContract,
  layoutContract,
  sectionContract,
  rendererContract,
  registryContract,
  presentationContract,
  runtimeContract,
  metadataAuthorityMap,
  metadataAiGovernanceRules,
  crossPackageAuthority,
  metadataUiIntegrationRule,
  RENDERER_COMPATIBILITY_RULES,
] as const;

describe("contract serialization", () => {
  it("round-trips public contract objects through JSON without loss", () => {
    for (const value of serializableContractValues) {
      expect(JSON.parse(JSON.stringify(value))).toEqual(value);
    }
  });

  it("serializes runtime context and governance errors for boundary transport", () => {
    const runtime = createMetadataRuntimeContext({
      readonlyMode: true,
      state: "ready",
    });

    const error = createMetadataGovernanceError({
      code: "metadata-governance.invalid-registry-entry",
      message: "Invalid registry entry.",
      context: { field: "id" },
    });

    expect(JSON.parse(JSON.stringify(runtime))).toEqual(runtime);
    expect(JSON.parse(JSON.stringify(error.toJSON()))).toEqual(error.toJSON());
  });

  it("serializes ERP operating-context carrier fields for metadata wire transport", () => {
    const runtime = createMetadataRuntimeContext({
      actorId: "user_001",
      tenantId: "tenant_001",
      companyId: "company_001",
      organizationId: "org_001",
      entityGroupId: "eg_001",
      teamId: "team_001",
      projectId: "project_001",
      workspaceId: "tenant_001:company_001:org_001",
      surfaceId: "surface_001",
      workflowId: "workflow_001",
      consolidationReportingDate: "2026-06-29",
      permissionGrantScopeType: "legal_entity",
      ownershipInterestCount: 2,
      correlationId: "corr_001",
      permissions: ["system_admin.users.read"],
      capabilities: ["metadata.surface.render"],
      density: "default",
      presentationMode: "default",
      state: "ready",
      diagnosticsEnabled: false,
      readonlyMode: false,
    });

    expect(JSON.parse(JSON.stringify(runtime))).toEqual(runtime);
  });
});
