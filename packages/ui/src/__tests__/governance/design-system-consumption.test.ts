import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  APP_SHELL_VARIANT_AXES,
  assertAllowedLayoutClassName,
  assertGovernedState,
  FORM_CONTROL_VARIANT_AXES,
  GOVERNED_RECIPE_VARIANT_AXES,
  GOVERNED_STATES,
  GOVERNED_UI_RECIPES,
  getComponentAccessibilityRequirement,
  getMotionIntent,
  getPrimitiveDefinition,
  METADATA_UI_VARIANT_AXES,
  resolveBadgeClassName,
  resolveButtonClassName,
  resolveCardClassName,
  resolveGovernedRecipe,
  resolveGovernedVariant,
  STATUS_TONES,
  STATUS_VARIANT_AXES,
  SURFACE_VARIANT_AXES,
  TABLE_VARIANT_AXES,
  VARIANT_INTENTS,
} from "../../governance";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const designSystemRoot = join(packageRoot, "..", "design-system");

describe("governance dependency direction", () => {
  it("depends on @afenda/design-system at package level", () => {
    const packageJson = JSON.parse(
      readFileSync(join(packageRoot, "package.json"), "utf8")
    ) as { dependencies?: Record<string, string> };

    expect(packageJson.dependencies?.["@afenda/design-system"]).toBe(
      "workspace:*"
    );
  });

  it("does not allow @afenda/design-system to depend on @afenda/ui", () => {
    const packageJson = JSON.parse(
      readFileSync(join(designSystemRoot, "package.json"), "utf8")
    ) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(packageJson.dependencies?.["@afenda/ui"]).toBeUndefined();
    expect(packageJson.devDependencies?.["@afenda/ui"]).toBeUndefined();
  });
});

describe("governed variant resolution", () => {
  it("accepts governed button selections", () => {
    expect(
      resolveGovernedVariant({
        intent: "primary",
        emphasis: "solid",
        size: "md",
      })
    ).toEqual({
      intent: "primary",
      emphasis: "solid",
      size: "md",
    });
  });

  it("rejects unsupported variant values in development", () => {
    expect(() =>
      resolveGovernedVariant(
        { intent: "primary", emphasis: "neon" as "solid" },
        ["intent", "emphasis"]
      )
    ).toThrow(/Foundation phase 04 variant policy violation/);
  });

  it("accepts governed badge tones only", () => {
    for (const tone of STATUS_TONES) {
      expect(resolveBadgeClassName({ tone })).toContain("group/badge");
    }
  });

  it("rejects unsupported badge tones in development", () => {
    expect(() =>
      resolveBadgeClassName({ tone: "celebratory" as "neutral" })
    ).toThrow(/Foundation phase 04 variant policy violation/);
  });
});

describe("governed recipe resolution", () => {
  it("resolves button, badge, and card recipes", () => {
    expect(
      resolveGovernedRecipe("button", { intent: "primary", emphasis: "solid" })
        .className
    ).toContain("bg-primary");
    expect(
      resolveGovernedRecipe("badge", { tone: "info", emphasis: "solid" })
        .className
    ).toContain("group/badge");
    expect(
      resolveGovernedRecipe("card", {
        density: "standard",
        radius: "md",
        shadow: "raised",
      }).className
    ).toContain("bg-card");
  });

  it("maps card surface, radius, and shadow recipes", () => {
    const raised = resolveCardClassName({ radius: "md", shadow: "raised" });
    const overlay = resolveCardClassName({ radius: "lg", shadow: "overlay" });

    expect(raised).toContain("rounded-xl");
    expect(raised).toContain("ring-1");
    expect(overlay).toContain("rounded-2xl");
    expect(overlay).toContain("shadow-lg");
  });
});

describe("className and state policy", () => {
  it("permits layout-only className overrides", () => {
    expect(() =>
      assertAllowedLayoutClassName("flex w-full max-w-sm")
    ).not.toThrow();
  });

  it("rejects semantic className overrides in development", () => {
    expect(() => assertAllowedLayoutClassName("bg-red-500 flex")).toThrow(
      /Governed UI className policy violation/
    );
  });

  it("asserts governed UI states", () => {
    for (const state of GOVERNED_STATES) {
      expect(() => assertGovernedState(state)).not.toThrow();
    }

    expect(() => assertGovernedState("downloading")).toThrow(
      /Governed UI state policy violation/
    );
  });
});

describe("accessibility and motion helpers", () => {
  it("returns accessibility requirements for governed components", () => {
    expect(getComponentAccessibilityRequirement("Button")).toContain(
      "semanticElement"
    );
    expect(getComponentAccessibilityRequirement("Badge")).toContain(
      "programmaticName"
    );
  });

  it("returns motion policy entries by intent", () => {
    expect(getMotionIntent("feedback").durationToken).toBe(
      "afenda.motion.duration.fast"
    );
  });
});

describe("governance bridge discipline", () => {
  it("keeps governed recipe axes aligned with design-system authority", async () => {
    const { recipeRegistry } = await import("@afenda/design-system");

    for (const recipeName of GOVERNED_UI_RECIPES) {
      const authorityRecipe = recipeRegistry.recipes.find(
        (entry) => entry.name === recipeName
      );
      expect(authorityRecipe?.variantAxes).toEqual(
        GOVERNED_RECIPE_VARIANT_AXES[recipeName]
      );
    }
  });

  it("maps governed components to recipe contracts via primitive registry", () => {
    expect(getPrimitiveDefinition("Alert").recipeName).toBe("status");
    expect(getPrimitiveDefinition("Field").recipeName).toBe("form-control");
    expect(getPrimitiveDefinition("Table").recipeName).toBe("table");
  });

  it("covers all recipe variant axis registries", () => {
    expect(SURFACE_VARIANT_AXES).toEqual(["density", "radius", "shadow"]);
    expect(STATUS_VARIANT_AXES).toEqual(["tone", "density", "radius"]);
    expect(FORM_CONTROL_VARIANT_AXES).toEqual(["density", "size"]);
    expect(TABLE_VARIANT_AXES).toEqual(["density", "size"]);
    expect(APP_SHELL_VARIANT_AXES).toEqual(["density", "tone"]);
    expect(METADATA_UI_VARIANT_AXES).toEqual(["density", "tone"]);
  });
});

describe("public export stability", () => {
  it("keeps governed vocabulary aligned with design-system intents", () => {
    expect(VARIANT_INTENTS).toEqual([
      "primary",
      "secondary",
      "quiet",
      "destructive",
    ]);
  });

  it("produces button classes without raw palette utilities", () => {
    const className = resolveButtonClassName({
      intent: "destructive",
      emphasis: "solid",
      size: "md",
    });

    expect(className).not.toMatch(/bg-(red|blue|green)-\d+/u);
    expect(className).toContain("destructive");
  });
});
