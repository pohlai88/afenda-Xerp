import { describe, expect, it } from "vitest";

import {
  AFENDA_AUTH_CREDENTIAL_TWO_FACTOR_ENFORCEMENT,
  AFENDA_AUTH_PASSKEY_SIGN_IN_PATH,
  isAfendaAuthPasswordlessSignInPath,
  isAfendaAuthPasswordlessTwoFactorEnforcementActive,
  resolveAfendaAuthPasswordlessTwoFactorMode,
} from "../auth.passwordless-two-factor-policy.js";

describe("auth.passwordless-two-factor-policy", () => {
  it("defaults passwordless 2FA mode to credential-only", () => {
    expect(resolveAfendaAuthPasswordlessTwoFactorMode({})).toBe(
      "credential-only"
    );
    expect(isAfendaAuthPasswordlessTwoFactorEnforcementActive({})).toBe(false);
  });

  it("recognizes enforce-all when explicitly configured", () => {
    expect(
      resolveAfendaAuthPasswordlessTwoFactorMode({
        AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR: "enforce-all",
      })
    ).toBe("enforce-all");
    expect(
      isAfendaAuthPasswordlessTwoFactorEnforcementActive({
        AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR: "enforce-all",
      })
    ).toBe(true);
  });

  it("classifies OAuth, SSO, and passkey completion paths", () => {
    expect(isAfendaAuthPasswordlessSignInPath("/callback/google")).toBe(true);
    expect(isAfendaAuthPasswordlessSignInPath("/sso/callback/okta")).toBe(true);
    expect(
      isAfendaAuthPasswordlessSignInPath(AFENDA_AUTH_PASSKEY_SIGN_IN_PATH)
    ).toBe(true);
    expect(isAfendaAuthPasswordlessSignInPath("/sign-in/email")).toBe(false);
  });

  it("documents Better Auth credential-only enforcement constant", () => {
    expect(AFENDA_AUTH_CREDENTIAL_TWO_FACTOR_ENFORCEMENT).toBe(
      "better-auth-credential-endpoints-only"
    );
  });
});
