import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getUserPreferencesByUserIdMock,
  resolveUserSettingsOperatingContextMock,
} = vi.hoisted(() => ({
  getUserPreferencesByUserIdMock: vi.fn(),
  resolveUserSettingsOperatingContextMock: vi.fn(),
}));

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();
  return {
    ...actual,
    getUserPreferencesByUserId: getUserPreferencesByUserIdMock,
  };
});

vi.mock("../resolve-user-settings-context.server", () => ({
  resolveUserSettingsOperatingContext: resolveUserSettingsOperatingContextMock,
}));

import { resolveUserPreferences } from "../resolve-user-preferences.server";

const linkedContext = {
  kind: "ready" as const,
  actorUserId: "user-001",
  operatingContext: {
    actor: { userId: "user-001" },
    correlationId: "corr-prefs",
  },
};

describe("resolveUserPreferences", () => {
  beforeEach(() => {
    getUserPreferencesByUserIdMock.mockReset();
    resolveUserSettingsOperatingContextMock.mockReset();
  });

  it("returns not_found when user settings context is not ready", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce({
      kind: "redirect",
      href: "/sign-in",
    });

    const result = await resolveUserPreferences();

    expect(result).toEqual({ kind: "not_found" });
    expect(getUserPreferencesByUserIdMock).not.toHaveBeenCalled();
  });

  it("returns defaults when no preferences row exists", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce(
      linkedContext
    );
    getUserPreferencesByUserIdMock.mockResolvedValueOnce(null);

    const result = await resolveUserPreferences();

    expect(getUserPreferencesByUserIdMock).toHaveBeenCalledWith("user-001");
    expect(result).toEqual({
      kind: "ready",
      preferences: {
        display: {
          density: "comfortable",
          locale: "en",
          theme: "system",
          timezone: "UTC",
        },
        notifications: null,
        persisted: false,
      },
    });
  });

  it("returns persisted preferences for the linked actor", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce(
      linkedContext
    );
    getUserPreferencesByUserIdMock.mockResolvedValueOnce({
      id: "pref-001",
      userId: "user-001",
      display: {
        density: "compact",
        locale: "de",
        theme: "dark",
        timezone: "Europe/Berlin",
      },
      notifications: null,
    });

    const result = await resolveUserPreferences();

    expect(result).toEqual({
      kind: "ready",
      preferences: {
        display: {
          density: "compact",
          locale: "de",
          theme: "dark",
          timezone: "Europe/Berlin",
        },
        notifications: null,
        persisted: true,
      },
    });
  });
});
