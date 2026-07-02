import { describe, expect, expectTypeOf, it } from "vitest";
import {
  ATTACHMENT_PRIMITIVE_ID,
  ATTACHMENT_SLOTS,
  attachmentPrimitiveMetadata,
  attachmentVariants,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/attachment.contract.js";
import type {
  AttachmentProps,
  AttachmentSlot,
} from "../../components-ui/attachment.js";

describe("attachment primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports ATTACHMENT_PRIMITIVE_ID for metadata registries", () => {
    expect(ATTACHMENT_PRIMITIVE_ID).toBe("shadcn-studio.ui.attachment");
  });

  it("exports ATTACHMENT_SLOTS", () => {
    expect(ATTACHMENT_SLOTS).toEqual({
      root: "attachment",
      media: "attachment-media",
      content: "attachment-content",
      title: "attachment-title",
      description: "attachment-description",
      actions: "attachment-actions",
      action: "attachment-action",
      trigger: "attachment-trigger",
      group: "attachment-group",
    });
  });

  it("exports attachmentVariants cva", () => {
    expect(
      attachmentVariants({ size: "default", orientation: "horizontal" })
    ).toContain("group/attachment");
  });

  it("attachmentPrimitiveMetadata is JSON-serializable", () => {
    const payload = attachmentPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("AttachmentSlot is a governed slot literal union", () => {
    expectTypeOf<AttachmentSlot>().toEqualTypeOf<
      | "attachment"
      | "attachment-media"
      | "attachment-content"
      | "attachment-title"
      | "attachment-description"
      | "attachment-actions"
      | "attachment-action"
      | "attachment-trigger"
      | "attachment-group"
    >();
  });

  it("AttachmentProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof AttachmentProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
