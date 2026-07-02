import { describe, expect, expectTypeOf, it } from "vitest";
import {
  ITEM_PRIMITIVE_ID,
  ITEM_SLOTS,
  itemMediaVariants,
  itemPrimitiveMetadata,
  itemVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/item.contract.js";
import type { ItemProps, ItemSlot } from "../../components-ui/item.js";

describe("item primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports ITEM_PRIMITIVE_ID for metadata registries", () => {
    expect(ITEM_PRIMITIVE_ID).toBe("shadcn-studio.ui.item");
  });

  it("exports ITEM_SLOTS", () => {
    expect(ITEM_SLOTS).toEqual({
      group: "item-group",
      separator: "item-separator",
      root: "item",
      media: "item-media",
      content: "item-content",
      title: "item-title",
      description: "item-description",
      actions: "item-actions",
      header: "item-header",
      footer: "item-footer",
    });
  });

  it("exports itemVariants and itemMediaVariants cva", () => {
    expect(itemVariants({ variant: "default", size: "default" })).toContain(
      "group/item"
    );
    expect(itemMediaVariants({ variant: "icon" })).toContain("size-4");
  });

  it("itemPrimitiveMetadata is JSON-serializable", () => {
    const payload = itemPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ItemSlot is a governed slot literal union", () => {
    expectTypeOf<ItemSlot>().toEqualTypeOf<
      | "item-group"
      | "item-separator"
      | "item"
      | "item-media"
      | "item-content"
      | "item-title"
      | "item-description"
      | "item-actions"
      | "item-header"
      | "item-footer"
    >();
  });

  it("ItemProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ItemProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
