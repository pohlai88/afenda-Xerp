import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createPermissionKey } from "@afenda/permissions";
import { describe, expect, it } from "vitest";
import type { MetadataRendererRegistry } from "../index";
import {
  createExampleRendererRegistry,
  createMetadataRendererRegistry,
  defaultMetadataRenderers,
  getPackageName,
  governedMetadataSectionTypes,
  governedMetadataSurfaceExample,
  isSensitiveMetadataAction,
  METADATA_ACTION_CATEGORIES,
  metadataSectionSchemas,
  metadataStateSchema,
  PACKAGE_NAME,
  resolveMetadataActions,
  resolveMetadataState,
  resolveMetadataStatePresentation,
  resolveMetadataVisibility,
  validateMetadataAction,
  validateMetadataSection,
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

const baseLayout = {
  density: "standard",
  recipe: "card",
  region: "main",
} as const;

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

  it("renderer registry lists all renderers sorted by priority descending", () => {
    const registry = createExampleRendererRegistry();
    const renderers = registry.listRenderers();
    const snapshot = registry.snapshot();

    expect(renderers[0]?.priority).toBeGreaterThanOrEqual(
      renderers[1]?.priority ?? 0
    );
    expect(snapshot.sectionTypes).toEqual(requiredSectionTypes);
    expect(snapshot.renderers.length).toBeGreaterThan(0);
  });

  it("renderer registry returns the same instance from register (fluid chain)", () => {
    const registryA = createMetadataRendererRegistry();
    const registryB = registryA.register({
      id: "test.renderer",
      priority: 50,
      recipe: "card",
      sectionTypes: ["stat"],
      stable: false,
    });

    expect(registryB.resolve("stat").renderer?.id).toBe("test.renderer");
  });

  it("MetadataRendererRegistry is a valid exported type", () => {
    const registry: MetadataRendererRegistry = createMetadataRendererRegistry();
    expect(typeof registry.resolve).toBe("function");
    expect(typeof registry.register).toBe("function");
    expect(typeof registry.snapshot).toBe("function");
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

  it("validateMetadataSurface rejects a surface with no sections", () => {
    const result = validateMetadataSurface({
      id: "surface.empty",
      title: "Empty",
      layout: baseLayout,
      state: resolveMetadataState("ready"),
      sections: [],
      actions: [],
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("at least one section");
  });

  it("validateMetadataSection rejects invalid, column-less, and field-less sections", () => {
    const invalidType = validateMetadataSection({
      id: "s1",
      title: "Bad",
      layout: baseLayout,
      // @ts-expect-error intentionally invalid type for runtime validation test
      type: "unknown-type",
    });

    const listNoColumns = validateMetadataSection({
      id: "s2",
      title: "List",
      layout: baseLayout,
      type: "list",
    });

    const formNoFields = validateMetadataSection({
      id: "s3",
      title: "Form",
      layout: baseLayout,
      type: "form",
    });

    const auditNoPanel = validateMetadataSection({
      id: "s4",
      title: "Audit",
      layout: baseLayout,
      type: "audit-panel",
    });

    expect(invalidType.valid).toBe(false);
    expect(invalidType.errors[0]).toContain("Unsupported section type");
    expect(listNoColumns.valid).toBe(false);
    expect(listNoColumns.errors[0]).toContain("at least one governed column");
    expect(formNoFields.valid).toBe(false);
    expect(formNoFields.errors[0]).toContain("at least one governed field");
    expect(auditNoPanel.valid).toBe(false);
    expect(auditNoPanel.errors[0]).toContain("audit panel contract");
  });

  it("identifies all five sensitive action categories", () => {
    const sensitiveCategories = METADATA_ACTION_CATEGORIES.filter(
      isSensitiveMetadataAction
    );

    expect(sensitiveCategories).toEqual([
      "destructive",
      "financial",
      "export",
      "ai",
      "approval",
    ]);
    expect(isSensitiveMetadataAction("standard")).toBe(false);
  });

  it("validateMetadataAction rejects sensitive actions without confirmation or policy", () => {
    const permission = createPermissionKey("records", "delete");

    const result = validateMetadataAction({
      id: "action.records.delete",
      label: "Delete",
      category: "destructive",
      commandId: "records.delete",
      executionMode: "command",
      permission: {
        denialEffect: "hide",
        permissionKey: permission,
        reason: "Requires delete permission.",
      },
      audit: {
        action: "records.deleted",
        evidence: ["actorId"],
        targetType: "records",
      },
    });

    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("confirmation or policy metadata");
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

  it("resolveMetadataVisibility passes with no requirement and handles disable effect", () => {
    const noRequirement = resolveMetadataVisibility(undefined, {
      grantedPermissions: [],
    });

    expect(noRequirement).toEqual({
      allowed: true,
      effect: null,
      reason: null,
    });

    const disabledPermission = createPermissionKey("records", "read");

    const disableResult = resolveMetadataVisibility(
      {
        denialEffect: "disable",
        permissionKey: createPermissionKey("records", "export"),
        reason: "Requires export permission.",
      },
      { grantedPermissions: [disabledPermission] }
    );

    expect(disableResult.allowed).toBe(false);
    expect(disableResult.effect).toBe("disable");
  });

  it("resolveMetadataActions retains disabled actions but excludes hidden ones", () => {
    const disablePermission = createPermissionKey("records", "export");

    const disabledAction = {
      id: "action.disable",
      label: "View only",
      category: "standard",
      commandId: "records.view",
      executionMode: "command",
      permission: {
        denialEffect: "disable",
        permissionKey: disablePermission,
        reason: "Read-only without export.",
      },
      audit: {
        action: "records.viewed",
        evidence: ["actorId"],
        targetType: "records",
      },
    } as const;

    const hiddenAction = {
      id: "action.hidden",
      label: "Delete",
      category: "destructive",
      commandId: "records.delete",
      executionMode: "command",
      permission: {
        denialEffect: "hide",
        permissionKey: createPermissionKey("records", "delete"),
        reason: "Requires delete permission.",
      },
      audit: {
        action: "records.deleted",
        evidence: ["actorId"],
        targetType: "records",
      },
      policy: { confirmationRequired: true },
    } as const;

    const resolved = resolveMetadataActions([disabledAction, hiddenAction], {
      grantedPermissions: [],
    });

    expect(resolved).toHaveLength(1);
    expect(resolved[0]?.id).toBe("action.disable");
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

  it("resolveMetadataState throws for an unrecognised state string", () => {
    expect(() =>
      // @ts-expect-error intentionally invalid state for runtime guard test
      resolveMetadataState("unknown-state")
    ).toThrow('Unsupported metadata surface state "unknown-state"');
  });
});
