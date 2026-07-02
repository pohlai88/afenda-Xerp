import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CATEGORY_BAR_PRIMITIVE_ID,
  CATEGORY_BAR_SLOTS,
  categoryBarLabelsClassName,
  categoryBarPrimitiveMetadata,
  categoryBarRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/category-bar.contract.js";
import type {
  CategoryBarProps,
  CategoryBarSlot,
} from "../../components-ui/category-bar.js";

describe("category-bar primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports CATEGORY_BAR_PRIMITIVE_ID for metadata registries", () => {
    expect(CATEGORY_BAR_PRIMITIVE_ID).toBe("shadcn-studio.ui.category-bar");
  });

  it("exports CATEGORY_BAR_SLOTS", () => {
    expect(CATEGORY_BAR_SLOTS).toEqual({
      root: "category-bar",
      labels: "category-bar-labels",
      track: "category-bar-track",
      segment: "category-bar-segment",
      marker: "category-bar-marker",
    });
  });

  it("exports governed class constants", () => {
    expect(categoryBarLabelsClassName).toContain("text-muted-foreground");
    expect(categoryBarRootClassName).toBe("w-full");
  });

  it("categoryBarPrimitiveMetadata is JSON-serializable", () => {
    const payload = categoryBarPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CategoryBarSlot is a governed slot literal union", () => {
    expectTypeOf<CategoryBarSlot>().toEqualTypeOf<
      | "category-bar"
      | "category-bar-labels"
      | "category-bar-track"
      | "category-bar-segment"
      | "category-bar-marker"
    >();
  });

  it("CategoryBarProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CategoryBarProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
