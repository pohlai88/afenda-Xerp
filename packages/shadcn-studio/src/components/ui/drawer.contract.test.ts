import { describe, expect, expectTypeOf, it } from "vitest";
import {
  DRAWER_PRIMITIVE_ID,
  DRAWER_SLOTS,
  drawerContentClassName,
  drawerPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "./drawer.contract.js";
import type { DrawerContentProps, DrawerSlot } from "./drawer.js";

describe("drawer primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports DRAWER_PRIMITIVE_ID for metadata registries", () => {
    expect(DRAWER_PRIMITIVE_ID).toBe("shadcn-studio.ui.drawer");
  });

  it("exports DRAWER_SLOTS", () => {
    expect(DRAWER_SLOTS).toEqual({
      root: "drawer",
      trigger: "drawer-trigger",
      portal: "drawer-portal",
      close: "drawer-close",
      overlay: "drawer-overlay",
      content: "drawer-content",
      header: "drawer-header",
      footer: "drawer-footer",
      title: "drawer-title",
      description: "drawer-description",
      handle: "drawer-handle",
    });
  });

  it("exports governed class constants", () => {
    expect(drawerContentClassName).toContain("group/drawer-content");
  });

  it("drawerPrimitiveMetadata is JSON-serializable", () => {
    const payload = drawerPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("DrawerSlot is a governed slot literal union", () => {
    expectTypeOf<DrawerSlot>().toEqualTypeOf<
      | "drawer"
      | "drawer-trigger"
      | "drawer-portal"
      | "drawer-close"
      | "drawer-overlay"
      | "drawer-content"
      | "drawer-header"
      | "drawer-footer"
      | "drawer-title"
      | "drawer-description"
      | "drawer-handle"
    >();
  });

  it("DrawerContentProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof DrawerContentProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
