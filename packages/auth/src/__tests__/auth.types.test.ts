import { describe, expect, it } from "vitest";

import {
  isUnauthenticatedError,
  isUnlinkedPlatformUserError,
  UnauthenticatedError,
  UnlinkedPlatformUserError,
} from "../auth.errors.js";
import {
  normalizeAfendaAuthSession,
  toAfendaAuthIdentity,
} from "../auth.session.js";
import { AUTH_TEST_PLATFORM_USER_ID } from "./auth-id-test-fixtures.js";

const sampleSession = normalizeAfendaAuthSession(
  {
    session: {
      id: "sess_1",
      createdAt: new Date("2026-06-20T00:00:00.000Z"),
      expiresAt: new Date("2026-06-27T00:00:00.000Z"),
      ipAddress: "127.0.0.1",
      userAgent: "vitest",
    },
    user: {
      id: "auth_user_1",
      email: "user@example.com",
      name: "Test User",
      emailVerified: true,
      image: null,
    },
  },
  AUTH_TEST_PLATFORM_USER_ID
);

describe("Afenda auth contracts", () => {
  it("round-trips AfendaAuthSession through JSON", () => {
    expect(JSON.parse(JSON.stringify(sampleSession))).toEqual(sampleSession);
    expect(sampleSession.metadata.activeWorkspaceId).toBeNull();
  });

  it("maps session to UI-safe AfendaAuthIdentity without session fields", () => {
    expect(toAfendaAuthIdentity(sampleSession)).toEqual({
      userId: AUTH_TEST_PLATFORM_USER_ID,
      displayName: "Test User",
      email: "user@example.com",
    });
    expect(toAfendaAuthIdentity(sampleSession)).not.toHaveProperty("sessionId");
  });

  it("narrows UnauthenticatedError with isUnauthenticatedError", () => {
    expect(isUnauthenticatedError(new UnauthenticatedError())).toBe(true);
    expect(isUnauthenticatedError(new Error("other"))).toBe(false);
  });

  it("throws UnlinkedPlatformUserError for unlinked sessions", () => {
    const unlinkedSession = normalizeAfendaAuthSession(
      {
        session: {
          id: "sess_1",
          createdAt: new Date("2026-06-20T00:00:00.000Z"),
          expiresAt: new Date("2026-06-27T00:00:00.000Z"),
          ipAddress: null,
          userAgent: null,
        },
        user: {
          id: "auth_user_1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: true,
          image: null,
        },
      },
      null
    );

    expect(() => toAfendaAuthIdentity(unlinkedSession)).toThrow(
      UnlinkedPlatformUserError
    );
    expect(isUnlinkedPlatformUserError(new UnlinkedPlatformUserError())).toBe(
      true
    );
  });
});
