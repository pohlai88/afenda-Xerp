import {
  LAYOUT_TYPES,
  METADATA_DENSITY_MODES,
  METADATA_RUNTIME_STATES,
  PRESENTATION_MODES,
  RENDERER_CAPABILITIES,
  SECTION_TYPES,
  SURFACE_TYPES,
} from "@afenda/metadata";
import { describe, expect, it } from "vitest";

import { defaultMetadataRenderers } from "../index.js";

describe("governed type consumption", () => {
  it("uses metadata surface, layout, section, runtime, and capability vocabulary", () => {
    expect(SURFACE_TYPES.length).toBeGreaterThan(0);
    expect(LAYOUT_TYPES.length).toBeGreaterThan(0);
    expect(SECTION_TYPES.length).toBeGreaterThan(0);
    expect(METADATA_RUNTIME_STATES.length).toBeGreaterThan(0);
    expect(PRESENTATION_MODES.length).toBeGreaterThan(0);
    expect(METADATA_DENSITY_MODES.length).toBeGreaterThan(0);
    expect(RENDERER_CAPABILITIES.length).toBeGreaterThan(0);

    for (const renderer of defaultMetadataRenderers) {
      for (const sectionType of renderer.governance.sectionTypes) {
        expect(SECTION_TYPES).toContain(sectionType);
      }
      expect(RENDERER_CAPABILITIES).toContain(renderer.governance.capability);
    }
  });
});
