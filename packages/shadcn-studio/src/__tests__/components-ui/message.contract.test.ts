import { describe, expect, expectTypeOf, it } from "vitest";
import {
  MESSAGE_PRIMITIVE_ID,
  MESSAGE_SLOTS,
  messageGroupClassName,
  messagePrimitiveMetadata,
  messageRootClassName,
  PRIMITIVE_CONTRACT_VERSION,
} from "../../components-ui/message.contract.js";
import type { MessageProps, MessageSlot } from "../../components-ui/message.js";

describe("message primitive contract", () => {
  it("exports PRIMITIVE_CONTRACT_VERSION", () => {
    expect(PRIMITIVE_CONTRACT_VERSION).toBe("1.2.0");
  });

  it("exports MESSAGE_PRIMITIVE_ID for metadata registries", () => {
    expect(MESSAGE_PRIMITIVE_ID).toBe("shadcn-studio.ui.message");
  });

  it("exports MESSAGE_SLOTS", () => {
    expect(MESSAGE_SLOTS).toEqual({
      group: "message-group",
      root: "message",
      avatar: "message-avatar",
      content: "message-content",
      header: "message-header",
      footer: "message-footer",
    });
  });

  it("exports governed class constants", () => {
    expect(messageGroupClassName).toContain("flex-col");
    expect(messageRootClassName).toContain("group/message");
  });

  it("messagePrimitiveMetadata is JSON-serializable", () => {
    const payload = messagePrimitiveMetadata();
    expect(() => JSON.stringify(payload)).not.toThrow();
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
  });

  it("MessageSlot is a governed slot literal union", () => {
    expectTypeOf<MessageSlot>().toEqualTypeOf<
      | "message-group"
      | "message"
      | "message-avatar"
      | "message-content"
      | "message-header"
      | "message-footer"
    >();
  });

  it("MessageProps omits governed data-slot key", () => {
    type HasGovernedSlot = "data-slot" extends keyof MessageProps
      ? true
      : false;
    expectTypeOf<HasGovernedSlot>().toEqualTypeOf<false>();
  });
});
