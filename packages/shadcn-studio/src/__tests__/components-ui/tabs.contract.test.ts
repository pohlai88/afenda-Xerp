import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  TABS_PRIMITIVE_ID,
  TABS_SLOTS,
  tabsContentClassName,
  tabsPrimitiveMetadata,
  tabsRootClassName,
  tabsTriggerClassName,
} from "../../components-ui/tabs.contract.js";
import type { TabsProps, TabsSlot } from "../../components-ui/tabs.js";

describe("tabs primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports TABS_PRIMITIVE_ID for metadata registries", () => {
    expect(TABS_PRIMITIVE_ID).toBe("shadcn-studio.ui.tabs");
  });

  it("exports TABS_SLOTS", () => {
    expect(TABS_SLOTS).toEqual({
      root: "tabs",
      list: "tabs-list",
      trigger: "tabs-trigger",
      content: "tabs-content",
    });
  });

  it("exports governed class constants", () => {
    expect(tabsRootClassName).toContain("group/tabs");
    expect(tabsTriggerClassName).toContain("data-active:bg-background");
    expect(tabsContentClassName).toContain("flex-1");
  });

  it("tabsPrimitiveMetadata is JSON-serializable", () => {
    const payload = tabsPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("TabsSlot is a governed slot literal union", () => {
    expectTypeOf<TabsSlot>().toEqualTypeOf<
      "tabs" | "tabs-list" | "tabs-trigger" | "tabs-content"
    >();
  });

  it("TabsProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof TabsProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
