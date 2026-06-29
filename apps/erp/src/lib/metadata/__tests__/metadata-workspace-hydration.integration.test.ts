import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { METADATA_PAS006_CONSUMER_WIRING } from "@/lib/context/context-integration-registry";
import { OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY } from "@/lib/context/operating-context-protected-surface.registry";
import { hydrateMetadataBindingSlots } from "@/lib/metadata/hydrate-metadata-binding-slots.server";
import { METADATA_OPERATOR_SURFACE_REGISTRY } from "@/lib/metadata/metadata-operator-surface.registry";
import { createMetadataRuntimeContext } from "@/lib/metadata/metadata-runtime.contract";
import { resolveMetadataOperatorSurface } from "@/lib/metadata/resolve-metadata-operator-surface.server";
import { resolveMetadataUiRenderContextFromTenantContext } from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { resolveMetadataWorkspaceSurfaces } from "@/lib/metadata/resolve-metadata-workspace-surfaces.server";

const erpSrcRoot = join(process.cwd(), "src");

describe("metadata workspace hydration integration (PAS-001A R1c)", () => {
  it("declares metadata-workspace in protected surface registry with spine delegate", () => {
    const surface = OPERATING_CONTEXT_PROTECTED_SURFACE_REGISTRY.find(
      (entry) => entry.id === "protected-rsc-metadata-workspace"
    );

    expect(surface).toBeDefined();
    expect(surface?.delegate).toBe("loadProtectedRequestOperatingContext");
    expect(surface?.module).toBe("app/(protected)/metadata-workspace/page.tsx");
  });

  it("wires IS-003 metadata consumer delegates in integration registry", () => {
    const delegateIds = new Set(
      METADATA_PAS006_CONSUMER_WIRING.map((entry) => entry.id)
    );

    expect(delegateIds.has("metadata-ui-render-context")).toBe(true);
    expect(delegateIds.has("metadata-workspace-surfaces")).toBe(true);
    expect(delegateIds.has("metadata-binding-slot-hydration")).toBe(true);
    expect(delegateIds.has("metadata-workspace-page")).toBe(true);
    expect(delegateIds.has("metadata-operator-surface-resolver")).toBe(true);
    expect(delegateIds.has("metadata-operator-settings-profile")).toBe(true);
    expect(delegateIds.has("metadata-operator-auth-sign-in")).toBe(true);
  });

  it("requires metadata consumer modules to exist on disk", () => {
    for (const entry of METADATA_PAS006_CONSUMER_WIRING) {
      expect(existsSync(join(erpSrcRoot, entry.module)), entry.module).toBe(
        true
      );
      const source = readFileSync(join(erpSrcRoot, entry.module), "utf8");
      expect(source.includes(entry.delegate), entry.delegate).toBe(true);
    }
  });

  it("metadata-workspace page uses spine and studio registry resolution chain", () => {
    const pagePath = join(
      erpSrcRoot,
      "app/(protected)/metadata-workspace/page.tsx"
    );
    const source = readFileSync(pagePath, "utf8");

    expect(source.includes("loadProtectedRequestOperatingContext")).toBe(true);
    expect(
      source.includes("resolveMetadataUiRenderContextFromTenantContext")
    ).toBe(true);
    expect(source.includes("resolveMetadataWorkspaceSurfaces")).toBe(true);
    expect(source.includes("slotHydration")).toBe(true);
    expect(source.includes("MetadataBindingSlotHydrationPreview")).toBe(true);
    expect(source.includes("@afenda/metadata-ui")).toBe(false);
  });

  it("resolves surfaces with binding projection and slot hydration wire", () => {
    const runtime = createMetadataRuntimeContext({
      tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      actorId: "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      correlationId: "corr-integration",
    });

    const surfaces = resolveMetadataWorkspaceSurfaces({ runtime });

    expect(surfaces.length).toBeGreaterThan(0);

    for (const surface of surfaces) {
      expect(surface.bindingProjection).toBeDefined();
      expect(surface.slotHydration).toBeDefined();
      expect(surface.slotHydration?.projection).toEqual(
        surface.bindingProjection
      );
      expect(surface.slotHydration?.slotTargets.length).toBeGreaterThan(0);
    }
  });

  it("operator route modules use metadata operator surface loader", () => {
    for (const route of METADATA_OPERATOR_SURFACE_REGISTRY) {
      const pagePath = join(erpSrcRoot, route.module);
      const source = readFileSync(pagePath, "utf8");

      expect(source.includes("loadMetadataOperatorSurfacePage")).toBe(true);
      expect(source.includes("MetadataOperatorSurfacePage")).toBe(true);
      expect(source.includes(route.surfaceTemplateId)).toBe(true);
    }
  });

  it("operator surfaces resolve with help-text slot targets", () => {
    const runtime = createMetadataRuntimeContext({
      correlationId: "corr-operator-integration",
    });

    for (const route of METADATA_OPERATOR_SURFACE_REGISTRY) {
      const surface = resolveMetadataOperatorSurface({
        surfaceTemplateId: route.surfaceTemplateId,
        runtime,
      });

      expect(surface?.slotHydration?.slotTargets.length).toBeGreaterThan(0);
    }
  });

  it("exports hydration and render-context delegates for gate wiring", () => {
    expect(typeof hydrateMetadataBindingSlots).toBe("function");
    expect(typeof resolveMetadataUiRenderContextFromTenantContext).toBe(
      "function"
    );
    expect(typeof resolveMetadataWorkspaceSurfaces).toBe("function");
  });
});
