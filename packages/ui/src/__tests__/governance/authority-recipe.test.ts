import { appShellRecipe, metadataUiRecipe } from "@afenda/design-system";
import { describe, expect, it } from "vitest";

import {
  APP_SHELL_RECIPE_SLOTS,
  METADATA_UI_RECIPE_SLOTS,
  resolveAppShellSlotClassName,
  resolveAuthorityRecipeSlotClassName,
  resolveGovernedRecipe,
  resolveMetadataUiSlotClassName,
} from "../../governance";

describe("authority surface recipes", () => {
  it("aligns slot names with design-system recipe authority", () => {
    expect(APP_SHELL_RECIPE_SLOTS).toEqual(
      appShellRecipe.slots.map((slot) => slot.name)
    );
    expect(METADATA_UI_RECIPE_SLOTS).toEqual(
      metadataUiRecipe.slots.map((slot) => slot.name)
    );
  });

  it("resolves app-shell and metadata-ui root recipes", () => {
    expect(
      resolveGovernedRecipe("app-shell", { density: "compact" }).className
    ).toContain("group/app-shell");
    expect(
      resolveGovernedRecipe("metadata-ui", { density: "standard" }).className
    ).toContain("group/metadata-ui");
  });

  it("resolves slot class names without raw palette utilities", () => {
    const sidebar = resolveAppShellSlotClassName("sidebar");
    expect(sidebar).toContain("group/app-shell-sidebar");
    expect(sidebar).not.toMatch(/bg-(?:red|blue|green)-\d+/u);

    const diagnostics = resolveMetadataUiSlotClassName("diagnostics");
    expect(diagnostics).toContain("group/metadata-ui-diagnostics");
    expect(diagnostics).toContain("var(--afenda-");
  });

  it("routes slot resolution through the authority helper", () => {
    expect(
      resolveAuthorityRecipeSlotClassName("app-shell", "topbar")
    ).toContain("group/app-shell-topbar");
    expect(
      resolveAuthorityRecipeSlotClassName("metadata-ui", "section")
    ).toContain("group/metadata-ui-section");
  });

  it("rejects unknown authority slots", () => {
    expect(() =>
      resolveAuthorityRecipeSlotClassName("app-shell", "unknown-slot")
    ).toThrow(/Unknown slot/);
  });
});
