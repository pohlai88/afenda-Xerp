import { describe, expect, expectTypeOf, it } from "vitest";
import {
  BUTTON_PRIMITIVE_ID,
  BUTTON_SLOTS,
  buttonPrimitiveMetadata,
  buttonVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/button.contract.js";
import type { ButtonProps, ButtonSlot } from "../../components-ui/button.js";

describe("button primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports BUTTON_PRIMITIVE_ID for metadata registries", () => {
    expect(BUTTON_PRIMITIVE_ID).toBe("shadcn-studio.ui.button");
  });

  it("exports BUTTON_SLOTS", () => {
    expect(BUTTON_SLOTS).toEqual({ root: "button" });
  });

  it("exports buttonVariants cva", () => {
    expect(buttonVariants({ variant: "default", size: "default" })).toContain(
      "group/button"
    );
  });

  it("buttonPrimitiveMetadata is JSON-serializable", () => {
    const payload = buttonPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("ButtonSlot is a governed slot literal union", () => {
    expectTypeOf<ButtonSlot>().toEqualTypeOf<"button">();
  });

  it("ButtonProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof ButtonProps ? true : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("ButtonProps supports variant and size unions", () => {
    expectTypeOf<ButtonProps["variant"]>().toEqualTypeOf<
      | "default"
      | "outline"
      | "secondary"
      | "ghost"
      | "destructive"
      | "link"
      | null
      | undefined
    >();
    expectTypeOf<ButtonProps["size"]>().toEqualTypeOf<
      | "default"
      | "xs"
      | "sm"
      | "lg"
      | "icon"
      | "icon-xs"
      | "icon-sm"
      | "icon-lg"
      | null
      | undefined
    >();
  });
});
