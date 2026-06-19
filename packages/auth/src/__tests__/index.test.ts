import { describe, expect, it } from "vitest";
import { getBetterAuthSecret, getBetterAuthUrl } from "../auth.env.js";
import { resetAuthForTests } from "../auth.server.js";
import {
  AUTH_EVENT,
  buildAuthAuditPayload,
  getPackageName,
  normalizeAfendaAuthSession,
  PACKAGE_NAME,
  UnauthenticatedError,
} from "../index.js";

describe("@afenda/auth package", () => {
  it("exports the package name", () => {
    expect(PACKAGE_NAME).toBe("@afenda/auth");
    expect(getPackageName()).toBe("@afenda/auth");
  });

  it("normalizes Better Auth sessions into AfendaAuthSession", () => {
    const createdAt = new Date("2026-06-20T00:00:00.000Z");
    const expiresAt = new Date("2026-06-27T00:00:00.000Z");

    expect(
      normalizeAfendaAuthSession({
        session: {
          id: "sess_1",
          createdAt,
          expiresAt,
          ipAddress: "127.0.0.1",
          userAgent: "vitest",
        },
        user: {
          id: "user_1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: true,
          image: null,
        },
      })
    ).toEqual({
      sessionId: "sess_1",
      user: {
        userId: "user_1",
        email: "user@example.com",
        name: "Test User",
        emailVerified: true,
      },
      metadata: {
        image: null,
        issuedAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        ipAddress: "127.0.0.1",
        userAgent: "vitest",
      },
    });
  });

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
    expect(payload.metadata).toMatchObject({
      authUserId: "user_1",
      email: "user@example.com",
    });
  });

  it("throws UnauthenticatedError for requireSession failures", () => {
    expect(() => {
      throw new UnauthenticatedError();
    }).toThrow(UnauthenticatedError);
  });

  it("validates Better Auth env configuration", () => {
    resetAuthForTests();

    expect(() => getBetterAuthSecret({})).toThrow();
    expect(() => getBetterAuthUrl({})).toThrow();

    const env = {
      BETTER_AUTH_SECRET: "x".repeat(32),
      BETTER_AUTH_URL: "http://localhost:3000",
    };

    expect(getBetterAuthSecret(env)).toHaveLength(32);
    expect(getBetterAuthUrl(env)).toBe("http://localhost:3000");
  });
});
