import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BREADCRUMB_PRIMITIVE_ID,
  BREADCRUMB_SLOTS,
  breadcrumbListClassName,
  breadcrumbPrimitiveMetadata,
  PRIMITIVE_CONTRACT_VERSION,
} from "./breadcrumb.contract.js";
import type { BreadcrumbProps, BreadcrumbSlot } from "./breadcrumb.js";

describe("breadcrumb primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BREADCRUMB_PRIMITIVE_ID for metadata registries", () => {
    expect(BREADCRUMB_PRIMITIVE_ID).toBe("shadcn-studio.ui.breadcrumb");
  });

  it("exports BREADCRUMB_SLOTS", () => {
    expect(BREADCRUMB_SLOTS).toEqual({
      root: "breadcrumb",
      list: "breadcrumb-list",
      item: "breadcrumb-item",
      link: "breadcrumb-link",
      page: "breadcrumb-page",
      separator: "breadcrumb-separator",
      ellipsis: "breadcrumb-ellipsis",
    });
  });

  it("exports breadcrumbListClassName", () => {
    expect(breadcrumbListClassName).toContain("flex flex-wrap");
  });

  it("breadcrumbPrimitiveMetadata is JSON-serializable", () => {
    const payload = breadcrumbPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("BreadcrumbSlot is a governed slot literal union", () => {
    expectTypeOf<BreadcrumbSlot>().toEqualTypeOf<
      | "breadcrumb"
      | "breadcrumb-list"
      | "breadcrumb-item"
      | "breadcrumb-link"
      | "breadcrumb-page"
      | "breadcrumb-separator"
      | "breadcrumb-ellipsis"
    >();
  });

  it("BreadcrumbProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof BreadcrumbProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
