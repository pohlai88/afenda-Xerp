import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  UnauthenticatedError,
  UnlinkedPlatformUserError,
} from "../auth.errors.js";
import { readAuthConfigFingerprint } from "../auth.runtime.js";
import {
  getAfendaAuthSession,
  getAuth,
  requireAfendaAuthSession,
  resetAuthForTests,
} from "../auth.server.js";
import { normalizeAfendaAuthSession } from "../auth.session.js";

const mockGetSession = vi.fn();
const mockResolvePlatformActorUserId = vi.fn();
const mockResolveEnterpriseUserIdFromPlatformUserId = vi.fn();
const mockAssertTenantMfaPolicySatisfied = vi.fn().mockResolvedValue(undefined);
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

vi.mock("../auth.actor-resolution.js", () => ({
  clearPlatformUserIdCacheForTests: vi.fn(),
  resolvePlatformActorUserId: (...args: unknown[]) =>
    mockResolvePlatformActorUserId(...args),
  resolveEnterpriseUserIdFromPlatformUserId: (...args: unknown[]) =>
    mockResolveEnterpriseUserIdFromPlatformUserId(...args),
}));

vi.mock("../auth.mfa-policy.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../auth.mfa-policy.js")>();
  return {
    ...actual,
    assertTenantMfaPolicySatisfied: (...args: unknown[]) =>
      mockAssertTenantMfaPolicySatisfied(...args),
  };
});

describe("auth.server session helpers", () => {
  beforeEach(() => {
    mockAssertTenantMfaPolicySatisfied.mockResolvedValue(undefined);
    mockResolveEnterpriseUserIdFromPlatformUserId.mockResolvedValue(null);
  });

  it("returns null when Better Auth has no session", async () => {
    resetAuthForTests();
    mockGetSession.mockResolvedValueOnce(null);

    await expect(getAfendaAuthSession(new Headers())).resolves.toBeNull();
  });

  it("passes through activeWorkspaceId from Better Auth session", async () => {
    resetAuthForTests();
    const createdAt = new Date("2026-06-20T00:00:00.000Z");
    const expiresAt = new Date("2026-06-27T00:00:00.000Z");

    mockGetSession.mockResolvedValueOnce({
      session: {
        id: "sess_workspace",
        createdAt,
        expiresAt,
        activeWorkspaceId: "workspace_persisted",
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
    });
    mockResolvePlatformActorUserId.mockResolvedValueOnce("platform_user_1");

    const session = await getAfendaAuthSession(new Headers());

    expect(session?.metadata.activeWorkspaceId).toBe("workspace_persisted");
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
        id: "auth_user_1",
        email: "user@example.com",
        name: "Test User",
        emailVerified: true,
        image: null,
      },
    });
    mockResolvePlatformActorUserId.mockResolvedValueOnce("platform_user_1");

    await expect(getAfendaAuthSession(new Headers())).resolves.toEqual(
      normalizeAfendaAuthSession(
        {
          session: {
            id: "sess_1",
            createdAt,
            expiresAt,
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
        "platform_user_1",
        null
      )
    );
    expect(mockResolvePlatformActorUserId).toHaveBeenCalledWith({
      authUserId: "auth_user_1",
    });
  });

  it("throws UnlinkedPlatformUserError when platform user is not linked", async () => {
    resetAuthForTests();
    mockGetSession.mockResolvedValueOnce({
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
    });
    mockResolvePlatformActorUserId.mockResolvedValueOnce(null);

    await expect(requireAfendaAuthSession(new Headers())).rejects.toThrow(
      UnlinkedPlatformUserError
    );
  });

  it("throws UnlinkedPlatformUserError when platform user id is whitespace only", async () => {
    resetAuthForTests();
    mockGetSession.mockResolvedValueOnce({
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
    });
    mockResolvePlatformActorUserId.mockResolvedValueOnce("   ");

    await expect(requireAfendaAuthSession(new Headers())).rejects.toThrow(
      UnlinkedPlatformUserError
    );
  });

  it("throws UnauthenticatedError when requireAfendaAuthSession has no session", async () => {
    resetAuthForTests();
    mockGetSession.mockResolvedValueOnce(null);

    await expect(requireAfendaAuthSession(new Headers())).rejects.toThrow(
      UnauthenticatedError
    );
  });

  it("asserts MFA policy with company id parsed from active workspace", async () => {
    resetAuthForTests();
    mockGetSession.mockResolvedValueOnce({
      session: {
        id: "sess_1",
        createdAt: new Date("2026-06-20T00:00:00.000Z"),
        expiresAt: new Date("2026-06-27T00:00:00.000Z"),
        activeWorkspaceId: "tenant_1:company_1:workspace_1",
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
    });
    mockResolvePlatformActorUserId.mockResolvedValueOnce("platform_user_1");

    await requireAfendaAuthSession(new Headers(), process.env, {
      tenantId: "tenant_1",
    });

    expect(mockAssertTenantMfaPolicySatisfied).toHaveBeenCalledWith({
      authUserId: "auth_user_1",
      companyId: "company_1",
      tenantId: "tenant_1",
    });
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
