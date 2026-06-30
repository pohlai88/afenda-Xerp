import { describe, expect, expectTypeOf, it } from "vitest";
import {
  NAVIGATION_MENU_PRIMITIVE_ID,
  NAVIGATION_MENU_SLOTS,
  navigationMenuPrimitiveMetadata,
  navigationMenuTriggerStyle,
  PRIMITIVE_CONTRACT_VERSION,
} from "./navigation-menu.contract.js";
import type {
  NavigationMenuSlot,
  NavigationMenuTriggerProps,
} from "./navigation-menu.js";

describe("navigation-menu primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports NAVIGATION_MENU_PRIMITIVE_ID for metadata registries", () => {
    expect(NAVIGATION_MENU_PRIMITIVE_ID).toBe(
      "shadcn-studio.ui.navigation-menu"
    );
  });

  it("exports NAVIGATION_MENU_SLOTS with viewport chain", () => {
    expect(NAVIGATION_MENU_SLOTS.portal).toBe("navigation-menu-portal");
    expect(NAVIGATION_MENU_SLOTS.viewport).toBe("navigation-menu-viewport");
  });

  it("exports navigationMenuTriggerStyle cva", () => {
    expect(navigationMenuTriggerStyle()).toContain("inline-flex");
  });

  it("navigationMenuPrimitiveMetadata is JSON-serializable", () => {
    const payload = navigationMenuPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("NavigationMenuSlot is a governed slot literal union", () => {
    expectTypeOf<NavigationMenuSlot>().toEqualTypeOf<
      (typeof NAVIGATION_MENU_SLOTS)[keyof typeof NAVIGATION_MENU_SLOTS]
    >();
  });

  it("NavigationMenuTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof NavigationMenuTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
