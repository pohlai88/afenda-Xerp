import { describe, expect, expectTypeOf, it } from "vitest";
import {
  MENUBAR_PRIMITIVE_ID,
  MENUBAR_SLOTS,
  menubarPrimitiveMetadata,
  menubarRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/menubar.contract.js";
import type {
  MenubarSlot,
  MenubarTriggerProps,
} from "../../components-ui/menubar.js";

describe("menubar primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports MENUBAR_PRIMITIVE_ID for metadata registries", () => {
    expect(MENUBAR_PRIMITIVE_ID).toBe("shadcn-studio.ui.menubar");
  });

  it("exports MENUBAR_SLOTS with indicator slots", () => {
    expect(MENUBAR_SLOTS.checkboxItemIndicator).toBe(
      "menubar-checkbox-item-indicator"
    );
  });

  it("exports governed class constants", () => {
    expect(menubarRootClassName).toContain("shadow-xs");
  });

  it("menubarPrimitiveMetadata is JSON-serializable", () => {
    const payload = menubarPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("MenubarSlot is a governed slot literal union", () => {
    expectTypeOf<MenubarSlot>().toEqualTypeOf<
      (typeof MENUBAR_SLOTS)[keyof typeof MENUBAR_SLOTS]
    >();
  });

  it("MenubarTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof MenubarTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
