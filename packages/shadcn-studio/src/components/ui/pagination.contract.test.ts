import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PAGINATION_PRIMITIVE_ID,
  PAGINATION_SLOTS,
  PRIMITIVE_CONTRACT_VERSION,
  paginationPrimitiveMetadata,
  paginationRootClassName,
} from "./pagination.contract.js";
import type { PaginationProps, PaginationSlot } from "./pagination.js";

describe("pagination primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports PAGINATION_PRIMITIVE_ID for metadata registries", () => {
    expect(PAGINATION_PRIMITIVE_ID).toBe("shadcn-studio.ui.pagination");
  });

  it("exports PAGINATION_SLOTS", () => {
    expect(PAGINATION_SLOTS).toEqual({
      root: "pagination",
      content: "pagination-content",
      item: "pagination-item",
      link: "pagination-link",
      ellipsis: "pagination-ellipsis",
    });
  });

  it("exports governed class constants", () => {
    expect(paginationRootClassName).toContain("justify-center");
  });

  it("paginationPrimitiveMetadata is JSON-serializable", () => {
    const payload = paginationPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("PaginationSlot is a governed slot literal union", () => {
    expectTypeOf<PaginationSlot>().toEqualTypeOf<
      | "pagination"
      | "pagination-content"
      | "pagination-item"
      | "pagination-link"
      | "pagination-ellipsis"
    >();
  });

  it("PaginationProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof PaginationProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
