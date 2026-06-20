import { describe, expect, it } from "vitest";

import {
  GOVERNED_UI_COMPONENTS,
  GOVERNED_UI_RECIPES,
  isGovernedRecipeName,
  isGovernedUiComponentName,
} from "../../governance/types";

describe("governance shared types", () => {
  it("recognizes governed recipe names", () => {
    expect(isGovernedRecipeName("button")).toBe(true);
    expect(isGovernedRecipeName("dialog")).toBe(false);
  });

  it("recognizes governed UI component names", () => {
    expect(isGovernedUiComponentName("Button")).toBe(true);
    expect(isGovernedUiComponentName("Dialog")).toBe(true);
    expect(isGovernedUiComponentName("Combobox")).toBe(true);
    expect(isGovernedUiComponentName("Sidebar")).toBe(true);
  });

  it("keeps governed components explicit", () => {
    expect(GOVERNED_UI_COMPONENTS.length).toBeGreaterThan(0);
    expect(GOVERNED_UI_COMPONENTS).toContain("Button");
    expect(GOVERNED_UI_COMPONENTS).toContain("InputGroup");
    expect(GOVERNED_UI_COMPONENTS).toContain("Sidebar");
    expect(new Set(GOVERNED_UI_COMPONENTS).size).toBe(GOVERNED_UI_COMPONENTS.length);
  });

  it("keeps P0 governed recipes explicit", () => {
    expect(GOVERNED_UI_RECIPES).toContain("button");
    expect(GOVERNED_UI_RECIPES).toContain("form-control");
  });
});
