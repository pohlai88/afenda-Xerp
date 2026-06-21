import { describe, expect, it } from "vitest";
import {
  densityAttributeSelector,
  densityFromAttribute,
  densityToAttribute,
  isDensity,
  isDensityAttribute,
} from "../contracts/density.contract";
import { DENSITIES, DENSITY_ATTRIBUTES } from "../contracts/token.contract";
import { AFENDA_TOKEN_REGISTRY } from "../registries/token.registry";

describe("density mode completeness", () => {
  const tokenNames = new Set(
    AFENDA_TOKEN_REGISTRY.tokens.map((t) => t.name)
  );

  it("defines compact, standard, and comfortable density modes", () => {
    expect(DENSITIES).toEqual(["compact", "standard", "comfortable"]);
  });

  it("exposes data-attribute values including default alias", () => {
    expect(DENSITY_ATTRIBUTES).toEqual(["compact", "default", "comfortable"]);
  });

  it("governs control height, gap, padding, section gap, table row, toolbar, and field gap per mode", () => {
    for (const mode of DENSITIES) {
      expect(tokenNames.has(`afenda.density.${mode}.control-height`)).toBe(
        true
      );
      expect(tokenNames.has(`afenda.density.${mode}.section-gap`)).toBe(true);
      expect(tokenNames.has(`afenda.density.${mode}.table-row-height`)).toBe(
        true
      );
      expect(tokenNames.has(`afenda.density.${mode}.toolbar-gap`)).toBe(true);
      expect(tokenNames.has(`afenda.density.${mode}.field-gap`)).toBe(true);
    }
    expect(tokenNames.has("afenda.density.default.control-height")).toBe(true);
  });

  it("maps default density aliases to standard tokens", () => {
    const defaultHeight = AFENDA_TOKEN_REGISTRY.tokens.find(
      (t) => t.name === "afenda.density.default.control-height"
    );
    expect(defaultHeight?.value).toBe(
      "var(--afenda-density-standard-control-height)"
    );
  });

  it("bridges TS density standard to DOM attribute default", () => {
    expect(densityToAttribute("standard")).toBe("default");
    expect(densityFromAttribute("default")).toBe("standard");
    expect(densityAttributeSelector("compact")).toBe(
      '[data-afenda-density="compact"]'
    );
  });

  it("narrows density vocabulary with type guards", () => {
    expect(isDensity("standard")).toBe(true);
    expect(isDensity("default")).toBe(false);
    expect(isDensityAttribute("default")).toBe(true);
    expect(isDensityAttribute("standard")).toBe(false);
  });

  it("round-trips all governed density modes", () => {
    for (const density of DENSITIES) {
      const attribute = densityToAttribute(density);
      expect(DENSITY_ATTRIBUTES).toContain(attribute);
      expect(densityFromAttribute(attribute)).toBe(density);
    }
  });
});
