import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as metadataPublicApi from "../index.js";

const indexSourcePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../index.ts"
);

function extractExportedTypeNames(source: string): string[] {
  const typeNames: string[] = [];
  const exportTypePattern = /export type \{([^}]+)\}/g;

  for (const match of source.matchAll(exportTypePattern)) {
    const block = match[1] ?? "";

    for (const entry of block.split(",")) {
      const trimmed = entry.trim();

      if (trimmed.length === 0) {
        continue;
      }

      const exportName = trimmed.split(/\s+/).at(-1);

      if (exportName) {
        typeNames.push(exportName);
      }
    }
  }

  return typeNames;
}

const requiredValueExports = [
  "CROSS_PACKAGE_NAMES",
  "CROSS_PACKAGE_RESPONSIBILITIES",
  "crossPackageAuthority",
  "metadataUiIntegrationRule",
  "LAYOUT_CONTRACT_OWNERSHIPS",
  "LAYOUT_CONTRACT_PROHIBITIONS",
  "layoutContract",
  "LAYOUT_TYPES",
  "METADATA_AUTHORITY_KEYS",
  "METADATA_DENSITY_MODES",
  "METADATA_LIFECYCLES",
  "METADATA_RUNTIME_STATES",
  "PRESENTATION_MODES",
  "RENDERER_CAPABILITIES",
  "SECTION_TYPES",
  "SURFACE_TYPES",
  "isLayoutType",
  "isMetadataAuthorityKey",
  "isMetadataDensityMode",
  "isMetadataLifecycle",
  "isMetadataRuntimeState",
  "isPresentationMode",
  "isRendererCapability",
  "isSectionType",
  "isSurfaceType",
  "METADATA_CONTRACT_GOVERNANCE_RULES",
  "METADATA_CONTRACT_OWNERSHIPS",
  "METADATA_CONTRACT_PROHIBITIONS",
  "metadataContract",
  "createMetadataGovernanceError",
  "isMetadataGovernanceError",
  "METADATA_GOVERNANCE_ERROR_CODES",
  "MetadataGovernanceError",
  "METADATA_PACKAGE_VERSION",
  "METADATA_CONTRACT_VERSION",
  "METADATA_AI_GOVERNANCE_MAY",
  "METADATA_AI_GOVERNANCE_MAY_NOT",
  "METADATA_AI_GOVERNANCE_MUST",
  "METADATA_AUTHORITY_CHANGE_RULES",
  "METADATA_AUTHORITY_CONSUMERS",
  "METADATA_AUTHORITY_OWNERSHIPS",
  "METADATA_AUTHORITY_PROHIBITIONS",
  "metadataAiGovernanceRules",
  "metadataAuthorityMap",
  "PRESENTATION_CONTRACT_OWNERSHIPS",
  "PRESENTATION_CONTRACT_PROHIBITIONS",
  "presentationContract",
  "REGISTRY_CONTRACT_OWNERSHIPS",
  "REGISTRY_CONTRACT_PROHIBITIONS",
  "registryContract",
  "createRegistryEntry",
  "createRegistryEntryId",
  "createRegistryEntryVersion",
  "createRegistryOwnerPackage",
  "getRendererCapabilityForSectionType",
  "isRendererCapabilityCompatibleWithSectionType",
  "RENDERER_COMPATIBILITY_RULES",
  "RENDERER_CONTRACT_OWNERSHIPS",
  "RENDERER_CONTRACT_PROHIBITIONS",
  "rendererContract",
  "createMetadataRuntimeContext",
  "RUNTIME_CONTRACT_OWNERSHIPS",
  "RUNTIME_CONTRACT_PROHIBITIONS",
  "runtimeContract",
  "SECTION_CONTRACT_OWNERSHIPS",
  "SECTION_CONTRACT_PROHIBITIONS",
  "sectionContract",
  "SURFACE_CONTRACT_OWNERSHIPS",
  "SURFACE_CONTRACT_PROHIBITIONS",
  "surfaceContract",
] as const satisfies readonly (keyof typeof metadataPublicApi)[];

const requiredTypeExports = [
  "CrossPackageAuthority",
  "CrossPackageAuthorityEntry",
  "CrossPackageImportPolicy",
  "CrossPackageName",
  "CrossPackageResponsibility",
  "LayoutContract",
  "LayoutContractOwnership",
  "LayoutContractProhibition",
  "MetadataContract",
  "MetadataContractGovernanceRule",
  "MetadataContractOwnership",
  "MetadataContractProhibition",
  "MetadataGovernanceErrorCode",
  "MetadataGovernanceErrorDetails",
  "SerializedMetadataGovernanceError",
  "LayoutType",
  "MetadataAuthorityKey",
  "MetadataDensityMode",
  "MetadataLifecycle",
  "MetadataRuntimeState",
  "PresentationMode",
  "RendererCapability",
  "SectionType",
  "SurfaceType",
  "MetadataContractVersion",
  "MetadataPackageVersion",
  "MetadataAiGovernanceMay",
  "MetadataAiGovernanceMayNot",
  "MetadataAiGovernanceMust",
  "MetadataAiGovernanceRules",
  "MetadataAuthorityChangeRule",
  "MetadataAuthorityConsumer",
  "MetadataAuthorityEntry",
  "MetadataAuthorityMap",
  "MetadataAuthorityOwnership",
  "MetadataAuthorityProhibition",
  "PresentationContract",
  "PresentationContractOwnership",
  "PresentationContractProhibition",
  "RegistryContract",
  "RegistryContractOwnership",
  "RegistryContractProhibition",
  "CreateRegistryEntryInput",
  "RegistryEntry",
  "RegistryEntryId",
  "RegistryEntryVersion",
  "RegistryOwnerPackage",
  "RendererCompatibilityRule",
  "RendererContract",
  "RendererContractOwnership",
  "RendererContractProhibition",
  "CreateMetadataRuntimeContextInput",
  "MetadataRuntimeActorId",
  "MetadataRuntimeCapabilityKey",
  "MetadataRuntimeCompanyId",
  "MetadataRuntimeContext",
  "MetadataRuntimeCorrelationId",
  "MetadataRuntimeFeatureFlagKey",
  "MetadataRuntimeOrganizationId",
  "MetadataRuntimePermissionKey",
  "MetadataRuntimeTenantId",
  "MetadataRuntimeWorkspaceId",
  "RuntimeContract",
  "RuntimeContractOwnership",
  "RuntimeContractProhibition",
  "SectionContract",
  "SectionContractOwnership",
  "SectionContractProhibition",
  "SurfaceContract",
  "SurfaceContractOwnership",
  "SurfaceContractProhibition",
] as const;

describe("public API", () => {
  it("exports all required public symbols from index", () => {
    for (const symbol of requiredValueExports) {
      expect(
        metadataPublicApi[symbol],
        `missing export: ${symbol}`
      ).toBeDefined();
    }
  });

  it("exports all required public types from index", () => {
    const exportedTypeNames = extractExportedTypeNames(
      readFileSync(indexSourcePath, "utf8")
    );

    for (const symbol of requiredTypeExports) {
      expect(
        exportedTypeNames.includes(symbol),
        `missing type export: ${symbol}`
      ).toBe(true);
    }
  });

  it("resolves package export to compiled index only", () => {
    const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as { exports: Record<string, { import: string }> };

    const mainExport = packageJson.exports["."];
    expect(mainExport).toBeDefined();
    expect(mainExport?.import).toBe("./dist/index.js");
  });
});
