import { describe, expect, expectTypeOf, it } from "vitest";
import {
  DIALOG_PRIMITIVE_ID,
  DIALOG_SLOTS,
  dialogContentClassName,
  dialogPrimitiveMetadata,
  dialogViewportClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/dialog.contract.js";
import type {
  DialogContentProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogSlot,
  DialogTriggerProps,
  DialogViewportProps,
} from "../../components-ui/dialog.js";

describe("dialog primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports DIALOG_PRIMITIVE_ID for metadata registries", () => {
    expect(DIALOG_PRIMITIVE_ID).toBe("shadcn-studio.ui.dialog");
  });

  it("exports DIALOG_SLOTS including viewport", () => {
    expect(DIALOG_SLOTS).toEqual({
      root: "dialog",
      trigger: "dialog-trigger",
      portal: "dialog-portal",
      close: "dialog-close",
      overlay: "dialog-overlay",
      viewport: "dialog-viewport",
      content: "dialog-content",
      header: "dialog-header",
      footer: "dialog-footer",
      title: "dialog-title",
      description: "dialog-description",
    });
  });

  it("exports viewport and content class constants", () => {
    expect(dialogViewportClassName).toContain("flex");
    expect(dialogContentClassName).toContain("group/dialog-content");
  });

  it("dialogPrimitiveMetadata is JSON-serializable", () => {
    const payload = dialogPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("DialogSlot includes viewport literal", () => {
    expectTypeOf<DialogSlot>().toEqualTypeOf<
      (typeof DIALOG_SLOTS)[keyof typeof DIALOG_SLOTS]
    >();
  });

  it("DialogTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof DialogTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("DialogViewportProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof DialogViewportProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("DialogContentProps supports showCloseButton", () => {
    expectTypeOf<DialogContentProps["showCloseButton"]>().toEqualTypeOf<
      boolean | undefined
    >();
  });

  it("layout slot props omit governed data-slot key", () => {
    type HeaderHasGovernedSlot = "data-slot" extends keyof DialogHeaderProps
      ? true
      : false;
    type FooterHasGovernedSlot = "data-slot" extends keyof DialogFooterProps
      ? true
      : false;

    expectTypeOf<HeaderHasGovernedSlot>().toEqualTypeOf<false>();
    expectTypeOf<FooterHasGovernedSlot>().toEqualTypeOf<false>();
  });
});
