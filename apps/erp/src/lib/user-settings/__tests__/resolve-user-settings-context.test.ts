import { unbrand } from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAfendaAuthSessionMock, resolveOperatingContextFromHeadersMock } =
  vi.hoisted(() => ({
    getAfendaAuthSessionMock: vi.fn(),
    resolveOperatingContextFromHeadersMock: vi.fn(),
  }));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    getAfendaAuthSession: getAfendaAuthSessionMock,
  };
});

vi.mock("@/lib/context/resolve-operating-context-from-headers.server", () => ({
  resolveOperatingContextFromHeaders: resolveOperatingContextFromHeadersMock,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

import {
  API_TEST_ACTOR_ID,
  API_TEST_CORRELATION_ID,
} from "@/lib/api/__tests__/api-id-test-fixtures";
import { createModuleRouteOperatingContext } from "@/lib/modules/__tests__/module-route-test-fixtures";
import { resolveUserSettingsOperatingContext } from "../resolve-user-settings-context.server";

const actorUserId = unbrand(API_TEST_ACTOR_ID);

const linkedSession = {
  sessionId: "sess-user-settings",
  user: {
    authUserId: "auth_user_01ARZ3NDEKTSV4RRFFQ69G5FAV",
    userId: actorUserId,
    email: "user@example.com",
    name: "Test User",
    emailVerified: true,
    linkStatus: "linked" as const,
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

const operatingContext = createModuleRouteOperatingContext({
  correlationId: unbrand(API_TEST_CORRELATION_ID),
});

describe("resolveUserSettingsOperatingContext", () => {
  beforeEach(() => {
    getAfendaAuthSessionMock.mockReset();
    resolveOperatingContextFromHeadersMock.mockReset();
  });

  it("redirects unauthenticated users to sign-in", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce(null);

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({
      kind: "redirect",
      href: "/sign-in",
    });
  });

  it("redirects unlinked sessions to sign-in error", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce({
      ...linkedSession,
      user: { ...linkedSession.user, linkStatus: "unlinked" as const },
    });

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({
      kind: "redirect",
      href: "/sign-in?error=unlinked",
    });
  });

  it("returns forbidden when operating context cannot be verified", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce(linkedSession);
    resolveOperatingContextFromHeadersMock.mockResolvedValueOnce({
      ok: false,
      error: { code: "MEMBERSHIP_DENIED", userMessage: "Denied" },
    });

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({ kind: "forbidden" });
  });

  it("returns actor and operating context for linked sessions", async () => {
    getAfendaAuthSessionMock.mockResolvedValueOnce(linkedSession);
    resolveOperatingContextFromHeadersMock.mockResolvedValueOnce({
      ok: true,
      value: operatingContext,
    });

    const result = await resolveUserSettingsOperatingContext();

    expect(result).toEqual({
      kind: "ready",
      actorUserId,
      operatingContext,
    });
    expect(resolveOperatingContextFromHeadersMock).toHaveBeenCalledWith({
      actorUserId,
      activeWorkspaceId: null,
    });
  });
});
