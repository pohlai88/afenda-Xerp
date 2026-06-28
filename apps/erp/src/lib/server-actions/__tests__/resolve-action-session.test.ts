import type { AfendaAuthSession } from "@afenda/auth";
import { AppErrors } from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockHeaders = vi.fn();
const mockGetAfendaAuthSession = vi.fn();

vi.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const original = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...original,
    getAfendaAuthSession: (...args: unknown[]) =>
      mockGetAfendaAuthSession(...args),
  };
});

import { resolveActionSession } from "../resolve-action-session";

function createSession(
  overrides: Partial<AfendaAuthSession["user"]> = {}
): AfendaAuthSession {
  return {
    sessionId: "sess_1",
    user: {
      authUserId: "auth_user_1",
      email: "user@example.com",
      enterpriseUserId: null,
      name: "Test User",
      emailVerified: true,
      linkStatus: "linked",
      userId: "platform_user_1",
      ...overrides,
    },
    metadata: {
      image: null,
      issuedAt: "2026-06-20T00:00:00.000Z",
      expiresAt: "2026-06-27T00:00:00.000Z",
      ipAddress: null,
      userAgent: null,
      activeWorkspaceId: null,
    },
  };
}

describe("resolveActionSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaders.mockResolvedValue(new Headers());
  });

  it("returns unauthorized when no session exists", async () => {
    mockGetAfendaAuthSession.mockResolvedValueOnce(null);

    const result = await resolveActionSession();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual(AppErrors.unauthorized());
    }
  });

  it("returns forbidden when session is unlinked", async () => {
    mockGetAfendaAuthSession.mockResolvedValueOnce(
      createSession({ linkStatus: "unlinked", userId: null })
    );

    const result = await resolveActionSession();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual(AppErrors.forbidden());
    }
  });

  it("returns forbidden when linkStatus is linked but userId is empty", async () => {
    mockGetAfendaAuthSession.mockResolvedValueOnce(
      createSession({ linkStatus: "linked", userId: "  " })
    );

    const result = await resolveActionSession();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toEqual(AppErrors.forbidden());
    }
  });

  it("returns linked session when platform user is resolved", async () => {
    const session = createSession();
    mockGetAfendaAuthSession.mockResolvedValueOnce(session);

    const result = await resolveActionSession();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.session).toEqual(session);
    }
  });
});
