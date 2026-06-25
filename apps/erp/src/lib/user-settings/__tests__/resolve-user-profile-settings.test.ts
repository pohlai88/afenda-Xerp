import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getAfendaAuthSessionMock,
  resolveUserSettingsOperatingContextMock,
  selectMock,
  fromMock,
  whereMock,
  limitMock,
} = vi.hoisted(() => ({
  getAfendaAuthSessionMock: vi.fn(),
  resolveUserSettingsOperatingContextMock: vi.fn(),
  selectMock: vi.fn(),
  fromMock: vi.fn(),
  whereMock: vi.fn(),
  limitMock: vi.fn(),
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    getAfendaAuthSession: getAfendaAuthSessionMock,
  };
});

vi.mock("../resolve-user-settings-context.server", () => ({
  resolveUserSettingsOperatingContext: resolveUserSettingsOperatingContextMock,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    getDb: vi.fn(() => ({
      select: selectMock,
    })),
  };
});

import { resolveUserProfileSettings } from "../resolve-user-profile-settings.server";

const linkedContext = {
  kind: "ready" as const,
  actorUserId: "user-001",
  operatingContext: {
    actor: { userId: "user-001" },
    correlationId: "corr-profile",
  },
};

describe("resolveUserProfileSettings", () => {
  beforeEach(() => {
    getAfendaAuthSessionMock.mockReset();
    resolveUserSettingsOperatingContextMock.mockReset();
    selectMock.mockReset();
    fromMock.mockReset();
    whereMock.mockReset();
    limitMock.mockReset();

    selectMock.mockReturnValue({ from: fromMock });
    fromMock.mockReturnValue({ where: whereMock });
    whereMock.mockReturnValue({ limit: limitMock });
  });

  it("returns not_found when user settings context is not ready", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce({
      kind: "redirect",
      href: "/sign-in",
    });

    const result = await resolveUserProfileSettings();

    expect(result).toEqual({ kind: "not_found" });
  });

  it("returns not_found when platform user row is missing", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce(
      linkedContext
    );
    getAfendaAuthSessionMock.mockResolvedValueOnce({
      user: { emailVerified: true },
    });
    limitMock.mockResolvedValueOnce([]);

    const result = await resolveUserProfileSettings();

    expect(result).toEqual({ kind: "not_found" });
  });

  it("returns profile fields from platform user and auth session", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce(
      linkedContext
    );
    getAfendaAuthSessionMock.mockResolvedValueOnce({
      user: { emailVerified: false },
    });
    limitMock.mockResolvedValueOnce([
      {
        displayName: "Alex Example",
        email: "alex@example.com",
      },
    ]);

    const result = await resolveUserProfileSettings();

    expect(result).toEqual({
      kind: "ready",
      profile: {
        displayName: "Alex Example",
        email: "alex@example.com",
        emailVerified: false,
      },
    });
  });
});
