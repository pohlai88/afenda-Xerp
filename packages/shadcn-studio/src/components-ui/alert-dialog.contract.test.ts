import { describe, expect, expectTypeOf, it } from "vitest";
import {
  ALERT_DIALOG_PRIMITIVE_ID,
  ALERT_DIALOG_SLOTS,
  alertDialogContentClassName,
  alertDialogPrimitiveMetadata,
  alertDialogViewportClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./alert-dialog.contract.js";
import type {
  AlertDialogContentProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogMediaProps,
  AlertDialogSlot,
  AlertDialogTriggerProps,
} from "./alert-dialog.js";

describe("alert-dialog primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports ALERT_DIALOG_PRIMITIVE_ID for metadata registries", () => {
    expect(ALERT_DIALOG_PRIMITIVE_ID).toBe("shadcn-studio.ui.alert-dialog");
  });

  it("exports ALERT_DIALOG_SLOTS including viewport", () => {
    expect(ALERT_DIALOG_SLOTS).toEqual({
      root: "alert-dialog",
      trigger: "alert-dialog-trigger",
      portal: "alert-dialog-portal",
      overlay: "alert-dialog-overlay",
      viewport: "alert-dialog-viewport",
      content: "alert-dialog-content",
      header: "alert-dialog-header",
      footer: "alert-dialog-footer",
      media: "alert-dialog-media",
      title: "alert-dialog-title",
      description: "alert-dialog-description",
      action: "alert-dialog-action",
      cancel: "alert-dialog-cancel",
    });
  });

  it("exports viewport and content class constants", () => {
    expect(alertDialogViewportClassName).toContain("flex");
    expect(alertDialogContentClassName).toContain("group/alert-dialog-content");
  });

  it("alertDialogPrimitiveMetadata is JSON-serializable", () => {
    const payload = alertDialogPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("AlertDialogSlot includes viewport literal", () => {
    expectTypeOf<AlertDialogSlot>().toEqualTypeOf<
      | "alert-dialog"
      | "alert-dialog-trigger"
      | "alert-dialog-portal"
      | "alert-dialog-overlay"
      | "alert-dialog-viewport"
      | "alert-dialog-content"
      | "alert-dialog-header"
      | "alert-dialog-footer"
      | "alert-dialog-media"
      | "alert-dialog-title"
      | "alert-dialog-description"
      | "alert-dialog-action"
      | "alert-dialog-cancel"
    >();
  });

  it("AlertDialogTriggerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof AlertDialogTriggerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });

  it("AlertDialogContentProps supports size variant", () => {
    expectTypeOf<AlertDialogContentProps["size"]>().toEqualTypeOf<
      "default" | "sm" | undefined
    >();
  });

  it("layout slot props omit governed data-slot key", () => {
    type HeaderHasGovernedSlot =
      "data-slot" extends keyof AlertDialogHeaderProps ? true : false;
    type FooterHasGovernedSlot =
      "data-slot" extends keyof AlertDialogFooterProps ? true : false;
    type MediaHasGovernedSlot = "data-slot" extends keyof AlertDialogMediaProps
      ? true
      : false;

    expectTypeOf<HeaderHasGovernedSlot>().toEqualTypeOf<false>();
    expectTypeOf<FooterHasGovernedSlot>().toEqualTypeOf<false>();
    expectTypeOf<MediaHasGovernedSlot>().toEqualTypeOf<false>();
  });
});
