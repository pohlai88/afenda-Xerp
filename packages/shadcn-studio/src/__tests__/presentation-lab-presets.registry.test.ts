import { describe, expect, it } from "vitest";

import {
  getPresentationLabPresetEntry,
  isEditorialLabPresetId,
  PRESENTATION_LAB_PRESET_IDS,
  PRESENTATION_LAB_PRESET_REGISTRY,
} from "../styles/presentation-lab-presets.registry.js";
import { themePresets } from "../theme/theme-presets.js";

describe("presentation lab presets registry", () => {
  it("registry is JSON-serializable for metadata-driven inventory", () => {
    expect(() =>
      JSON.stringify(PRESENTATION_LAB_PRESET_REGISTRY)
    ).not.toThrow();
    const parsed = JSON.parse(
      JSON.stringify(PRESENTATION_LAB_PRESET_REGISTRY)
    ) as typeof PRESENTATION_LAB_PRESET_REGISTRY;
    expect(parsed).toHaveLength(2);
  });

  it("covers Swiss and Verdant editorial lab presets", () => {
    expect(PRESENTATION_LAB_PRESET_IDS).toEqual([
      "afenda-brand",
      "afenda-verdant",
    ]);

    const swiss = getPresentationLabPresetEntry("afenda-brand");
    expect(swiss.cssMirrorPath).toContain("swiss-noir.css");
    expect(swiss.editorialVocab).toBe("lab-*");
    expect(swiss.runtimeScope).toBe("scoped-overlay");

    const verdant = getPresentationLabPresetEntry("afenda-verdant");
    expect(verdant.cssMirrorPath).toContain("verdant-noir.css");
    expect(verdant.editorialVocab).toBe("afenda-*");
    expect(verdant.runtimeScope).toBe("scoped-overlay");
  });

  it("guards preset id lookup", () => {
    expect(isEditorialLabPresetId("afenda-brand")).toBe(true);
    expect(isEditorialLabPresetId("default")).toBe(false);
    expect(() =>
      getPresentationLabPresetEntry("default" as "afenda-brand")
    ).toThrow(/Unknown editorial lab preset/);
  });

  it("keeps editorial presets out of the runtime SettingsProvider registry", () => {
    expect(themePresets).not.toHaveProperty("afenda-brand");
    expect(themePresets).not.toHaveProperty("afenda-verdant");
  });
});
