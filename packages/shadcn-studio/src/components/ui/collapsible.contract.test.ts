import { describe, expect, expectTypeOf, it } from "vitest";
import {
  COLLAPSIBLE_PRIMITIVE_ID,
  COLLAPSIBLE_SLOTS,
  collapsiblePrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "./collapsible.contract.js";
import type {
  CollapsibleContentProps,
  CollapsibleProps,
  CollapsibleSlot,
} from "./collapsible.js";

describe("collapsible primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports COLLAPSIBLE_PRIMITIVE_ID for metadata registries", () => {
    expect(COLLAPSIBLE_PRIMITIVE_ID).toBe("shadcn-studio.ui.collapsible");
  });

  it("exports COLLAPSIBLE_SLOTS", () => {
    expect(COLLAPSIBLE_SLOTS).toEqual({
      root: "collapsible",
      trigger: "collapsible-trigger",
      content: "collapsible-content",
    });
  });

  it("collapsiblePrimitiveMetadata is JSON-serializable", () => {
    const payload = collapsiblePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("CollapsibleSlot is a governed slot literal union", () => {
    expectTypeOf<CollapsibleSlot>().toEqualTypeOf<
      "collapsible" | "collapsible-trigger" | "collapsible-content"
    >();
  });

  it("CollapsibleProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CollapsibleProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("CollapsibleContentProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof CollapsibleContentProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
