import { describe, expect, expectTypeOf, it } from "vitest";
import {
  INPUT_GROUP_PRIMITIVE_ID,
  INPUT_GROUP_SLOTS,
  inputGroupAddonVariants,
  inputGroupButtonVariants,
  inputGroupPrimitiveMetadata,
  inputGroupRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./input-group.contract.js";
import type { InputGroupProps, InputGroupSlot } from "./input-group.js";

describe("input-group primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports INPUT_GROUP_PRIMITIVE_ID for metadata registries", () => {
    expect(INPUT_GROUP_PRIMITIVE_ID).toBe("shadcn-studio.ui.input-group");
  });

  it("exports INPUT_GROUP_SLOTS", () => {
    expect(INPUT_GROUP_SLOTS).toEqual({
      root: "input-group",
      addon: "input-group-addon",
      control: "input-group-control",
    });
  });

  it("exports cva variants and class constants", () => {
    expect(inputGroupRootClassName).toContain("group/input-group");
    expect(inputGroupAddonVariants({ align: "inline-start" })).toContain(
      "order-first"
    );
    expect(inputGroupButtonVariants({ size: "xs" })).toContain("h-6");
  });

  it("inputGroupPrimitiveMetadata is JSON-serializable", () => {
    const payload = inputGroupPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("InputGroupSlot is a governed slot literal union", () => {
    expectTypeOf<InputGroupSlot>().toEqualTypeOf<
      "input-group" | "input-group-addon" | "input-group-control"
    >();
  });

  it("InputGroupProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof InputGroupProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
