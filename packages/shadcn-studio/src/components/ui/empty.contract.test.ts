import { describe, expect, expectTypeOf, it } from "vitest";
import {
  EMPTY_PRIMITIVE_ID,
  EMPTY_SLOTS,
  emptyPrimitiveMetadata,
  emptyRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./empty.contract.js";
import type { EmptyProps, EmptySlot } from "./empty.js";

describe("empty primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports EMPTY_PRIMITIVE_ID for metadata registries", () => {
    expect(EMPTY_PRIMITIVE_ID).toBe("shadcn-studio.ui.empty");
  });

  it("exports EMPTY_SLOTS", () => {
    expect(EMPTY_SLOTS).toEqual({
      root: "empty",
      header: "empty-header",
      media: "empty-icon",
      title: "empty-title",
      description: "empty-description",
      content: "empty-content",
    });
  });

  it("exports governed class constants", () => {
    expect(emptyRootClassName).toContain("border-dashed");
  });

  it("emptyPrimitiveMetadata is JSON-serializable", () => {
    const payload = emptyPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("EmptySlot is a governed slot literal union", () => {
    expectTypeOf<EmptySlot>().toEqualTypeOf<
      | "empty"
      | "empty-header"
      | "empty-icon"
      | "empty-title"
      | "empty-description"
      | "empty-content"
    >();
  });

  it("EmptyProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof EmptyProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
