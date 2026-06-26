import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

import { AUTH_EVENT } from "../auth.contract.js";
import {
  handleResendWebhookEvent,
  parseResendWebhookEvent,
  ResendWebhookVerificationError,
  verifyResendWebhookSignature,
} from "../auth.email.resend.webhook.js";

const persistAuthAuditEvent = vi.fn().mockResolvedValue(undefined);

vi.mock("../auth.audit.js", () => ({
  persistAuthAuditEvent: (...args: unknown[]) => persistAuthAuditEvent(...args),
}));

const WEBHOOK_SECRET = "whsec_dGVzdC1zZWNyZXQ=";

function signPayload(
  payload: string,
  secret: string,
  svixId = "msg_123",
  svixTimestamp = `${Math.floor(Date.now() / 1000)}`
): Record<string, string> {
  const key = Buffer.from(
    secret.startsWith("whsec_") ? secret.slice(6) : secret,
    "base64"
  );
  const signedContent = `${svixId}.${svixTimestamp}.${payload}`;
  const signature = createHmac("sha256", key)
    .update(signedContent)
    .digest("base64");

  return {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": `v1,${signature}`,
  };
}

describe("auth.email.resend.webhook", () => {
  it("verifies a valid Svix signature", () => {
    const payload = JSON.stringify({ type: "email.delivered", data: {} });
    const headers = signPayload(payload, WEBHOOK_SECRET);

    expect(() =>
      verifyResendWebhookSignature(payload, headers, WEBHOOK_SECRET)
    ).not.toThrow();
  });

  it("rejects an invalid Svix signature", () => {
    const payload = JSON.stringify({ type: "email.delivered", data: {} });

    expect(() =>
      verifyResendWebhookSignature(
        payload,
        {
          "svix-id": "msg_123",
          "svix-timestamp": `${Math.floor(Date.now() / 1000)}`,
          "svix-signature": "v1,invalid",
        },
        WEBHOOK_SECRET
      )
    ).toThrow(ResendWebhookVerificationError);
  });

  it("parses bounce webhook payloads", () => {
    const event = parseResendWebhookEvent(
      JSON.stringify({
        type: "email.bounced",
        data: {
          email_id: "email_1",
          to: ["user@example.com"],
        },
      })
    );

    expect(event.type).toBe("email.bounced");
    expect(event.data?.email_id).toBe("email_1");
  });

  it("emits auth audit on bounce and complaint events", async () => {
    persistAuthAuditEvent.mockClear();

    await handleResendWebhookEvent({
      type: "email.bounced",
      data: {
        email_id: "email_1",
        to: ["user@example.com"],
      },
    });

    await handleResendWebhookEvent({
      type: "email.complained",
      data: {
        email_id: "email_2",
        to: ["user@example.com"],
      },
    });

    expect(persistAuthAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: AUTH_EVENT.emailDeliveryBounced,
        result: "failure",
      })
    );
    expect(persistAuthAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        event: AUTH_EVENT.emailDeliveryComplained,
        result: "failure",
      })
    );
  });
});
