import { describe, expect, it } from "vitest";

import {
  STATUS_TONES,
  VARIANT_EMPHASES,
  VARIANT_INTENTS,
} from "../../governance/design-system";
import {
  badgeToneEmphasis,
  buttonIntentEmphasis,
  fieldOrientationClasses,
  panelRadiusClasses,
  panelShadowClasses,
} from "../../governance/recipe-maps";

describe("recipe maps", () => {
  it("covers every button intent and emphasis", () => {
    for (const intent of VARIANT_INTENTS) {
      expect(buttonIntentEmphasis[intent]).toBeDefined();

      for (const emphasis of VARIANT_EMPHASES) {
        expect(buttonIntentEmphasis[intent][emphasis]).toEqual(
          expect.any(String)
        );
      }
    }
  });

  it("covers every badge tone and emphasis", () => {
    for (const tone of STATUS_TONES) {
      expect(badgeToneEmphasis[tone]).toBeDefined();

      for (const emphasis of VARIANT_EMPHASES) {
        expect(badgeToneEmphasis[tone][emphasis]).toEqual(expect.any(String));
      }
    }
  });

  it("covers field orientations", () => {
    expect(fieldOrientationClasses.vertical).toEqual(expect.any(String));
    expect(fieldOrientationClasses.horizontal).toEqual(expect.any(String));
    expect(fieldOrientationClasses.responsive).toEqual(expect.any(String));
  });

  it("covers governed panel radius and shadow maps", () => {
    expect(panelRadiusClasses.none).toEqual(expect.any(String));
    expect(panelRadiusClasses.md).toEqual(expect.any(String));
    expect(panelShadowClasses.none).toEqual(expect.any(String));
    expect(panelShadowClasses.raised).toEqual(expect.any(String));
  });
});
