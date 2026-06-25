import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getAfendaAuthSessionMock,
  isAuthUserMfaEnabledMock,
  resolveUserSettingsOperatingContextMock,
} = vi.hoisted(() => ({
  getAfendaAuthSessionMock: vi.fn(),
  isAuthUserMfaEnabledMock: vi.fn(),
  resolveUserSettingsOperatingContextMock: vi.fn(),
}));

vi.mock("@afenda/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/auth")>();
  return {
    ...actual,
    getAfendaAuthSession: getAfendaAuthSessionMock,
    isAuthUserMfaEnabled: isAuthUserMfaEnabledMock,
  };
});

vi.mock("../resolve-user-settings-context.server", () => ({
  resolveUserSettingsOperatingContext: resolveUserSettingsOperatingContextMock,
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

import { resolveUserSecuritySettings } from "../resolve-user-security-settings.server";

const linkedContext = {
  kind: "ready" as const,
  actorUserId: "user-001",
  operatingContext: {
    actor: { userId: "user-001" },
    correlationId: "corr-security",
  },
};

describe("resolveUserSecuritySettings", () => {
  beforeEach(() => {
    getAfendaAuthSessionMock.mockReset();
    isAuthUserMfaEnabledMock.mockReset();
    resolveUserSettingsOperatingContextMock.mockReset();
  });

  it("returns not_found when user settings context is not ready", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce({
      kind: "forbidden",
    });

    const result = await resolveUserSecuritySettings();

    expect(result).toEqual({ kind: "not_found" });
  });

  it("returns not_found when auth session is missing", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce(
      linkedContext
    );
    getAfendaAuthSessionMock.mockResolvedValueOnce(null);

    const result = await resolveUserSecuritySettings();

    expect(result).toEqual({ kind: "not_found" });
  });

  it("returns personal MFA state without tenant policy fields", async () => {
    resolveUserSettingsOperatingContextMock.mockResolvedValueOnce(
      linkedContext
    );
    getAfendaAuthSessionMock.mockResolvedValueOnce({
      user: { authUserId: "auth-001" },
    });
    isAuthUserMfaEnabledMock.mockResolvedValueOnce(true);

    const result = await resolveUserSecuritySettings();

    expect(result).toEqual({
      kind: "ready",
      settings: {
        userMfaEnabled: true,
      },
    });
    expect(isAuthUserMfaEnabledMock).toHaveBeenCalledWith("auth-001");
  });
});
