import { describe, expect, it } from "vitest";
import {
  AUTH_ACCESS_DENIED_PATH,
  AUTH_ERROR_PATH,
  AUTH_FORGOT_PASSWORD_PATH,
  AUTH_FORGOT_PASSWORD_SUCCESS_PATH,
  AUTH_INVITE_ACCEPT_PATH,
  AUTH_INVITE_CONSUMED_PATH,
  AUTH_INVITE_EMAIL_MISMATCH_PATH,
  AUTH_INVITE_EXPIRED_PATH,
  AUTH_INVITE_INVALID_PATH,
  AUTH_INVITE_PATH,
  AUTH_MFA_PATH,
  AUTH_MFA_RECOVERY_PATH,
  AUTH_OAUTH_ERROR_PATH,
  AUTH_OTP_PATH,
  AUTH_PASSKEY_ERROR_PATH,
  AUTH_PASSKEY_PATH,
  AUTH_RESET_PASSWORD_PATH,
  AUTH_RESET_PASSWORD_SUCCESS_PATH,
  AUTH_RUNTIME_SYNC_PROFILE,
  AUTH_SECURITY_REVIEW_PATH,
  AUTH_SESSION_EXPIRED_PATH,
  AUTH_SSO_ERROR_PATH,
  AUTH_SSO_PATH,
  AUTH_VERIFY_EMAIL_EXPIRED_PATH,
  AUTH_VERIFY_EMAIL_PATH,
  AUTH_VERIFY_EMAIL_SENT_PATH,
  AUTH_VERIFY_EMAIL_SUCCESS_PATH,
  BETTER_AUTH_OAUTH_CALLBACK_PREFIX,
  BETTER_AUTH_PASSKEY_VERIFY_AUTHENTICATION_ENDPOINT,
  BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT,
  BETTER_AUTH_RESET_PASSWORD_ENDPOINT,
  BETTER_AUTH_SSO_OIDC_CALLBACK_PREFIX,
  BETTER_AUTH_SSO_SAML_CALLBACK_PREFIX,
  BETTER_AUTH_SSO_SIGN_IN_ENDPOINT,
  CANONICAL_FORGOT_PASSWORD_FORM_ID,
  CANONICAL_LOGIN_FORM_ID,
  CANONICAL_MFA_OTP_FORM_ID,
  CANONICAL_MFA_RECOVERY_FORM_ID,
  CANONICAL_REGISTER_FORM_ID,
  CANONICAL_RESET_PASSWORD_FORM_ID,
  getLoginPageManifest,
  getLoginPageMethods,
  getPreLoginPageManifest,
  getPreLoginPageMethods,
  getRegisterPageManifest,
  getRegisterPageMethods,
  getResetPasswordPageManifest,
  getResetPasswordPageMethods,
  LOGIN_METHOD_MANIFEST,
  LOGIN_PAGE_BLOCK_IDS,
  type LoginPageBlockId,
  PRE_LOGIN_PAGE_BLOCK_IDS,
  REGISTER_PAGE_BLOCK_IDS,
  RESET_PASSWORD_PAGE_BLOCK_IDS,
  type ResetPasswordPageBlockId,
} from "../../components-auth-shell/auth-shell-method-manifest.js";
import { AUTH_SHELL_LANE_DEFAULT_PAGE_MAP } from "../../components-auth-shell/resolve-auth-shell.js";

const isLoginPageBlockId = (blockId: string): blockId is LoginPageBlockId =>
  LOGIN_PAGE_BLOCK_IDS.includes(blockId as LoginPageBlockId);

const isResetPasswordPageBlockId = (
  blockId: string
): blockId is ResetPasswordPageBlockId =>
  RESET_PASSWORD_PAGE_BLOCK_IDS.includes(blockId as ResetPasswordPageBlockId);

