import { describe, expect, it } from "vitest";

import {
  BLOCK_LIFECYCLE_ORDER,
  type BlockLifecycleState,
  isValidBlockLifecycleTransition,
} from "../registry/block-lifecycle.js";
import { buildPresentationInventoryFromParity } from "../registry/build-presentation-inventory-from-parity.js";
import {
  PRESENTATION_INVENTORY_REGISTRY,
  type PresentationInventoryEntry,
} from "../registry/presentation-inventory.registry.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "../registry/studio-block-parity.registry.js";
import { NAMED_THEME_PRESET_SLUGS } from "../theme/theme-preset.contract.js";

function isPresentationBlockEntry(
  entry: PresentationInventoryEntry
): entry is Extract<
  PresentationInventoryEntry,
  { layerKind: "presentation-block" }
> {
  return entry.layerKind === "presentation-block";
}

describe("presentation inventory registry (PAS-006B P06-002)", () => {
  it("registry entries are JSON-serializable", () => {
    expect(() => JSON.stringify(PRESENTATION_INVENTORY_REGISTRY)).not.toThrow();
    expect(() =>
      JSON.stringify(buildPresentationInventoryFromParity())
    ).not.toThrow();
  });

  it("includes every parity block as an imported presentation-block entry", () => {
    const blockEntries = PRESENTATION_INVENTORY_REGISTRY.filter(
      isPresentationBlockEntry
    );

    expect(blockEntries).toHaveLength(
      SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.length
    );

    for (const parity of SHADCN_STUDIO_BLOCK_PARITY_REGISTRY) {
      const inventoryEntry = blockEntries.find(
        (entry) => entry.mcpBlockId === parity.mcpBlockId
      );

      expect(inventoryEntry).toBeDefined();
      expect(inventoryEntry?.lifecycleState).toBe("imported");
      expect(inventoryEntry?.sourcePath).toBe(parity.mcpPath);
      expect(inventoryEntry?.parityStatus).toBe(parity.status);
    }
  });

  it("includes theme preset layer entries from theme-presets", () => {
    const themeEntries = PRESENTATION_INVENTORY_REGISTRY.filter(
      (entry) => entry.layerKind === "theme-preset"
    );

    expect(themeEntries).toHaveLength(NAMED_THEME_PRESET_SLUGS.length);

    for (const slug of NAMED_THEME_PRESET_SLUGS) {
      expect(themeEntries.some((entry) => entry.themePresetSlug === slug)).toBe(
        true
      );
    }
  });

  it("validates block lifecycle transitions along NS §8.1 order", () => {
    expect(BLOCK_LIFECYCLE_ORDER[0]).toBe("imported");
    expect(BLOCK_LIFECYCLE_ORDER.at(-1)).toBe("retired");

    for (let index = 0; index < BLOCK_LIFECYCLE_ORDER.length - 1; index += 1) {
      const from = BLOCK_LIFECYCLE_ORDER[index] as BlockLifecycleState;
      const to = BLOCK_LIFECYCLE_ORDER[index + 1] as BlockLifecycleState;

      expect(isValidBlockLifecycleTransition(from, to)).toBe(true);
    }

    expect(isValidBlockLifecycleTransition("imported", "stabilized")).toBe(
      false
    );
    expect(isValidBlockLifecycleTransition("accepted", "imported")).toBe(false);
    expect(isValidBlockLifecycleTransition("retired", "deprecated")).toBe(
      false
    );
    expect(isValidBlockLifecycleTransition("imported", "imported")).toBe(true);
  });
});
