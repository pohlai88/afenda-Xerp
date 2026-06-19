import { describe, expect, it, vi } from "vitest";
import { UnauthenticatedError } from "../auth.errors.js";
import { readAuthConfigFingerprint } from "../auth.runtime.js";
import {
  getAfendaAuthSession,
  getAuth,
  requireAfendaAuthSession,
  resetAuthForTests,
} from "../auth.server.js";
import { normalizeAfendaAuthSession } from "../auth.session.js";

const mockGetSession = vi.fn();
const authConfigState = vi.hoisted(() => ({
  calls: [] as Array<{ env?: NodeJS.ProcessEnv } | undefined>,
}));

vi.mock("../auth.config.js", () => ({
  createAuthConfig: (options?: { env?: NodeJS.ProcessEnv }) => {
    authConfigState.calls.push(options);
    return {
      api: {
        getSession: mockGetSession,
      },
    };
  },
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

  it("recreates auth config when env fingerprint changes", () => {
    resetAuthForTests();
    authConfigState.calls.length = 0;

    const localEnv = {
      BETTER_AUTH_SECRET: "a".repeat(32),
      BETTER_AUTH_URL: "http://localhost:3000",
    };
    const stagingEnv = {
      BETTER_AUTH_SECRET: "b".repeat(32),
      BETTER_AUTH_URL: "http://localhost:3001",
    };

    getAuth(localEnv);
    getAuth(localEnv);
    getAuth(stagingEnv);

    expect(authConfigState.calls).toHaveLength(2);
    expect(authConfigState.calls[0]).toEqual({ env: localEnv });
    expect(authConfigState.calls[1]).toEqual({ env: stagingEnv });
  });

  it("tracks invalid env fingerprints separately", () => {
    expect(readAuthConfigFingerprint({})).toBe("invalid:|");
    expect(
      readAuthConfigFingerprint({
        BETTER_AUTH_SECRET: "short",
        BETTER_AUTH_URL: "http://localhost:3000",
      })
    ).toBe("invalid:http://localhost:3000|short");
  });
});
