import { describe, expect, it } from "vitest";

import {
  isUnauthenticatedError,
  normalizeAfendaAuthSession,
  toAfendaAuthIdentity,
  UnauthenticatedError,
} from "../auth.types.js";

const sampleSession = normalizeAfendaAuthSession({
  session: {
    id: "sess_1",
    createdAt: new Date("2026-06-20T00:00:00.000Z"),
    expiresAt: new Date("2026-06-27T00:00:00.000Z"),
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
});

describe("Afenda auth contracts", () => {
  it("round-trips AfendaAuthSession through JSON", () => {
    expect(JSON.parse(JSON.stringify(sampleSession))).toEqual(sampleSession);
  });

  it("maps session to UI-safe AfendaAuthIdentity without session fields", () => {
    expect(toAfendaAuthIdentity(sampleSession)).toEqual({
      userId: "user_1",
      displayName: "Test User",
      email: "user@example.com",
    });
    expect(toAfendaAuthIdentity(sampleSession)).not.toHaveProperty("sessionId");
  });

  it("narrows UnauthenticatedError with isUnauthenticatedError", () => {
    expect(isUnauthenticatedError(new UnauthenticatedError())).toBe(true);
    expect(isUnauthenticatedError(new Error("other"))).toBe(false);
  });
});
