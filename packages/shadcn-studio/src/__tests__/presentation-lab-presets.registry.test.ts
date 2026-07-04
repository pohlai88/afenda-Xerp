import { describe, expect, it } from "vitest";

import brandManifest from "../styles/afenda-brand.figma-manifest.json" with {
  type: "json",
};
import verdantManifest from "../styles/afenda-verdant.figma-manifest.json" with {
  type: "json",
};
import {
  afendaBrandPreset,
  afendaVerdantPreset,
} from "../styles/presentation-lab-presets.js";
import {
  getPresentationLabPresetEntry,
  isEditorialLabPresetId,
  PRESENTATION_LAB_PRESET_IDS,
  PRESENTATION_LAB_PRESET_REGISTRY,
} from "../styles/presentation-lab-presets.registry.js";
import { themePresets } from "../theme/theme-presets.js";

const toKebabCase = (value: string): string =>
  value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

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

  it("keeps editorial Figma manifest token names aligned with preset tokens", () => {
    expect(brandManifest.tokenNames).toEqual(
      Object.keys(afendaBrandPreset.tokens.light)
    );
    expect(brandManifest.tokenNames).toContain("destructive-foreground");

    expect(verdantManifest.tokenNames).toEqual([
      ...Object.keys(afendaVerdantPreset.tokens.light),
      ...Object.keys(afendaVerdantPreset.editorialAnchors.light).map(
        (tokenName) => `afenda-${toKebabCase(tokenName)}`
      ),
    ]);
  });
});
