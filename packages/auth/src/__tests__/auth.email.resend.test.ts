import { describe, expect, it, vi } from "vitest";

import type { AuthEmailResendClient } from "../auth.email.contract.js";
import {
  createAuthResendClient,
  sendAuthEmailViaResend,
} from "../auth.email.resend.js";

describe("auth.email.resend", () => {
  it("accepts a structural AuthEmailResendClient mock without Resend types", async () => {
    const send = vi.fn().mockResolvedValue({
      data: { id: "msg_adapter" },
      error: null,
    });
    const client: AuthEmailResendClient = { emails: { send } };

    const result = await sendAuthEmailViaResend({
      apiKey: "re_test",
      from: "Afenda ERP <auth@example.com>",
      message: {
        to: "user@example.com",
        subject: "Test",
        html: "<p>Test</p>",
      },
      client,
    });

    expect(result.messageId).toBe("msg_adapter");
    expect(send).toHaveBeenCalledOnce();
  });

  it("createAuthResendClient returns an AuthEmailResendClient-shaped adapter", () => {
    const client = createAuthResendClient("re_test");

    expect(client.emails).toBeDefined();
    expect(typeof client.emails.send).toBe("function");
  });
});
