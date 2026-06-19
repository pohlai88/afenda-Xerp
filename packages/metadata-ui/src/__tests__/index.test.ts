import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createPermissionKey } from "@afenda/permissions";
import { describe, expect, it } from "vitest";
import {
  createExampleRendererRegistry,
  createMetadataRendererRegistry,
  defaultMetadataRenderers,
  getPackageName,
  governedMetadataSectionTypes,
  governedMetadataSurfaceExample,
  isSensitiveMetadataAction,
  metadataSectionSchemas,
  metadataStateSchema,
  PACKAGE_NAME,
  resolveMetadataActions,
  resolveMetadataState,
  resolveMetadataStatePresentation,
  resolveMetadataVisibility,
  validateMetadataAction,
  validateMetadataSurface,
} from "../index";

const requiredContractFiles = [
  "metadata-surface.contract.ts",
  "metadata-section.contract.ts",
  "metadata-action.contract.ts",
  "metadata-renderer.contract.ts",
  "metadata-registry.contract.ts",
  "metadata-state.contract.ts",
  "metadata-permission.contract.ts",
  "metadata-audit-panel.contract.ts",
  "metadata-layout.contract.ts",
  "metadata-example.contract.ts",
] as const;

const requiredSectionTypes = [
  "page-header",
  "action-bar",
  "list",
  "form",
  "stat",
  "chart",
  "kanban",
  "detail-tabs",
  "audit-panel",
  "empty-state",
  "surface-chrome",
] as const;

const currentDirectory = dirname(fileURLToPath(import.meta.url));

describe("@afenda/metadata-ui", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/metadata-ui");
    expect(getPackageName()).toBe("@afenda/metadata-ui");
  });

  it("defines the required TIP-007 contract files and section types", () => {
    for (const fileName of requiredContractFiles) {
      expect(
        existsSync(join(currentDirectory, "..", "contracts", fileName))
      ).toBe(true);
    }

    expect(governedMetadataSectionTypes).toEqual(requiredSectionTypes);
    expect(metadataSectionSchemas.map((schema) => schema.type)).toEqual(
      requiredSectionTypes
    );
  });

  it("selects the highest-priority compatible renderer and fails safely", () => {
    const registry = createExampleRendererRegistry();
    const listResolution = registry.resolve("list");
    const unsupportedResolution =
      createMetadataRendererRegistry().resolve("chart");

    expect(listResolution.renderer?.id).toBe("metadata.list.enterprise");
    expect(listResolution.renderer?.priority).toBe(200);
    expect(unsupportedResolution.renderer).toBeNull();
    expect(unsupportedResolution.reason).toContain("No renderer registered");
    expect(defaultMetadataRenderers).toHaveLength(7);
  });

  it("validates governed metadata surfaces and sensitive actions", () => {
    const surfaceValidation = validateMetadataSurface(
      governedMetadataSurfaceExample.surface
    );
    const exportAction = governedMetadataSurfaceExample.surface.actions[0];

    expect(surfaceValidation).toEqual({ valid: true, errors: [] });
    expect(exportAction).toBeDefined();
    expect(
      isSensitiveMetadataAction(exportAction?.category ?? "standard")
    ).toBe(true);
    expect(
      exportAction ? validateMetadataAction(exportAction).valid : false
    ).toBe(true);
    expect(JSON.parse(JSON.stringify(governedMetadataSurfaceExample))).toEqual(
      governedMetadataSurfaceExample
    );
  });

  it("resolves permission-aware visibility without executing actions", () => {
    const exportPermission = createPermissionKey("records", "export");
    const hiddenAction = governedMetadataSurfaceExample.surface.actions[0];

    if (!hiddenAction) {
      throw new Error("Expected governed example action.");
    }

    expect(
      resolveMetadataVisibility(hiddenAction.permission, {
        grantedPermissions: [],
      })
    ).toMatchObject({
      allowed: false,
      effect: "hide",
    });
    expect(
      resolveMetadataActions([hiddenAction], {
        grantedPermissions: [exportPermission],
      })
    ).toEqual([hiddenAction]);
  });

  it("maps screen states through the governed design-system state recipe", () => {
    expect(metadataStateSchema.map((state) => state.state)).toEqual([
      "loading",
      "empty",
      "error",
      "forbidden",
      "invalid",
      "ready",
    ]);

    const presentation = resolveMetadataStatePresentation(
      resolveMetadataState("forbidden")
    );

    expect(presentation).toMatchObject({
      recipe: "status-state",
      recipeAvailable: true,
      state: {
        state: "forbidden",
        tone: "forbidden",
      },
    });
  });
});
