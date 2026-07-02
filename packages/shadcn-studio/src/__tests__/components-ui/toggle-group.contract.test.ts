import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  TOGGLE_GROUP_PRIMITIVE_ID,
  TOGGLE_GROUP_SLOTS,
  toggleGroupPrimitiveMetadata,
  toggleGroupRootClassName,
} from "../../components-ui/toggle-group.contract.js";
import type {
  ToggleGroupItemProps,
  ToggleGroupProps,
  ToggleGroupSlot,
} from "../../components-ui/toggle-group.js";

describe("toggle-group primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports TOGGLE_GROUP_PRIMITIVE_ID for metadata registries", () => {
    expect(TOGGLE_GROUP_PRIMITIVE_ID).toBe("shadcn-studio.ui.toggle-group");
  });

  it("exports TOGGLE_GROUP_SLOTS", () => {
    expect(TOGGLE_GROUP_SLOTS).toEqual({
      root: "toggle-group",
      item: "toggle-group-item",
    });
  });

  it("exports governed class constants", () => {
    expect(toggleGroupRootClassName).toContain("group/toggle-group");
  });

  it("toggleGroupPrimitiveMetadata is JSON-serializable", () => {
    const payload = toggleGroupPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ToggleGroupSlot is a governed slot literal union", () => {
    expectTypeOf<ToggleGroupSlot>().toEqualTypeOf<
      "toggle-group" | "toggle-group-item"
    >();
  });

  it("ToggleGroupProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ToggleGroupProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("ToggleGroupItemProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ToggleGroupItemProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