describe("auth shell method manifest", () => {
  it("registers all login-page variants", () => {
    expect(LOGIN_PAGE_BLOCK_IDS).toEqual([
      "login-page-01",
      "login-page-02",
      "login-page-03",
      "login-page-04",
      "login-page-05",
      "login-page-06",
    ]);
  });

  it("registers the invite-first register-page series", () => {
    expect(REGISTER_PAGE_BLOCK_IDS).toEqual(["register-page-01"]);
    expect(getRegisterPageManifest("register-page-01")).toMatchObject({
      blockId: "register-page-01",
      formId: CANONICAL_REGISTER_FORM_ID,
      inviteFirst: true,
    });
  });

  it("registers the reset-password page series", () => {
    expect(RESET_PASSWORD_PAGE_BLOCK_IDS).toEqual([
      "forgot-password-page-01",
      "forgot-password-success-page-01",
      "reset-password-page-01",
      "reset-password-success-page-01",
    ]);

    expect(
      getResetPasswordPageManifest("forgot-password-page-01")
    ).toMatchObject({
      blockId: "forgot-password-page-01",
      formId: CANONICAL_FORGOT_PASSWORD_FORM_ID,
      path: AUTH_FORGOT_PASSWORD_PATH,
      runtimeEndpoint: BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT,
    });
    expect(
      getResetPasswordPageManifest("forgot-password-success-page-01").formId
    ).toBeUndefined();
    expect(
      getResetPasswordPageManifest("forgot-password-success-page-01").path
    ).toBe(AUTH_FORGOT_PASSWORD_SUCCESS_PATH);
    expect(
      getResetPasswordPageManifest("reset-password-page-01")
    ).toMatchObject({
      blockId: "reset-password-page-01",
      formId: CANONICAL_RESET_PASSWORD_FORM_ID,
      path: AUTH_RESET_PASSWORD_PATH,
      runtimeEndpoint: BETTER_AUTH_RESET_PASSWORD_ENDPOINT,
    });
    expect(
      getResetPasswordPageManifest("forgot-password-success-page-01").formId
    ).toBeUndefined();
    expect(
      getResetPasswordPageManifest("reset-password-success-page-01").formId
    ).toBeUndefined();
    expect(
      getResetPasswordPageManifest("reset-password-success-page-01").path
    ).toBe(AUTH_RESET_PASSWORD_SUCCESS_PATH);
  });

  it("registers the remaining pre-login page series", () => {
    expect(PRE_LOGIN_PAGE_BLOCK_IDS).toEqual([
      "verify-email-page-01",
      "verify-email-sent-page-01",
      "verify-email-expired-page-01",
      "verify-email-success-page-01",
      "invite-page-01",
      "invite-accept-page-01",
      "invite-expired-page-01",
      "invite-invalid-page-01",
      "invite-consumed-page-01",
      "invite-email-mismatch-page-01",
      "passkey-page-01",
      "error-passkey-page-01",
      "sso-page-01",
      "error-sso-page-01",
      "error-oauth-page-01",
      "otp-page-01",
      "mfa-page-01",
      "mfa-recovery-page-01",
      "error-session-expired-page-01",
      "error-access-denied-page-01",
      "security-review-page-01",
      "error-authentication-page-01",
    ]);

    expect(getPreLoginPageManifest("verify-email-page-01").path).toBe(
      AUTH_VERIFY_EMAIL_PATH
    );
    expect(getPreLoginPageManifest("verify-email-sent-page-01").path).toBe(
      AUTH_VERIFY_EMAIL_SENT_PATH
    );
    expect(getPreLoginPageManifest("verify-email-expired-page-01").path).toBe(
      AUTH_VERIFY_EMAIL_EXPIRED_PATH
    );
    expect(getPreLoginPageManifest("verify-email-success-page-01").path).toBe(
      AUTH_VERIFY_EMAIL_SUCCESS_PATH
    );
    expect(getPreLoginPageManifest("invite-page-01").path).toBe(
      AUTH_INVITE_PATH
    );
    expect(getPreLoginPageManifest("invite-accept-page-01")).toMatchObject({
      formId: CANONICAL_REGISTER_FORM_ID,
      path: AUTH_INVITE_ACCEPT_PATH,
    });
    expect(getPreLoginPageManifest("invite-expired-page-01").path).toBe(
      AUTH_INVITE_EXPIRED_PATH
    );
    expect(getPreLoginPageManifest("invite-invalid-page-01").path).toBe(
      AUTH_INVITE_INVALID_PATH
    );
    expect(getPreLoginPageManifest("invite-consumed-page-01").path).toBe(
      AUTH_INVITE_CONSUMED_PATH
    );
    expect(getPreLoginPageManifest("invite-email-mismatch-page-01").path).toBe(
      AUTH_INVITE_EMAIL_MISMATCH_PATH
    );
    expect(getPreLoginPageManifest("passkey-page-01").path).toBe(
      AUTH_PASSKEY_PATH
    );
    expect(getPreLoginPageManifest("error-passkey-page-01").path).toBe(
      AUTH_PASSKEY_ERROR_PATH
    );
    expect(getPreLoginPageManifest("sso-page-01").path).toBe(AUTH_SSO_PATH);
    expect(getPreLoginPageManifest("error-sso-page-01").path).toBe(
      AUTH_SSO_ERROR_PATH
    );
    expect(getPreLoginPageManifest("error-oauth-page-01").path).toBe(
      AUTH_OAUTH_ERROR_PATH
    );
    expect(getPreLoginPageManifest("otp-page-01")).toMatchObject({
      formId: CANONICAL_MFA_OTP_FORM_ID,
      path: AUTH_OTP_PATH,
    });
    expect(getPreLoginPageManifest("mfa-page-01")).toMatchObject({
      formId: CANONICAL_MFA_OTP_FORM_ID,
      path: AUTH_MFA_PATH,
    });
    expect(getPreLoginPageManifest("mfa-recovery-page-01")).toMatchObject({
      formId: CANONICAL_MFA_RECOVERY_FORM_ID,
      path: AUTH_MFA_RECOVERY_PATH,
    });
    expect(getPreLoginPageManifest("error-session-expired-page-01").path).toBe(
      AUTH_SESSION_EXPIRED_PATH
    );
    expect(getPreLoginPageManifest("error-access-denied-page-01").path).toBe(
      AUTH_ACCESS_DENIED_PATH
    );
    expect(getPreLoginPageManifest("security-review-page-01").path).toBe(
      AUTH_SECURITY_REVIEW_PATH
    );
    expect(getPreLoginPageManifest("error-authentication-page-01").path).toBe(
      AUTH_ERROR_PATH
    );
  });

  it("keeps lane defaults mapped to registered page blocks", () => {
    for (const blockId of Object.values(AUTH_SHELL_LANE_DEFAULT_PAGE_MAP)) {
      if (isLoginPageBlockId(blockId)) {
        expect(() => getLoginPageManifest(blockId)).not.toThrow();
        continue;
      }

      expect(isResetPasswordPageBlockId(blockId)).toBe(true);
      if (!isResetPasswordPageBlockId(blockId)) {
        throw new Error(`${blockId} is not a reset password page block.`);
      }

      expect(() => getResetPasswordPageManifest(blockId)).not.toThrow();
    }
  });

  it("binds reset-password pages to canonical reset form ids", () => {
    expect(getResetPasswordPageManifest("forgot-password-page-01").formId).toBe(
      CANONICAL_FORGOT_PASSWORD_FORM_ID
    );
    expect(getResetPasswordPageManifest("reset-password-page-01").formId).toBe(
      CANONICAL_RESET_PASSWORD_FORM_ID
    );
    expect(
      getResetPasswordPageManifest("reset-password-success-page-01").formId
    ).toBeUndefined();
  });

  it("binds every page to the canonical credential frame", () => {
    for (const blockId of LOGIN_PAGE_BLOCK_IDS) {
      expect(getLoginPageManifest(blockId).formId).toBe(
        CANONICAL_LOGIN_FORM_ID
      );
    }
  });

  it("declares email-password on every page", () => {
    for (const blockId of LOGIN_PAGE_BLOCK_IDS) {
      expect(getLoginPageManifest(blockId).methodIds).toContain(
        "email-password"
      );
    }
  });

  it("resolves declared page methods from the method manifest", () => {
    for (const blockId of LOGIN_PAGE_BLOCK_IDS) {
      for (const method of getLoginPageMethods(blockId)) {
        expect(LOGIN_METHOD_MANIFEST[method.id]).toBeDefined();
      }
    }
  });

  it("resolves declared register methods from the method manifest", () => {
    for (const blockId of REGISTER_PAGE_BLOCK_IDS) {
      for (const method of getRegisterPageMethods(blockId)) {
        expect(LOGIN_METHOD_MANIFEST[method.id]).toBeDefined();
      }
    }
  });

  it("resolves declared reset-password methods from the method manifest", () => {
    for (const blockId of RESET_PASSWORD_PAGE_BLOCK_IDS) {
      for (const method of getResetPasswordPageMethods(blockId)) {
        expect(LOGIN_METHOD_MANIFEST[method.id]).toBeDefined();
      }
    }
  });

  it("resolves declared pre-login methods from the method manifest", () => {
    for (const blockId of PRE_LOGIN_PAGE_BLOCK_IDS) {
      for (const method of getPreLoginPageMethods(blockId)) {
        expect(LOGIN_METHOD_MANIFEST[method.id]).toBeDefined();
      }
    }
  });

  it("tracks the auth runtime provider truth without importing it", () => {
    expect(AUTH_RUNTIME_SYNC_PROFILE.socialProviderIds).toEqual([
      "google",
      "github",
    ]);
    expect(Object.keys(LOGIN_METHOD_MANIFEST)).not.toContain("facebook");
    expect(Object.keys(LOGIN_METHOD_MANIFEST)).not.toContain("magic-link");
    expect(Object.keys(LOGIN_METHOD_MANIFEST)).not.toContain("demo-user");
    expect(Object.keys(LOGIN_METHOD_MANIFEST)).not.toContain("demo-admin");
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.forgotPassword).toBe(
      "/forgot-password"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.forgotPasswordSuccess).toBe(
      "/forgot-password/success"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.resetPassword).toBe(
      "/reset-password"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.resetPasswordSuccess).toBe(
      "/reset-password/success"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.verifyEmail).toBe(
      "/verify-email"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.inviteAccept).toBe(
      "/invite/accept"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.inviteInvalid).toBe(
      "/invite/invalid"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.inviteConsumed).toBe(
      "/invite/consumed"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.inviteEmailMismatch).toBe(
      "/invite/email-mismatch"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.passkey).toBe("/passkey");
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.passkeyError).toBe(
      "/passkey/error"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.sso).toBe("/sso");
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.ssoError).toBe("/sso/error");
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.oauthError).toBe("/oauth/error");
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.securityReview).toBe(
      "/security/review"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.otp).toBe("/otp");
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.mfa).toBe("/mfa");
    expect(AUTH_RUNTIME_SYNC_PROFILE.authPaths.mfaRecovery).toBe(
      "/mfa/recovery"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.betterAuthEndpoints).toMatchObject({
      oauthCallbackPrefix: BETTER_AUTH_OAUTH_CALLBACK_PREFIX,
      passkeyVerifyAuthentication:
        BETTER_AUTH_PASSKEY_VERIFY_AUTHENTICATION_ENDPOINT,
      requestPasswordReset: BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT,
      resetPassword: BETTER_AUTH_RESET_PASSWORD_ENDPOINT,
      ssoOidcCallbackPrefix: BETTER_AUTH_SSO_OIDC_CALLBACK_PREFIX,
      ssoSamlCallbackPrefix: BETTER_AUTH_SSO_SAML_CALLBACK_PREFIX,
      ssoSignIn: BETTER_AUTH_SSO_SIGN_IN_ENDPOINT,
    });
    expect(AUTH_RUNTIME_SYNC_PROFILE.canonicalMfaOtpFormId).toBe(
      CANONICAL_MFA_OTP_FORM_ID
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.canonicalMfaRecoveryFormId).toBe(
      CANONICAL_MFA_RECOVERY_FORM_ID
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.mfaCapability).toBe("active");
    expect(AUTH_RUNTIME_SYNC_PROFILE.mfaBackupCodeAmount).toBe(10);
    expect(AUTH_RUNTIME_SYNC_PROFILE.invitationBodyTokenField).toBe(
      "invitationToken"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.invitationGateEnabledDefault).toBe(true);
    expect(AUTH_RUNTIME_SYNC_PROFILE.passwordlessTwoFactorDefaultMode).toBe(
      "credential-only"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.passwordlessTwoFactorEnforcedMode).toBe(
      "enforce-all"
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.passkeyRegistrationRequiresSession).toBe(
      true
    );
    expect(AUTH_RUNTIME_SYNC_PROFILE.oauthDisableImplicitSignUp).toBe(true);
    expect(AUTH_RUNTIME_SYNC_PROFILE.ssoDisableImplicitSignUp).toBe(true);
    expect(AUTH_RUNTIME_SYNC_PROFILE.resetPasswordCapability).toBe("active");
    expect(AUTH_RUNTIME_SYNC_PROFILE.resetPasswordRevokesSessions).toBe(true);
    expect(
      AUTH_RUNTIME_SYNC_PROFILE.resetPasswordRequiresEmailVerification
    ).toBe(true);
  });

  it("keeps register methods backed by current runtime method classes", () => {
    const methodIds = getRegisterPageManifest("register-page-01").methodIds;

    expect(methodIds).toEqual([
      "email-password",
      "google",
      "github",
      "sso",
      "passkey",
      "sign-in",
      "sign-up",
      "back-to-website",
    ]);
    expect(AUTH_RUNTIME_SYNC_PROFILE.inviteOnlySignUp).toBe(true);
  });
});
