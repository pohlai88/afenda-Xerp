import { describe, expect, expectTypeOf, it } from "vitest";
import {
  DROPDOWN_MENU_PRIMITIVE_ID,
  DROPDOWN_MENU_SLOTS,
  dropdownMenuContentClassName,
  dropdownMenuPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/dropdown-menu.contract.js";
import type {
  DropdownMenuContentProps,
  DropdownMenuSlot,
  DropdownMenuTriggerProps,
} from "../../components-ui/dropdown-menu.js";

describe("dropdown-menu primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports DROPDOWN_MENU_PRIMITIVE_ID for metadata registries", () => {
    expect(DROPDOWN_MENU_PRIMITIVE_ID).toBe("shadcn-studio.ui.dropdown-menu");
  });

  it("exports DROPDOWN_MENU_SLOTS with positioner", () => {
    expect(DROPDOWN_MENU_SLOTS.positioner).toBe("dropdown-menu-positioner");
    expect(DROPDOWN_MENU_SLOTS.content).toBe("dropdown-menu-content");
  });

  it("exports governed class constants", () => {
    expect(dropdownMenuContentClassName).toContain("bg-popover");
  });

  it("dropdownMenuPrimitiveMetadata is JSON-serializable", () => {
    const payload = dropdownMenuPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("DropdownMenuSlot is a governed slot literal union", () => {
    expectTypeOf<DropdownMenuSlot>().toEqualTypeOf<
      (typeof DROPDOWN_MENU_SLOTS)[keyof typeof DROPDOWN_MENU_SLOTS]
    >();
  });

  it("DropdownMenuTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof DropdownMenuTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("DropdownMenuContentProps.side defaults in adapter", () => {
    expectTypeOf<DropdownMenuContentProps["side"]>().toEqualTypeOf<
      | "top"
      | "bottom"
      | "left"
      | "right"
      | "inline-start"
      | "inline-end"
      | undefined
    >();
  });
});
