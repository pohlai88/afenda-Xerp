import { describe, expect, it } from "vitest";

import { readSignInTwoFactorChallenge } from "@/lib/auth/is-sign-in-two-factor-redirect";

describe("readSignInTwoFactorChallenge", () => {
  it("returns null when twoFactorRedirect is absent or false", () => {
    expect(readSignInTwoFactorChallenge(null)).toBeNull();
    expect(readSignInTwoFactorChallenge({})).toBeNull();
    expect(
      readSignInTwoFactorChallenge({ twoFactorRedirect: false })
    ).toBeNull();
  });

  it("returns totp by default when methods are missing", () => {
    expect(readSignInTwoFactorChallenge({ twoFactorRedirect: true })).toEqual({
      methods: ["totp"],
    });
  });

  it("filters unknown methods and falls back to totp", () => {
    expect(
      readSignInTwoFactorChallenge({
        twoFactorRedirect: true,
        twoFactorMethods: ["sms"],
      })
    ).toEqual({ methods: ["totp"] });
  });

  it("preserves supported methods from Better Auth", () => {
    expect(
      readSignInTwoFactorChallenge({
        twoFactorRedirect: true,
        twoFactorMethods: ["totp", "otp"],
      })
    ).toEqual({ methods: ["totp", "otp"] });
  });
});
