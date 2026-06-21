import { describe, expect, it } from "vitest";

import {
  GOVERNED_UI_RECIPES,
  resolveFormControlClassName,
  resolveGovernedRecipe,
  resolveStatusClassName,
  resolveSurfaceClassName,
  resolveTableClassName,
} from "../../governance";

describe("recipe governance", () => {
  it("covers all design-system governed recipes", () => {
    expect(GOVERNED_UI_RECIPES).toEqual([
      "button",
      "badge",
      "card",
      "surface",
      "status",
      "form-control",
      "table",
      "app-shell",
      "metadata-ui",
    ]);
  });

  it("resolves governed button recipe", () => {
    expect(
      resolveGovernedRecipe("button", {
        intent: "primary",
        emphasis: "solid",
        size: "md",
      }).recipeName
    ).toBe("button");
  });

  it("rejects Badge-only tone on Button", () => {
    expect(() =>
      resolveGovernedRecipe("button", {
        intent: "primary",
        tone: "danger",
      })
    ).toThrow(/TIP-004 variant policy violation/);
  });

  it("resolves governed badge tones", () => {
    expect(
      resolveGovernedRecipe("badge", {
        tone: "success",
        emphasis: "soft",
      }).selection.tone
    ).toBe("success");
  });

  it("resolves governed card radius and shadow", () => {
    expect(
      resolveGovernedRecipe("card", {
        radius: "md",
        shadow: "raised",
      }).selection
    ).toMatchObject({
      radius: "md",
      shadow: "raised",
    });
  });

  it("resolves surface, status, form-control, and table recipes", () => {
    expect(resolveSurfaceClassName({ radius: "lg", shadow: "none" })).toContain(
      "group/surface"
    );
    expect(resolveStatusClassName({ tone: "info", radius: "md" })).toContain(
      "group/status"
    );
    expect(
      resolveFormControlClassName({ density: "compact", size: "sm" })
    ).toContain("group/form-control");
    expect(
      resolveTableClassName({ density: "comfortable", size: "md" })
    ).toContain("group/table");
  });

  it("rejects Button-only intent on Badge", () => {
    expect(() =>
      resolveGovernedRecipe("badge", {
        tone: "neutral",
        intent: "primary",
      })
    ).toThrow(/TIP-004 variant policy violation/);
  });

  it("produces button className without raw palette utilities", () => {
    const { className } = resolveGovernedRecipe("button", {
      intent: "destructive",
      emphasis: "solid",
    });
    expect(className).not.toMatch(/bg-(?:red|blue|green)-\d+/u);
    expect(className).toContain("destructive");
  });

  it("produces badge className with semantic token utilities", () => {
    const { className } = resolveGovernedRecipe("badge", {
      tone: "info",
      emphasis: "solid",
    });
    expect(className).toContain("group/badge");
    expect(className).not.toMatch(/bg-(?:blue|cyan)-\d+/u);
  });
});
