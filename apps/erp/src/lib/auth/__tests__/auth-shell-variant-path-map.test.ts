import { describe, expect, it } from "vitest";

import {
  AUTH_PATHS,
  resolveAuthShellVariantForPath,
} from "../auth-path.registry";

describe("auth shell variant path map", () => {
  it("maps canonical auth paths to expected shell variants", () => {
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.signIn)).toBe(
      "login-page-04"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.signUp)).toBe(
      "register-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.otp)).toBe("otp-page-01");
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.mfa)).toBe("mfa-page-01");
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.mfaRecovery)).toBe(
      "mfa-recovery-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.verifyEmail.root)).toBe(
      "verify-email-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.verifyEmail.sent)).toBe(
      "verify-email-sent-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.verifyEmail.expired)).toBe(
      "verify-email-expired-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.verifyEmail.success)).toBe(
      "verify-email-success-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.forgotPassword.root)).toBe(
      "forgot-password-page-01"
    );
    expect(
      resolveAuthShellVariantForPath(AUTH_PATHS.forgotPassword.success)
    ).toBe("forgot-password-success-page-01");
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.resetPassword.root)).toBe(
      "reset-password-page-01"
    );
    expect(
      resolveAuthShellVariantForPath(AUTH_PATHS.resetPassword.success)
    ).toBe("reset-password-success-page-01");
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.invite.root)).toBe(
      "invite-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.invite.accept)).toBe(
      "invite-accept-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.invite.expired)).toBe(
      "invite-expired-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.invite.invalid)).toBe(
      "invite-invalid-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.invite.consumed)).toBe(
      "invite-consumed-page-01"
    );
    expect(
      resolveAuthShellVariantForPath(AUTH_PATHS.invite.emailMismatch)
    ).toBe("invite-email-mismatch-page-01");
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.passkey.root)).toBe(
      "passkey-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.passkey.error)).toBe(
      "error-passkey-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.sso.root)).toBe(
      "sso-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.sso.error)).toBe(
      "error-sso-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.oauth.error)).toBe(
      "error-oauth-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.sessionExpired)).toBe(
      "error-session-expired-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.accessDenied)).toBe(
      "error-access-denied-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.securityReview)).toBe(
      "security-review-page-01"
    );
    expect(resolveAuthShellVariantForPath(AUTH_PATHS.error)).toBe(
      "error-authentication-page-01"
    );
  });

  it("falls back to sign-in variant for unknown path", () => {
    expect(resolveAuthShellVariantForPath("/unknown-auth-path")).toBe(
      "login-page-04"
    );
  });
});
