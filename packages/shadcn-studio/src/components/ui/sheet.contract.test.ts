import { describe, expect, expectTypeOf, it } from "vitest";
import {
  PRIMITIVE_CONTRACT_VERSION,
  SHEET_PRIMITIVE_ID,
  SHEET_SLOTS,
  sheetContentClassName,
  sheetPrimitiveMetadata,
  sheetViewportClassName,
} from "./sheet.contract.js";
import type {
  SheetContentProps,
  SheetFooterProps,
  SheetHeaderProps,
  SheetSlot,
  SheetTriggerProps,
  SheetViewportProps,
} from "./sheet.js";

describe("sheet primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports SHEET_PRIMITIVE_ID for metadata registries", () => {
    expect(SHEET_PRIMITIVE_ID).toBe("shadcn-studio.ui.sheet");
  });

  it("exports SHEET_SLOTS including viewport", () => {
    expect(SHEET_SLOTS).toEqual({
      root: "sheet",
      trigger: "sheet-trigger",
      close: "sheet-close",
      portal: "sheet-portal",
      overlay: "sheet-overlay",
      viewport: "sheet-viewport",
      content: "sheet-content",
      header: "sheet-header",
      footer: "sheet-footer",
      title: "sheet-title",
      description: "sheet-description",
    });
  });

  it("exports viewport and content class constants", () => {
    expect(sheetViewportClassName).toContain("fixed");
    expect(sheetContentClassName).toContain("data-[side=right]");
  });

  it("sheetPrimitiveMetadata is JSON-serializable", () => {
    const payload = sheetPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("SheetSlot includes viewport literal", () => {
    expectTypeOf<SheetSlot>().toEqualTypeOf<
      (typeof SHEET_SLOTS)[keyof typeof SHEET_SLOTS]
    >();
  });

  it("SheetTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SheetTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("SheetViewportProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof SheetViewportProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("SheetContentProps supports side variant", () => {
    expectTypeOf<SheetContentProps["side"]>().toEqualTypeOf<
      "top" | "right" | "bottom" | "left" | undefined
    >();
  });

  it("layout slot props omit governed data-slot key", () => {
    type HeaderHasGovernedSlot = "data-slot" extends keyof SheetHeaderProps
      ? true
      : false;
    type FooterHasGovernedSlot = "data-slot" extends keyof SheetFooterProps
      ? true
      : false;

    expectTypeOf<HeaderHasGovernedSlot>().toEqualTypeOf<false>();
    expectTypeOf<FooterHasGovernedSlot>().toEqualTypeOf<false>();
  });
});
