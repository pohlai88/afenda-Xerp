import { isAPIError } from "better-auth/api";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AUTH_EVENT } from "../auth.contract.js";
import {
  handleAfendaAuthAuditHook,
  handleAfendaAuthInvitationBeforeHook,
  readAuthEmailFromBody,
  readAuthRequestMeta,
} from "../auth.hooks.js";
import {
  registerAuthInvitation,
  resetAuthInvitationStoreForTests,
} from "../auth.invitation.js";

const hookInvitationStore = new Map<
  string,
  {
    consumedAt?: number;
    email: string;
    expiresAt: number;
    invitationId: string;
    platformUserId?: string;
    tenantId?: string;
    token: string;
  }
>();

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  const { randomUUID } = await import("node:crypto");

  return {
    ...actual,
    resetMemberInvitationsForTests: async () => {
      hookInvitationStore.clear();
    },
    registerMemberInvitation: async (input: {
      email: string;
      expiresAt?: Date;
      invitationId?: string;
      platformUserId?: string;
      tenantId?: string;
      token?: string;
    }) => {
      const email = input.email.trim().toLowerCase();
      const token = input.token?.trim() || randomUUID();
      const record = {
        email,
        expiresAt:
          input.expiresAt?.getTime() ?? Date.now() + 7 * 24 * 60 * 60 * 1000,
        invitationId: input.invitationId ?? randomUUID(),
        token,
        ...(input.platformUserId === undefined
          ? {}
          : { platformUserId: input.platformUserId }),
        ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
      };
      hookInvitationStore.set(token, record);
      return record;
    },
    validateMemberInvitation: async (input: {
      email: string;
      token: string;
    }) => {
      const email = input.email.trim().toLowerCase();
      const token = input.token.trim();
      const record = hookInvitationStore.get(token);

      if (!record) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token is invalid."
        );
      }

      if (record.consumedAt !== undefined) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token has already been used."
        );
      }

      if (record.expiresAt < Date.now()) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token has expired."
        );
      }

      if (record.email !== email) {
        throw new actual.MemberInvitationRejectedError(
          "Invitation token does not match the sign-up email."
        );
      }

      return { status: "valid" as const, invitation: record };
    },
    consumeMemberInvitation: async (token: string) => {
      const record = hookInvitationStore.get(token.trim());
      if (!record || record.consumedAt !== undefined) {
        return null;
      }

      const consumed = { ...record, consumedAt: Date.now() };
      hookInvitationStore.set(token.trim(), consumed);
      return consumed;
    },
  };
});

