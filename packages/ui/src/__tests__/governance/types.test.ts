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
    expect(isGovernedUiComponentName("Dialog")).toBe(false);
  });

  it("keeps governed components explicit", () => {
    expect(GOVERNED_UI_COMPONENTS).toEqual([
      "Button",
      "Badge",
      "Card",
      "Alert",
      "Field",
      "Table",
      "Input",
      "Label",
      "Textarea",
      "Checkbox",
      "Switch",
    ]);
  });

  it("keeps P0 governed recipes explicit", () => {
    expect(GOVERNED_UI_RECIPES).toContain("button");
    expect(GOVERNED_UI_RECIPES).toContain("form-control");
  });
});
