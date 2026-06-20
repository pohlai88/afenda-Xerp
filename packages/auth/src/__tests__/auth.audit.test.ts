import { describe, expect, it, vi } from "vitest";
import { buildAuthAuditPayload, persistAuthAuditEvent } from "../auth.audit.js";
import { AUTH_EVENT } from "../auth.contract.js";

const AUTH_CORRELATION_PREFIX_PATTERN = /^auth-/;

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    findPlatformUserIdByAuthUserId: vi.fn(),
    insertAuditEvent: vi.fn(),
  };
});

describe("auth.audit", () => {
  it("builds auth audit payloads with stable module/action fields", () => {
    const payload = buildAuthAuditPayload(
      {
        event: AUTH_EVENT.signInSucceeded,
        result: "success",
        context: {
          authUserId: "auth_user_1",
          sessionId: "sess_1",
          email: "user@example.com",
          correlationId: "corr-test",
        },
      },
      "platform_user_1"
    );

    expect(payload.module).toBe("auth");
    expect(payload.action).toBe(AUTH_EVENT.signInSucceeded);
    expect(payload.correlationId).toBe("corr-test");
    expect(payload.actorType).toBe("user");
    expect(payload.actorUserId).toBe("platform_user_1");
    expect(payload.source).toBe("auth");
    expect(payload.eventVersion).toBe("1.0");
    expect(payload.metadata).toMatchObject({
      actorLinkStatus: "linked",
      authUserId: "auth_user_1",
      email: "user@example.com",
      platformUserId: "platform_user_1",
    });
  });

  it("marks unlinked auth identities explicitly in audit metadata", () => {
    const payload = buildAuthAuditPayload({
      event: AUTH_EVENT.signInSucceeded,
      result: "success",
      context: {
        authUserId: "auth_user_1",
      },
    });

    expect(payload.actorUserId).toBeNull();
    expect(payload.metadata).toMatchObject({
      actorLinkStatus: "unlinked",
      authUserId: "auth_user_1",
      platformUserId: null,
    });
  });

  it("generates correlation ids when context omits one", () => {
    const payload = buildAuthAuditPayload({
      event: AUTH_EVENT.signOut,
      result: "success",
    });

    expect(payload.correlationId).toMatch(AUTH_CORRELATION_PREFIX_PATTERN);
    expect(payload.actorType).toBe("system");
    expect(payload.metadata?.["actorLinkStatus"]).toBeNull();
  });

  it("persists audit events through the writer", async () => {
    const write = vi.fn().mockResolvedValue(undefined);

    await persistAuthAuditEvent(
      {
        event: AUTH_EVENT.signInFailed,
        result: "failure",
      },
      { write }
    );

    expect(write).toHaveBeenCalledOnce();
  });
});