describe("auth.hooks", () => {
  beforeEach(async () => {
    await resetAuthInvitationStoreForTests();
  });
  it("reads request metadata from forwarded headers", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.1, 10.0.0.1",
      "user-agent": "vitest",
    });

    expect(readAuthRequestMeta({ headers })).toEqual({
      ipAddress: "203.0.113.1",
      userAgent: "vitest",
    });
  });

  it("reads email from auth request body", () => {
    expect(
      readAuthEmailFromBody({
        body: { email: "user@example.com", password: "secret" },
      })
    ).toBe("user@example.com");
    expect(
      readAuthEmailFromBody({ body: { password: "secret" } })
    ).toBeUndefined();
  });

  it("records sign-in success and session creation audit events", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/sign-in/email",
        headers: new Headers({ "user-agent": "vitest" }),
        context: {
          returned: { token: "token_1" },
          newSession: {
            session: { id: "sess_1" },
            user: { id: "auth_user_1", email: "user@example.com" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.signInSucceeded,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_1",
        email: "user@example.com",
      }),
    });
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.sessionCreated,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_1",
      }),
    });
  });

  it("records sign-in failure when Better Auth does not create a session", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/sign-in/email",
        body: { email: "user@example.com", password: "wrong" },
        context: {
          returned: { error: "INVALID_CREDENTIALS" },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.signInFailed,
      result: "failure",
      context: expect.objectContaining({
        email: "user@example.com",
      }),
      reason: "Invalid email or password.",
    });
  });

  it("records sign-out and session invalidation audit events", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/sign-out",
        context: {
          session: {
            session: { id: "sess_1" },
            user: { id: "auth_user_1" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledTimes(2);
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.signOut,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_1",
      }),
    });
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.sessionInvalidated,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_1",
      }),
    });
  });

  it("records email verification sent audit event", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/send-verification-email",
        body: { email: "user@example.com" },
        context: {
          returned: { status: true },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.emailVerificationSent,
      result: "success",
      context: expect.objectContaining({
        email: "user@example.com",
      }),
    });
  });

  it("records email verified audit event when user is returned", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/verify-email",
        context: {
          returned: {
            status: true,
            user: { id: "auth_user_1", email: "user@example.com" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.emailVerified,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        email: "user@example.com",
      }),
    });
  });

  it("skips email verified audit when verify-email returns no user", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/verify-email",
        context: {
          returned: { status: true, user: null },
        },
      },
      persist
    );

    expect(persist).not.toHaveBeenCalled();
  });

  it("records password reset requested audit event", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/request-password-reset",
        body: { email: "user@example.com" },
        context: {
          returned: {
            status: true,
            message:
              "If this email exists in our system, check your email for the reset link",
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.passwordResetRequested,
      result: "success",
      context: expect.objectContaining({
        email: "user@example.com",
      }),
    });
  });

  it("records password reset completed audit event", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/reset-password",
        body: { newPassword: "new-secret-password", token: "reset_token" },
        context: {
          returned: { status: true },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.passwordResetCompleted,
      result: "success",
      context: expect.objectContaining({
        ipAddress: null,
        userAgent: null,
      }),
    });
  });

  it("records MFA disabled audit event", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/two-factor/disable",
        context: {
          returned: { status: true },
          session: {
            session: { id: "sess_1" },
            user: { id: "auth_user_1" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.mfaDisabled,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_1",
      }),
    });
  });

  it("records MFA enrolled audit event after TOTP verification", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/two-factor/verify-totp",
        context: {
          returned: {
            token: "token_1",
            user: { id: "auth_user_1", email: "user@example.com" },
          },
          session: {
            session: { id: "sess_1" },
            user: { id: "auth_user_1" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.mfaEnrolled,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        email: "user@example.com",
        sessionId: "sess_1",
      }),
    });
  });

  it("records MFA verified audit event during sign-in", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/two-factor/verify-totp",
        context: {
          returned: {
            token: "token_1",
            user: { id: "auth_user_1", email: "user@example.com" },
          },
          newSession: {
            session: { id: "sess_2" },
            user: { id: "auth_user_1", email: "user@example.com" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.mfaVerified,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_2",
      }),
    });
  });

  it("records MFA verified audit event for backup code sign-in", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/two-factor/verify-backup-code",
        context: {
          returned: {
            token: "token_1",
            user: { id: "auth_user_1", email: "user@example.com" },
          },
          newSession: {
            session: { id: "sess_3" },
            user: { id: "auth_user_1", email: "user@example.com" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.mfaVerified,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_3",
      }),
    });
  });

  it("records device session revoked audit event", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/multi-session/revoke",
        body: { sessionToken: "device_token_1" },
        context: {
          returned: { status: true },
          session: {
            session: { id: "sess_1" },
            user: { id: "auth_user_1" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledOnce();
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.sessionDeviceRevoked,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_1",
        reason: "revokedSessionToken:device_token_1",
      }),
    });
  });

  it("records session revoked all audit event on sign-out with multi-session cookies", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/sign-out",
        headers: new Headers({
          cookie: "better-auth.session_token_multi-abc=signed; other=1",
        }),
        context: {
          session: {
            session: { id: "sess_1" },
            user: { id: "auth_user_1" },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledTimes(3);
    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.sessionRevokedAll,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        sessionId: "sess_1",
      }),
    });
  });

  it("rejects sign-up without invitation token and audits auth.invitation.rejected", async () => {
    await resetAuthInvitationStoreForTests();
    const persist = vi.fn().mockResolvedValue(undefined);

    await expect(
      handleAfendaAuthInvitationBeforeHook(
        {
          path: "/sign-up/email",
          body: {
            email: "user@example.com",
            password: "secret",
            name: "User",
          },
        },
        persist
      )
    ).rejects.toSatisfy((error: unknown) => isAPIError(error));

    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.invitationRejected,
      result: "denied",
      reason: "Invitation token is required for sign-up.",
      context: expect.objectContaining({
        email: "user@example.com",
      }),
    });
  });

  it("allows sign-up when invitation token matches email", async () => {
    await resetAuthInvitationStoreForTests();
    await registerAuthInvitation({
      email: "user@example.com",
      token: "invite_ok",
    });
    const persist = vi.fn().mockResolvedValue(undefined);

    await expect(
      handleAfendaAuthInvitationBeforeHook(
        {
          path: "/sign-up/email",
          body: {
            email: "user@example.com",
            invitationToken: "invite_ok",
            name: "User",
            password: "secret",
          },
        },
        persist
      )
    ).resolves.toBeUndefined();

    expect(persist).not.toHaveBeenCalled();
  });

  it("records invitation accepted audit on successful sign-up", async () => {
    await resetAuthInvitationStoreForTests();
    const invitation = await registerAuthInvitation({
      email: "user@example.com",
      token: "invite_ok",
    });
    const persist = vi.fn().mockResolvedValue(undefined);

    await handleAfendaAuthAuditHook(
      {
        path: "/sign-up/email",
        body: {
          email: "user@example.com",
          invitationToken: "invite_ok",
        },
        context: {
          returned: {
            user: {
              id: "auth_user_1",
              email: "user@example.com",
            },
          },
        },
      },
      persist
    );

    expect(persist).toHaveBeenCalledWith({
      event: AUTH_EVENT.invitationAccepted,
      result: "success",
      context: expect.objectContaining({
        authUserId: "auth_user_1",
        email: "user@example.com",
        invitationId: invitation.invitationId,
      }),
    });
  });
});
