import { getMetadataBindingByBlockId } from "@afenda/shadcn-studio";
import { describe, expect, it } from "vitest";
import { hydrateMetadataBindingSlots } from "../hydrate-metadata-binding-slots.server";
import { createMetadataRuntimeContext } from "../metadata-runtime.contract";
import { projectMetadataUiBindingWire } from "../metadata-ui-binding.projection";

describe("hydrateMetadataBindingSlots (PAS-001A R1c-2)", () => {
  it("maps binding fields to data-afenda-slot hydration targets", () => {
    const binding = getMetadataBindingByBlockId("hero-section-01");
    if (binding === undefined) {
      throw new Error("hero-section-01 binding must exist in registry");
    }

    const runtime = createMetadataRuntimeContext({
      tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      actorId: "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV",
      correlationId: "corr-hydration",
    });
    const projection = projectMetadataUiBindingWire({ binding, runtime });
    const hydration = hydrateMetadataBindingSlots({
      binding,
      projection,
      runtime,
    });

    expect(hydration.metadataBindingId).toBe(binding.metadataBindingId);
    expect(hydration.blockId).toBe("hero-section-01");
    expect(hydration.slotTargets.length).toBeGreaterThan(0);

    for (const target of hydration.slotTargets) {
      expect(target.domAttribute).toBe("data-afenda-slot");
      expect(target.slotId.length).toBeGreaterThan(0);
      expect(target.value.length).toBeGreaterThan(0);
    }

    expect(() => JSON.stringify(hydration)).not.toThrow();
  });
});
