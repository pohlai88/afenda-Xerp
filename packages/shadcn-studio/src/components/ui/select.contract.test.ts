import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SELECT_PRIMITIVE_ID,
  SELECT_SLOTS,
  selectContentClassName,
  selectPrimitiveMetadata,
} from "./select.contract.js";
import type {
  SelectContentProps,
  SelectSlot,
  SelectTriggerProps,
} from "./select.js";

describe("select primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SELECT_PRIMITIVE_ID for metadata registries", () => {
    expect(SELECT_PRIMITIVE_ID).toBe("shadcn-studio.ui.select");
  });

  it("exports SELECT_SLOTS with portal and list", () => {
    expect(SELECT_SLOTS.portal).toBe("select-portal");
    expect(SELECT_SLOTS.list).toBe("select-list");
  });

  it("exports governed class constants", () => {
    expect(selectContentClassName).toContain("bg-popover");
  });

  it("selectPrimitiveMetadata is JSON-serializable", () => {
    const payload = selectPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SelectSlot is a governed slot literal union", () => {
    expectTypeOf<SelectSlot>().toEqualTypeOf<
      (typeof SELECT_SLOTS)[keyof typeof SELECT_SLOTS]
    >();
  });

  it("SelectTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SelectTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("SelectContentProps.side defaults in adapter", () => {
    expectTypeOf<SelectContentProps["side"]>().toEqualTypeOf<
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
