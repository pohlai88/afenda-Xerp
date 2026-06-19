import { describe, expect, it, vi } from "vitest";
import { AUTH_EVENT } from "../auth.contract.js";
import {
  handleAfendaAuthAuditHook,
  readAuthRequestMeta,
  readAuthSignInEmail,
} from "../auth.hooks.js";

describe("auth.hooks", () => {
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

  it("reads sign-in email from request body", () => {
    expect(
      readAuthSignInEmail({
        body: { email: "user@example.com", password: "secret" },
      })
    ).toBe("user@example.com");
    expect(
      readAuthSignInEmail({ body: { password: "secret" } })
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
});
