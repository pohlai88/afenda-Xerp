import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SIDEBAR_PRIMITIVE_ID,
  SIDEBAR_SLOTS,
  sidebarMenuButtonVariants,
  sidebarPrimitiveMetadata,
  sidebarProviderWrapperClassName,
} from "../../components-ui/sidebar.contract.js";
import type { SidebarSlot } from "../../components-ui/sidebar.js";

describe("sidebar primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SIDEBAR_PRIMITIVE_ID for metadata registries", () => {
    expect(SIDEBAR_PRIMITIVE_ID).toBe("shadcn-studio.ui.sidebar");
  });

  it("exports SIDEBAR_SLOTS", () => {
    expect(SIDEBAR_SLOTS.wrapper).toBe("sidebar-wrapper");
    expect(SIDEBAR_SLOTS.menuButton).toBe("sidebar-menu-button");
    expect(SIDEBAR_SLOTS.menuSubButton).toBe("sidebar-menu-sub-button");
  });

  it("exports governed class constants and cva", () => {
    expect(sidebarProviderWrapperClassName).toContain("group/sidebar-wrapper");
    expect(sidebarMenuButtonVariants({ size: "sm" })).toContain("h-7");
  });

  it("sidebarPrimitiveMetadata is JSON-serializable", () => {
    const payload = sidebarPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SidebarSlot is a governed slot literal union", () => {
    expectTypeOf<SidebarSlot>().toEqualTypeOf<
      | "sidebar-wrapper"
      | "sidebar"
      | "sidebar-gap"
      | "sidebar-container"
      | "sidebar-inner"
      | "sidebar-trigger"
      | "sidebar-rail"
      | "sidebar-inset"
      | "sidebar-input"
      | "sidebar-header"
      | "sidebar-footer"
      | "sidebar-separator"
      | "sidebar-content"
      | "sidebar-group"
      | "sidebar-group-label"
      | "sidebar-group-action"
      | "sidebar-group-content"
      | "sidebar-menu"
      | "sidebar-menu-item"
      | "sidebar-menu-button"
      | "sidebar-menu-action"
      | "sidebar-menu-badge"
      | "sidebar-menu-skeleton"
      | "sidebar-menu-sub"
      | "sidebar-menu-sub-item"
      | "sidebar-menu-sub-button"
    >();
  });
});
