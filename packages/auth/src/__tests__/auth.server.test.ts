import { describe, expect, it, vi } from "vitest";
import { UnauthenticatedError } from "../auth.errors.js";
import {
  getAfendaAuthSession,
  requireAfendaAuthSession,
  resetAuthForTests,
} from "../auth.server.js";
import { normalizeAfendaAuthSession } from "../auth.session.js";

const mockGetSession = vi.fn();

vi.mock("../auth.config.js", () => ({
  createAuthConfig: () => ({
    api: {
      getSession: mockGetSession,
    },
  }),
}));

describe("auth.server session helpers", () => {
  it("returns null when Better Auth has no session", async () => {
    resetAuthForTests();
    mockGetSession.mockResolvedValueOnce(null);

    await expect(getAfendaAuthSession(new Headers())).resolves.toBeNull();
  });

  it("returns normalized AfendaAuthSession when Better Auth has a session", async () => {
    resetAuthForTests();
    const createdAt = new Date("2026-06-20T00:00:00.000Z");
    const expiresAt = new Date("2026-06-27T00:00:00.000Z");

    mockGetSession.mockResolvedValueOnce({
      session: {
        id: "sess_1",
        createdAt,
        expiresAt,
        ipAddress: null,
        userAgent: null,
      },
      user: {
        id: "user_1",
        email: "user@example.com",
        name: "Test User",
        emailVerified: true,
        image: null,
      },
    });

    await expect(getAfendaAuthSession(new Headers())).resolves.toEqual(
      normalizeAfendaAuthSession({
        session: {
          id: "sess_1",
          createdAt,
          expiresAt,
          ipAddress: null,
          userAgent: null,
        },
        user: {
          id: "user_1",
          email: "user@example.com",
          name: "Test User",
          emailVerified: true,
          image: null,
        },
      })
    );
  });

  it("throws UnauthenticatedError when requireAfendaAuthSession has no session", async () => {
    resetAuthForTests();
    mockGetSession.mockResolvedValueOnce(null);

    await expect(requireAfendaAuthSession(new Headers())).rejects.toThrow(
      UnauthenticatedError
    );
  });
});
