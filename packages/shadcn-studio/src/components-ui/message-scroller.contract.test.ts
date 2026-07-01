import { describe, expect, expectTypeOf, it } from "vitest";
import {
  MESSAGE_SCROLLER_PRIMITIVE_ID,
  MESSAGE_SCROLLER_SLOTS,
  MESSAGE_SCROLLER_VENDOR,
  messageScrollerPrimitiveMetadata,
  messageScrollerRootClassName,
  messageScrollerViewportClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "./message-scroller.contract.js";
import type {
  MessageScrollerProps,
  MessageScrollerSlot,
} from "./message-scroller.js";

describe("message-scroller primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports MESSAGE_SCROLLER_PRIMITIVE_ID for metadata registries", () => {
    expect(MESSAGE_SCROLLER_PRIMITIVE_ID).toBe(
      "shadcn-studio.ui.message-scroller"
    );
  });

  it("exports MESSAGE_SCROLLER_VENDOR", () => {
    expect(MESSAGE_SCROLLER_VENDOR).toBe("@shadcn/react/message-scroller");
  });

  it("exports MESSAGE_SCROLLER_SLOTS", () => {
    expect(MESSAGE_SCROLLER_SLOTS).toEqual({
      root: "message-scroller",
      viewport: "message-scroller-viewport",
      content: "message-scroller-content",
      item: "message-scroller-item",
      button: "message-scroller-button",
    });
  });

  it("exports governed class constants", () => {
    expect(messageScrollerRootClassName).toContain("group/message-scroller");
    expect(messageScrollerViewportClassName).toContain("overflow-y-auto");
  });

  it("messageScrollerPrimitiveMetadata is JSON-serializable", () => {
    const payload = messageScrollerPrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
    expect(payload.vendor).toBe("@shadcn/react/message-scroller");
  });

  it("MessageScrollerSlot is a governed slot literal union", () => {
    expectTypeOf<MessageScrollerSlot>().toEqualTypeOf<
      | "message-scroller"
      | "message-scroller-viewport"
      | "message-scroller-content"
      | "message-scroller-item"
      | "message-scroller-button"
    >();
  });

  it("MessageScrollerProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof MessageScrollerProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
