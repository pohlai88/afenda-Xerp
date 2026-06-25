import { describe, expect, it } from "vitest";

import {
  createAuthPasswordResetEmailSender,
  createAuthVerificationEmailSender,
  deliverAuthTransactionalEmail,
} from "../auth.email.js";
import { isAuthEmailDeliveryEnabled } from "../auth.env.js";

describe("auth.email", () => {
  it("reports email delivery disabled when API key is unset", () => {
    expect(isAuthEmailDeliveryEnabled({})).toBe(false);
  });

  it("reports email delivery enabled when API key is configured", () => {
    expect(
      isAuthEmailDeliveryEnabled({
        AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
      })
    ).toBe(true);
  });

  it("no-ops transactional delivery when API key is unset", async () => {
    await expect(deliverAuthTransactionalEmail({})).resolves.toEqual({
      delivered: false,
      reason: "email_delivery_disabled",
    });
  });

  it("marks transactional delivery as delivered when API key is configured", async () => {
    await expect(
      deliverAuthTransactionalEmail({
        AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
      })
    ).resolves.toEqual({ delivered: true });
  });

  it("invokes verification email delegate without throwing when delivery is disabled", async () => {
    const sender = createAuthVerificationEmailSender({});

    await expect(
      sender({
        user: {
          id: "auth_user_1",
          email: "user@example.com",
          name: "Test User",
        },
        url: "http://localhost:3000/api/auth/verify-email?token=abc",
        token: "abc",
      })
    ).resolves.toBeUndefined();
  });

  it("invokes password reset email delegate without throwing when delivery is disabled", async () => {
    const sender = createAuthPasswordResetEmailSender({});

    await expect(
      sender({
        user: {
          id: "auth_user_1",
          email: "user@example.com",
          name: "Test User",
        },
        url: "http://localhost:3000/api/auth/reset-password/token?callbackURL=%2F",
        token: "token",
      })
    ).resolves.toBeUndefined();
  });
});
