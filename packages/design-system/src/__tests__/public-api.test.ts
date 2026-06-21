import { describe, expect, it } from "vitest";
import {
  AFENDA_SEMANTIC_ROLE_REGISTRY,
  appShellRecipe,
  designTokenPolicy,
  DENSITY_ATTRIBUTES,
  metadataUiRecipe,
  publicExportContract,
  visualDriftPolicy,
} from "../index";

describe("public API exports", () => {
  it("exports semantic role registry with stable roles", () => {
    expect(AFENDA_SEMANTIC_ROLE_REGISTRY.roles.length).toBeGreaterThan(40);
    expect(
      AFENDA_SEMANTIC_ROLE_REGISTRY.roles.every((r) => r.lifecycle === "stable")
    ).toBe(true);
  });

  it("exports app-shell and metadata-ui recipes from root", () => {
    expect(appShellRecipe.name).toBe("app-shell");
    expect(metadataUiRecipe.name).toBe("metadata-ui");
  });

  it("exports design token and visual drift policies", () => {
    expect(designTokenPolicy.prefix).toBe("afenda.");
    expect(visualDriftPolicy.prohibitedVisualSlop.length).toBeGreaterThan(0);
  });

  it("exports density attribute constants", () => {
    expect(DENSITY_ATTRIBUTES).toContain("default");
  });

  it("lists core policies in stable export contract", () => {
    expect(publicExportContract.stableExports).toEqual(
      expect.arrayContaining([
        "designTokenPolicy",
        "visualDriftPolicy",
        "AFENDA_SEMANTIC_ROLE_REGISTRY",
        "DENSITY_ATTRIBUTES",
        "appShellRecipe",
        "metadataUiRecipe",
      ])
    );
  });
});
