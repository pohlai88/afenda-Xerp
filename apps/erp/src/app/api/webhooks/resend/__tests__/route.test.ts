import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ResendWebhookVerificationError = class ResendWebhookVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResendWebhookVerificationError";
  }
};

const getResendWebhookSecret = vi.fn();
const handleResendWebhookEvent = vi.fn();
const parseResendWebhookEvent = vi.fn();
const verifyResendWebhookSignature = vi.fn();

vi.mock("@afenda/auth", () => ({
  getResendWebhookSecret,
  handleResendWebhookEvent,
  parseResendWebhookEvent,
  ResendWebhookVerificationError,
  verifyResendWebhookSignature,
}));

describe("resend webhook route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getResendWebhookSecret.mockReturnValue("whsec_test");
    parseResendWebhookEvent.mockReturnValue({ type: "email.delivered" });
    handleResendWebhookEvent.mockResolvedValue(undefined);
    verifyResendWebhookSignature.mockImplementation(() => undefined);
  });

  it("returns 503 when webhook secret is not configured", async () => {
    getResendWebhookSecret.mockReturnValue(undefined);
    const { POST } = await import("../route");

    const response = await POST(
      new Request("http://localhost/api/webhooks/resend", {
        method: "POST",
        body: "{}",
      })
    );

    expect(response.status).toBe(503);
  });

  it("returns 401 when signature verification fails", async () => {
    verifyResendWebhookSignature.mockImplementation(() => {
      throw new ResendWebhookVerificationError("Invalid signature");
    });
    const { POST } = await import("../route");

    const response = await POST(
      new Request("http://localhost/api/webhooks/resend", {
        method: "POST",
        body: "{}",
      })
    );

    expect(response.status).toBe(401);
  });

  it("accepts verified webhook payloads", async () => {
    const { POST } = await import("../route");
    const payload = JSON.stringify({ type: "email.delivered", data: {} });

    const response = await POST(
      new Request("http://localhost/api/webhooks/resend", {
        method: "POST",
        body: payload,
        headers: {
          "svix-id": "msg_1",
          "svix-timestamp": `${Math.floor(Date.now() / 1000)}`,
          "svix-signature": `v1,${createHmac("sha256", "test").update("x").digest("base64")}`,
        },
      })
    );

    expect(response.status).toBe(200);
    expect(verifyResendWebhookSignature).toHaveBeenCalledOnce();
    expect(handleResendWebhookEvent).toHaveBeenCalledOnce();
  });
});
