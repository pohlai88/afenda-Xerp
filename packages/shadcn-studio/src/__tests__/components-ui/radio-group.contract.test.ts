import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  RADIO_GROUP_PRIMITIVE_ID,
  RADIO_GROUP_SLOTS,
  radioGroupItemClassName,
  radioGroupPrimitiveMetadata,
  radioGroupRootClassName,
} from "../../components-ui/radio-group.contract.js";
import type {
  RadioGroupItemProps,
  RadioGroupProps,
  RadioGroupSlot,
} from "../../components-ui/radio-group.js";

describe("radio-group primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports RADIO_GROUP_PRIMITIVE_ID for metadata registries", () => {
    expect(RADIO_GROUP_PRIMITIVE_ID).toBe("shadcn-studio.ui.radio-group");
  });

  it("exports RADIO_GROUP_SLOTS", () => {
    expect(RADIO_GROUP_SLOTS).toEqual({
      root: "radio-group",
      item: "radio-group-item",
      indicator: "radio-group-indicator",
    });
  });

  it("exports governed class constants", () => {
    expect(radioGroupRootClassName).toContain("grid");
    expect(radioGroupItemClassName).toContain("rounded-full");
  });

  it("radioGroupPrimitiveMetadata is JSON-serializable", () => {
    const payload = radioGroupPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("RadioGroupSlot is a governed slot literal union", () => {
    expectTypeOf<RadioGroupSlot>().toEqualTypeOf<
      "radio-group" | "radio-group-item" | "radio-group-indicator"
    >();
  });

  it("RadioGroupProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof RadioGroupProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("RadioGroupItemProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof RadioGroupItemProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
