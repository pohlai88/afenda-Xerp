import { beforeEach, describe, expect, it, vi } from "vitest";

const authMocks = vi.hoisted(() => ({
  getAfendaAuthSession: vi.fn(),
  isAfendaAuthPasswordlessTwoFactorEnforcementActive: vi.fn(),
  isAuthUserMfaEnabled: vi.fn(),
}));

const cookieMocks = vi.hoisted(() => ({
  persistMfaChallengeCookie: vi.fn(),
  readMfaChallengeCookie: vi.fn(),
}));

const navigationMocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@afenda/auth", () => authMocks);
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));
vi.mock("next/navigation", () => navigationMocks);
vi.mock("@/lib/auth/auth-mfa-challenge.cookies.server", () => cookieMocks);

describe("gatePasswordlessTwoFactorBeforePostAuth", () => {
  beforeEach(() => {
    authMocks.getAfendaAuthSession.mockReset();
    authMocks.isAfendaAuthPasswordlessTwoFactorEnforcementActive.mockReset();
    authMocks.isAuthUserMfaEnabled.mockReset();
    cookieMocks.persistMfaChallengeCookie.mockReset();
    cookieMocks.readMfaChallengeCookie.mockReset();
    navigationMocks.redirect.mockClear();

    authMocks.isAfendaAuthPasswordlessTwoFactorEnforcementActive.mockReturnValue(
      false
    );
    cookieMocks.readMfaChallengeCookie.mockResolvedValue(null);
  });

  it("no-ops when enforce-all mode is inactive", async () => {
    const { gatePasswordlessTwoFactorBeforePostAuth } = await import(
      "../gate-passwordless-two-factor.server"
    );

    await gatePasswordlessTwoFactorBeforePostAuth("/dashboard");

    expect(authMocks.getAfendaAuthSession).not.toHaveBeenCalled();
  });

  it("redirects OAuth/passkey sessions to MFA step-up when enforce-all is active", async () => {
    authMocks.isAfendaAuthPasswordlessTwoFactorEnforcementActive.mockReturnValue(
      true
    );
    authMocks.getAfendaAuthSession.mockResolvedValue({
      metadata: {},
      session: { id: "sess_1" },
      user: { authUserId: "auth_user_1", email: "user@example.com" },
    });
    authMocks.isAuthUserMfaEnabled.mockResolvedValue(true);

    const { gatePasswordlessTwoFactorBeforePostAuth } = await import(
      "../gate-passwordless-two-factor.server"
    );

    await expect(
      gatePasswordlessTwoFactorBeforePostAuth("/dashboard", (next) =>
        next.length > 0 ? `/v2/mfa?next=${encodeURIComponent(next)}` : "/v2/mfa"
      )
    ).rejects.toThrow("REDIRECT:/v2/mfa?next=%2Fdashboard");

    expect(cookieMocks.persistMfaChallengeCookie).toHaveBeenCalledWith(
      { methods: ["totp", "otp"] },
      "/dashboard"
    );
  });

  it("skips redirect when an MFA challenge cookie already exists", async () => {
    authMocks.isAfendaAuthPasswordlessTwoFactorEnforcementActive.mockReturnValue(
      true
    );
    cookieMocks.readMfaChallengeCookie.mockResolvedValue({
      challenge: { methods: ["totp"] },
      nextPath: "/dashboard",
    });

    const { gatePasswordlessTwoFactorBeforePostAuth } = await import(
      "../gate-passwordless-two-factor.server"
    );

    await gatePasswordlessTwoFactorBeforePostAuth("/dashboard");

    expect(authMocks.getAfendaAuthSession).not.toHaveBeenCalled();
    expect(cookieMocks.persistMfaChallengeCookie).not.toHaveBeenCalled();
  });
});
