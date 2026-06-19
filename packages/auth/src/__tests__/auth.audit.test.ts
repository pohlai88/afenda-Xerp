import { describe, expect, it, vi } from "vitest";
import { buildAuthAuditPayload, recordAuthAuditEvent } from "../auth.audit.js";
import { AUTH_EVENT } from "../auth.contract.js";

const AUTH_CORRELATION_PREFIX_PATTERN = /^auth-/;

describe("auth.audit", () => {
  it("builds auth audit payloads with stable module/action fields", () => {
    const payload = buildAuthAuditPayload({
      event: AUTH_EVENT.signInSucceeded,
      result: "success",
      context: {
        authUserId: "user_1",
        sessionId: "sess_1",
        email: "user@example.com",
        correlationId: "corr-test",
      },
    });

    expect(payload.module).toBe("auth");
    expect(payload.action).toBe(AUTH_EVENT.signInSucceeded);
    expect(payload.correlationId).toBe("corr-test");
    expect(payload.actorType).toBe("user");
    expect(payload.source).toBe("auth");
    expect(payload.eventVersion).toBe("1.0");
    expect(payload.metadata).toMatchObject({
      authUserId: "user_1",
      email: "user@example.com",
    });
  });

  it("generates correlation ids when context omits one", () => {
    const payload = buildAuthAuditPayload({
      event: AUTH_EVENT.signOut,
      result: "success",
    });

    expect(payload.correlationId).toMatch(AUTH_CORRELATION_PREFIX_PATTERN);
    expect(payload.actorType).toBe("system");
  });

  it("records audit events without awaiting the writer", () => {
    const write = vi.fn().mockResolvedValue(undefined);

    recordAuthAuditEvent(
      {
        event: AUTH_EVENT.signInFailed,
        result: "failure",
      },
      { write }
    );

    expect(write).toHaveBeenCalledOnce();
  });
});
