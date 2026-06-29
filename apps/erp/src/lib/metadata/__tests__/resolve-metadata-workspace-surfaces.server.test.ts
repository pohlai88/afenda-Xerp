import { describe, expect, it } from "vitest";

import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import { resolveMetadataWorkspaceSurfaces } from "../resolve-metadata-workspace-surfaces.server";

describe("resolveMetadataWorkspaceSurfaces (PAS-006D ERP bridge)", () => {
  it("projects all surface templates with binding wire summaries", () => {
    const surfaces = resolveMetadataWorkspaceSurfaces({
      runtime: createMetadataRuntimeContext({
        tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
        actorId: "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV",
        correlationId: "corr-preview",
      }),
    });

    expect(surfaces.length).toBeGreaterThanOrEqual(5);

    for (const surface of surfaces) {
      expect(surface.bindingProjection).toBeDefined();
      expect(
        surface.bindingProjection?.matchedBlockDataFieldCount
      ).toBeGreaterThan(0);
      expect(() => JSON.stringify(surface)).not.toThrow();
    }
  });
});
