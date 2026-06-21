import { describe, expect, it } from "vitest";
import {
  crossPackageAuthority,
  createMetadataGovernanceError,
  createMetadataRuntimeContext,
  layoutContract,
  metadataAiGovernanceRules,
  metadataAuthorityMap,
  metadataContract,
  metadataUiIntegrationRule,
  presentationContract,
  registryContract,
  rendererContract,
  RENDERER_COMPATIBILITY_RULES,
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
});
