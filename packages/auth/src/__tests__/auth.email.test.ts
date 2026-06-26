import { afterEach, describe, expect, it, vi } from "vitest";

import type { AuthEmailResendClient } from "../auth.email.contract.js";

import {
  AuthEmailDeliveryError,
  buildAuthInvitationEmailMessage,
  buildAuthInvitationSignUpUrl,
  buildAuthPasswordResetEmailMessage,
  buildAuthTwoFactorOtpEmailMessage,
  buildAuthVerificationEmailMessage,
  createAuthPasswordResetEmailSender,
  createAuthTwoFactorOtpSender,
  createAuthVerificationEmailSender,
  deliverAuthInvitationEmail,
  deliverAuthTransactionalEmail,
} from "../auth.email.js";
import { sendAuthEmailViaResend } from "../auth.email.resend.js";
import {
  AFENDA_AUTH_EMAIL_FROM_ENV,
  isAuthEmailDeliveryEnabled,
} from "../auth.env.js";
import { BETTER_AUTH_URL_ENV } from "../auth.errors.js";

const sampleUser = {
  id: "auth_user_1",
  email: "user@example.com",
  name: "Test User",
} as const;

function createMockResendClient(
  send: ReturnType<typeof vi.fn>
): AuthEmailResendClient {
  return {
    emails: { send },
  };
}

