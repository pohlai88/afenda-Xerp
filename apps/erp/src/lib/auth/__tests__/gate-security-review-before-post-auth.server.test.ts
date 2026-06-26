import { beforeEach, describe, expect, it, vi } from "vitest";

const cookieMocks = vi.hoisted(() => ({
  hasSecurityReviewAckCookie: vi.fn(),
  readPostAuthSignInMethodCookie: vi.fn(),
}));

const navigationMocks = vi.hoisted(() => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));

vi.mock("@/lib/auth/auth-security-review.cookies.server", () => cookieMocks);
vi.mock("next/navigation", () => navigationMocks);

describe("gateSecurityReviewBeforePostAuth", () => {
  beforeEach(() => {
    cookieMocks.hasSecurityReviewAckCookie.mockReset();
    cookieMocks.readPostAuthSignInMethodCookie.mockReset();
    navigationMocks.redirect.mockClear();
    vi.unstubAllEnvs();
  });

  it("redirects passwordless sign-in to security review when enabled", async () => {
    vi.stubEnv("AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS", "true");
    cookieMocks.hasSecurityReviewAckCookie.mockResolvedValue(false);
    cookieMocks.readPostAuthSignInMethodCookie.mockResolvedValue("google");

    const { gateSecurityReviewBeforePostAuth } = await import(
      "../gate-security-review-before-post-auth.server"
    );

    await expect(
      gateSecurityReviewBeforePostAuth("/dashboard")
    ).rejects.toThrow("REDIRECT:/v2/security/review?next=%2Fdashboard");
  });

  it("skips redirect after security review is acknowledged", async () => {
    vi.stubEnv("AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS", "true");
    cookieMocks.hasSecurityReviewAckCookie.mockResolvedValue(true);

    const { gateSecurityReviewBeforePostAuth } = await import(
      "../gate-security-review-before-post-auth.server"
    );

    await gateSecurityReviewBeforePostAuth("/dashboard");

    expect(cookieMocks.readPostAuthSignInMethodCookie).not.toHaveBeenCalled();
  });
});
