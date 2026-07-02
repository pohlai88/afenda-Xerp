import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BUTTON_GROUP_PRIMITIVE_ID,
  BUTTON_GROUP_SLOTS,
  buttonGroupPrimitiveMetadata,
  buttonGroupTextClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/button-group.contract.js";
import type {
  ButtonGroupProps,
  ButtonGroupSlot,
} from "../../components-ui/button-group.js";

describe("button-group primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BUTTON_GROUP_PRIMITIVE_ID for metadata registries", () => {
    expect(BUTTON_GROUP_PRIMITIVE_ID).toBe("shadcn-studio.ui.button-group");
  });

  it("exports BUTTON_GROUP_SLOTS", () => {
    expect(BUTTON_GROUP_SLOTS).toEqual({
      root: "button-group",
      text: "button-group-text",
      separator: "button-group-separator",
    });
  });

  it("exports governed class constants", () => {
    expect(buttonGroupTextClassName).toContain("bg-muted");
  });

  it("buttonGroupPrimitiveMetadata is JSON-serializable", () => {
    const payload = buttonGroupPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ButtonGroupSlot is a governed slot literal union", () => {
    expectTypeOf<ButtonGroupSlot>().toEqualTypeOf<
      "button-group" | "button-group-text" | "button-group-separator"
    >();
  });

  it("ButtonGroupProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ButtonGroupProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
