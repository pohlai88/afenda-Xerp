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
vi.mock("@/lib/env/env-reader-source", () => ({
  readRuntimeEnvSource: vi.fn(() => ({
    AFENDA_AUTH_SECURITY_REVIEW_ON_PASSWORDLESS: "true",
  })),
}));

import { gateSecurityReviewBeforePostAuth } from "../gate-security-review-before-post-auth.server";

describe("gateSecurityReviewBeforePostAuth", () => {
  beforeEach(() => {
    cookieMocks.hasSecurityReviewAckCookie.mockReset();
    cookieMocks.readPostAuthSignInMethodCookie.mockReset();
    navigationMocks.redirect.mockClear();
  });

  it("redirects passwordless sign-in to security review when enabled", async () => {
    cookieMocks.hasSecurityReviewAckCookie.mockResolvedValue(false);
    cookieMocks.readPostAuthSignInMethodCookie.mockResolvedValue("google");

    await expect(
      gateSecurityReviewBeforePostAuth("/dashboard")
    ).rejects.toThrow("REDIRECT:/security/review?next=%2Fdashboard");
  });

  it("skips redirect after security review is acknowledged", async () => {
    cookieMocks.hasSecurityReviewAckCookie.mockResolvedValue(true);

    await gateSecurityReviewBeforePostAuth("/dashboard");

    expect(cookieMocks.readPostAuthSignInMethodCookie).not.toHaveBeenCalled();
  });
});
