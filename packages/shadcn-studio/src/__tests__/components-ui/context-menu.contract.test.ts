import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CONTEXT_MENU_PRIMITIVE_ID,
  CONTEXT_MENU_SLOTS,
  contextMenuContentClassName,
  contextMenuPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/context-menu.contract.js";
import type {
  ContextMenuContentProps,
  ContextMenuSlot,
  ContextMenuTriggerProps,
} from "../../components-ui/context-menu.js";

describe("context-menu primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CONTEXT_MENU_PRIMITIVE_ID for metadata registries", () => {
    expect(CONTEXT_MENU_PRIMITIVE_ID).toBe("shadcn-studio.ui.context-menu");
  });

  it("exports CONTEXT_MENU_SLOTS with positioner and indicators", () => {
    expect(CONTEXT_MENU_SLOTS.positioner).toBe("context-menu-positioner");
    expect(CONTEXT_MENU_SLOTS.checkboxItemIndicator).toBe(
      "context-menu-checkbox-item-indicator"
    );
  });

  it("exports governed class constants", () => {
    expect(contextMenuContentClassName).toContain("bg-popover");
  });

  it("contextMenuPrimitiveMetadata is JSON-serializable", () => {
    const payload = contextMenuPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ContextMenuSlot is a governed slot literal union", () => {
    expectTypeOf<ContextMenuSlot>().toEqualTypeOf<
      (typeof CONTEXT_MENU_SLOTS)[keyof typeof CONTEXT_MENU_SLOTS]
    >();
  });

  it("ContextMenuTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ContextMenuTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("ContextMenuContentProps.side defaults in adapter", () => {
    expectTypeOf<ContextMenuContentProps["side"]>().toEqualTypeOf<
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