describe("auth.email", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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
    await expect(
      deliverAuthTransactionalEmail(
        {
          to: sampleUser.email,
          subject: "Test",
          html: "<p>Test</p>",
        },
        {}
      )
    ).resolves.toEqual({
      delivered: false,
      reason: "email_delivery_disabled",
    });
  });

  it("no-ops when API key is set but from-address is missing", async () => {
    await expect(
      deliverAuthTransactionalEmail(
        {
          to: sampleUser.email,
          subject: "Test",
          html: "<p>Test</p>",
        },
        { AFENDA_AUTH_EMAIL_API_KEY: "re_test_key" }
      )
    ).resolves.toEqual({
      delivered: false,
      reason: "email_not_configured",
    });
  });

  it("builds serializable verification and reset email messages", async () => {
    const verification = await buildAuthVerificationEmailMessage({
      user: sampleUser,
      url: "http://localhost:3000/api/auth/verify-email?token=abc",
      token: "abc",
    });
    const reset = await buildAuthPasswordResetEmailMessage({
      user: sampleUser,
      url: "http://localhost:3000/api/auth/reset-password/token",
      token: "token",
    });

    expect(JSON.parse(JSON.stringify(verification))).toEqual(verification);
    expect(JSON.parse(JSON.stringify(reset))).toEqual(reset);
    expect(verification.to).toBe(sampleUser.email);
    expect(reset.subject).toMatch(/Reset your Afenda ERP password/);
    expect(verification.html).toContain("Verify email");
  });

  it("builds serializable two-factor OTP email messages", async () => {
    const otpMessage = await buildAuthTwoFactorOtpEmailMessage({
      otp: "654321",
      user: sampleUser,
    });

    expect(JSON.parse(JSON.stringify(otpMessage))).toEqual(otpMessage);
    expect(otpMessage.to).toBe(sampleUser.email);
    expect(otpMessage.subject).toMatch(/sign-in code/i);
    expect(otpMessage.html).toContain("654321");
  });

  it("createAuthTwoFactorOtpSender delivers OTP email when configured", async () => {
    const send = vi.fn().mockResolvedValue({
      data: { id: "msg_otp_1" },
      error: null,
    });
    const client = createMockResendClient(send);
    const sender = createAuthTwoFactorOtpSender(
      {
        AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
        [AFENDA_AUTH_EMAIL_FROM_ENV]: "Afenda ERP <auth@example.com>",
      },
      { client }
    );

    await sender({ otp: "112233", user: sampleUser });

    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0]?.[0]).toMatchObject({
      subject: expect.stringMatching(/sign-in code/i),
      to: [sampleUser.email],
    });
  });

  it("delivers via Resend when API key and from-address are configured", async () => {
    const send = vi.fn().mockResolvedValue({
      data: { id: "msg_123" },
      error: null,
    });
    const client = createMockResendClient(send);

    await expect(
      deliverAuthTransactionalEmail(
        {
          to: sampleUser.email,
          subject: "Verify your Afenda ERP email",
          html: "<p>Verify</p>",
        },
        {
          AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
          [AFENDA_AUTH_EMAIL_FROM_ENV]: "Afenda ERP <auth@example.com>",
        },
        { client }
      )
    ).resolves.toEqual({ delivered: true, messageId: "msg_123" });

    expect(send).toHaveBeenCalledOnce();
  });

  it("throws AuthEmailDeliveryError when Resend returns an API error", async () => {
    const client = createMockResendClient(
      vi.fn().mockResolvedValue({
        data: null,
        error: { name: "validation_error", message: "invalid from" },
      })
    );

    await expect(
      sendAuthEmailViaResend({
        apiKey: "re_test_key",
        from: "Afenda ERP <auth@example.com>",
        message: {
          to: sampleUser.email,
          subject: "Test",
          html: "<p>Test</p>",
        },
        client,
      })
    ).rejects.toBeInstanceOf(AuthEmailDeliveryError);
  });

  it("invokes verification email delegate without throwing when delivery is disabled", async () => {
    const sender = createAuthVerificationEmailSender({});

    await expect(
      sender({
        user: sampleUser,
        url: "http://localhost:3000/api/auth/verify-email?token=abc",
        token: "abc",
      })
    ).resolves.toBeUndefined();
  });

  it("invokes password reset email delegate without throwing when delivery is disabled", async () => {
    const sender = createAuthPasswordResetEmailSender({});

    await expect(
      sender({
        user: sampleUser,
        url: "http://localhost:3000/api/auth/reset-password/token?callbackURL=%2F",
        token: "token",
      })
    ).resolves.toBeUndefined();
  });

  it("sends verify and reset emails with idempotency keys and email_kind tags", async () => {
    const send = vi.fn().mockResolvedValue({
      data: { id: "msg_verify_1" },
      error: null,
    });
    const client = createMockResendClient(send);

    const env = {
      AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
      AFENDA_AUTH_EMAIL_FROM: "Afenda ERP <auth@example.com>",
    };

    await createAuthVerificationEmailSender(env, { client })({
      user: sampleUser,
      url: "http://localhost:3000/api/auth/verify-email?token=verify_1",
      token: "verify_1",
    });

    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0]?.[0]).toMatchObject({
      idempotencyKey: "auth/verify/verify_1",
      tags: [{ name: "email_kind", value: "verify" }],
    });

    send.mockResolvedValue({
      data: { id: "msg_reset_1" },
      error: null,
    });

    await createAuthPasswordResetEmailSender(env, { client })({
      user: sampleUser,
      url: "http://localhost:3000/api/auth/reset-password/reset_1",
      token: "reset_1",
    });

    expect(send.mock.calls[1]?.[0]).toMatchObject({
      idempotencyKey: "auth/reset/reset_1",
      tags: [{ name: "email_kind", value: "reset" }],
    });
  });

  it("builds invitation email with sign-up URL from Better Auth base URL", async () => {
    const env = {
      [BETTER_AUTH_URL_ENV]: "https://erp.example.com",
      BETTER_AUTH_SECRET: "x".repeat(32),
    };

    const url = buildAuthInvitationSignUpUrl(
      {
        token: "invite_token_1",
        user: { email: "user@example.com" },
      },
      env
    );

    expect(url).toBe(
      "https://erp.example.com/v2/invite/accept?invitationToken=invite_token_1&email=user%40example.com"
    );

    const legacyUrl = buildAuthInvitationSignUpUrl(
      {
        token: "invite_token_1",
        user: { email: "user@example.com" },
      },
      { ...env, AFENDA_AUTH_SHELL_V2_DEFAULT: "false" }
    );

    expect(legacyUrl).toBe(
      "https://erp.example.com/invite/accept?invitationToken=invite_token_1&email=user%40example.com"
    );

    const message = await buildAuthInvitationEmailMessage(
      {
        token: "invite_token_1",
        user: { email: "user@example.com", name: "Test User" },
        invitationId: "invite_1",
      },
      env
    );

    expect(message.to).toBe("user@example.com");
    expect(message.subject).toMatch(/invited to Afenda ERP/i);
    expect(message.html).toContain("invitationToken=invite_token_1");
    expect(message.html).toContain("email=user%40example.com");
    expect(message.text).toContain(url);
  });

  it("sends Idempotency-Key header and Resend tags when metadata is provided", async () => {
    const send = vi.fn().mockResolvedValue({
      data: { id: "msg_invite_1" },
      error: null,
    });
    const client = createMockResendClient(send);

    await expect(
      deliverAuthTransactionalEmail(
        {
          to: sampleUser.email,
          subject: "You are invited to Afenda ERP",
          html: "<p>Invite</p>",
        },
        {
          AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
          [AFENDA_AUTH_EMAIL_FROM_ENV]: "Afenda ERP <auth@example.com>",
        },
        { client },
        {
          emailKind: "invite",
          idempotencyKey: "auth/invite/invite_1",
          tags: {
            correlation_id: "corr-1",
            email_kind: "invite",
            tenant_id: "tenant-a",
          },
        }
      )
    ).resolves.toEqual({ delivered: true, messageId: "msg_invite_1" });

    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0]?.[0]).toMatchObject({
      idempotencyKey: "auth/invite/invite_1",
      tags: [
        { name: "correlation_id", value: "corr-1" },
        { name: "email_kind", value: "invite" },
        { name: "tenant_id", value: "tenant-a" },
      ],
    });
  });

  it("delivers invitation email with idempotency key derived from invitation id", async () => {
    const send = vi.fn().mockResolvedValue({
      data: { id: "msg_invite_2" },
      error: null,
    });
    const client = createMockResendClient(send);

    const env = {
      AFENDA_AUTH_EMAIL_API_KEY: "re_test_key",
      [AFENDA_AUTH_EMAIL_FROM_ENV]: "Afenda ERP <auth@example.com>",
      [BETTER_AUTH_URL_ENV]: "https://erp.example.com",
      BETTER_AUTH_SECRET: "x".repeat(32),
    };

    await expect(
      deliverAuthInvitationEmail(
        {
          email: "user@example.com",
          invitationId: "invite_1",
          token: "invite_token_1",
          tenantId: "tenant-a",
        },
        env,
        { client },
        {
          correlationId: "corr-1",
          tenantId: "tenant-a",
        }
      )
    ).resolves.toEqual({ delivered: true, messageId: "msg_invite_2" });

    expect(send.mock.calls[0]?.[0]).toMatchObject({
      idempotencyKey: "auth/invite/invite_1",
    });
  });
});
