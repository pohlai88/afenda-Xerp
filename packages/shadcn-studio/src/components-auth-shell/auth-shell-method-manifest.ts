/**
 * Auth auth shell method manifest.
 *
 * Owns configured auth methods and auth-shell method metadata only.
 * It must not own page composition, visual layout, lane routing, or canonical
 * form rendering.
 *
 * Manual sync authority — do not import runtime packages here.
 * Synchronize against:
 * - packages/auth/src/auth.sign-in-surface.ts
 * - packages/auth/src/auth.social-providers.ts
 * - packages/auth/src/auth.config.ts
 * - apps/erp/src/lib/auth/auth-path.registry.ts
 */

export const CANONICAL_LOGIN_FORM_ID = "login-form-v1" as const;
export const CANONICAL_REGISTER_FORM_ID = "register-form-v1" as const;
export const CANONICAL_FORGOT_PASSWORD_FORM_ID =
  "forgot-password-form-v1" as const;
export const CANONICAL_VERIFY_EMAIL_FORM_ID = "verify-email-form-v1" as const;
export const CANONICAL_MFA_OTP_FORM_ID = "mfa-otp-form-v1" as const;
export const CANONICAL_MFA_RECOVERY_FORM_ID = "mfa-recovery-form-v1" as const;
export const CANONICAL_RESET_PASSWORD_FORM_ID =
  "reset-password-form-v1" as const;
export const AUTH_OTP_PATH = "/otp" as const;
export const AUTH_MFA_PATH = "/mfa" as const;
export const AUTH_MFA_RECOVERY_PATH = "/mfa/recovery" as const;
export const AUTH_SIGN_IN_PATH = "/sign-in" as const;
export const AUTH_SIGN_UP_PATH = "/sign-up" as const;
export const AUTH_VERIFY_EMAIL_PATH = "/verify-email" as const;
export const AUTH_VERIFY_EMAIL_SENT_PATH = "/verify-email/sent" as const;
export const AUTH_VERIFY_EMAIL_EXPIRED_PATH = "/verify-email/expired" as const;
export const AUTH_VERIFY_EMAIL_SUCCESS_PATH = "/verify-email/success" as const;
export const AUTH_INVITE_PATH = "/invite" as const;
export const AUTH_INVITE_ACCEPT_PATH = "/invite/accept" as const;
export const AUTH_INVITE_EXPIRED_PATH = "/invite/expired" as const;
export const AUTH_INVITE_INVALID_PATH = "/invite/invalid" as const;
export const AUTH_INVITE_CONSUMED_PATH = "/invite/consumed" as const;
export const AUTH_INVITE_EMAIL_MISMATCH_PATH =
  "/invite/email-mismatch" as const;
export const AUTH_FORGOT_PASSWORD_PATH = "/forgot-password" as const;
export const AUTH_FORGOT_PASSWORD_SUCCESS_PATH =
  "/forgot-password/success" as const;
export const AUTH_PASSKEY_PATH = "/passkey" as const;
export const AUTH_PASSKEY_ERROR_PATH = "/passkey/error" as const;
export const AUTH_SSO_PATH = "/sso" as const;
export const AUTH_SSO_ERROR_PATH = "/sso/error" as const;
export const AUTH_OAUTH_ERROR_PATH = "/oauth/error" as const;
export const AUTH_RESET_PASSWORD_PATH = "/reset-password" as const;
export const AUTH_RESET_PASSWORD_SUCCESS_PATH =
  "/reset-password/success" as const;
export const AUTH_SESSION_EXPIRED_PATH = "/session-expired" as const;
export const AUTH_ACCESS_DENIED_PATH = "/access-denied" as const;
export const AUTH_SECURITY_REVIEW_PATH = "/security/review" as const;
export const AUTH_ERROR_PATH = "/error" as const;
export const AUTH_BACK_TO_WEBSITE_PATH = "/" as const;
export const BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT =
  "/request-password-reset" as const;
export const BETTER_AUTH_RESET_PASSWORD_ENDPOINT = "/reset-password" as const;
export const BETTER_AUTH_PASSKEY_VERIFY_AUTHENTICATION_ENDPOINT =
  "/passkey/verify-authentication" as const;
export const BETTER_AUTH_SSO_SIGN_IN_ENDPOINT = "/sign-in/sso" as const;
export const BETTER_AUTH_SSO_OIDC_CALLBACK_PREFIX = "/sso/callback/" as const;
export const BETTER_AUTH_SSO_SAML_CALLBACK_PREFIX =
  "/sso/saml2/callback/" as const;
export const BETTER_AUTH_OAUTH_CALLBACK_PREFIX = "/callback/" as const;

export type AuthShellLane = "access" | "verify" | "recover" | "error";

/** Backward-compatible name used by the current auth shell. */
export type AuthShellFormLane = AuthShellLane;

export type LoginPageBlockId =
  | "login-page-01"
  | "login-page-02"
  | "login-page-03"
  | "login-page-04"
  | "login-page-05"
  | "login-page-06";

export type RegisterPageBlockId = "register-page-01";

export type ResetPasswordPageBlockId =
  | "forgot-password-page-01"
  | "forgot-password-success-page-01"
  | "reset-password-page-01"
  | "reset-password-success-page-01";

export type PreLoginPageBlockId =
  | "verify-email-page-01"
  | "verify-email-sent-page-01"
  | "verify-email-expired-page-01"
  | "verify-email-success-page-01"
  | "invite-page-01"
  | "invite-accept-page-01"
  | "invite-expired-page-01"
  | "invite-invalid-page-01"
  | "invite-consumed-page-01"
  | "invite-email-mismatch-page-01"
  | "passkey-page-01"
  | "error-passkey-page-01"
  | "sso-page-01"
  | "error-sso-page-01"
  | "error-oauth-page-01"
  | "otp-page-01"
  | "mfa-page-01"
  | "mfa-recovery-page-01"
  | "error-session-expired-page-01"
  | "error-access-denied-page-01"
  | "security-review-page-01"
  | "error-authentication-page-01";

export type AuthPageBlockId =
  | LoginPageBlockId
  | RegisterPageBlockId
  | ResetPasswordPageBlockId
  | PreLoginPageBlockId;

export type AuthShellPageBlockId = AuthPageBlockId;

export type LoginPageDesignPattern =
  | "centered-card"
  | "split-dashboard-preview"
  | "split-brand-panel"
  | "erp-operator-ingress"
  | "compact-social-card"
  | "cinematic-silk-panel";

export type RegisterPageDesignPattern = "invite-first-centered-card";

export type ResetPasswordPageDesignPattern =
  | "forgot-password-centered-card"
  | "forgot-password-success-card"
  | "reset-password-centered-card"
  | "reset-password-success-card";

export type PreLoginPageDesignPattern =
  | "email-verification-card"
  | "invite-card"
  | "invite-failure-card"
  | "external-auth-card"
  | "otp-challenge-card"
  | "mfa-challenge-card"
  | "security-review-card"
  | "auth-boundary-card";

export type AuthLoginMethodId =
  | "email-password"
  | "google"
  | "github"
  | "passkey"
  | "sso"
  | "verify-email"
  | "verify-email-sent"
  | "verify-email-expired"
  | "verify-email-success"
  | "invite"
  | "accept-invitation"
  | "invitation-expired"
  | "invitation-invalid"
  | "invitation-consumed"
  | "invitation-email-mismatch"
  | "start-passkey"
  | "error-passkey"
  | "start-sso"
  | "error-sso"
  | "error-oauth"
  | "security-review"
  | "submit-otp"
  | "submit-mfa-otp"
  | "submit-mfa-recovery"
  | "error-session-expired"
  | "error-access-denied"
  | "error-authentication"
  | "forgot-password"
  | "forgot-password-success"
  | "request-password-reset"
  | "reset-password"
  | "reset-password-success"
  | "sign-in"
  | "sign-up"
  | "back-to-website";

export type AuthLoginMethodKind =
  | "credential"
  | "email-verification"
  | "invite"
  | "mfa"
  | "oauth"
  | "passkey"
  | "password-reset"
  | "sso"
  | "navigation";

export const CANONICAL_CREDENTIAL_METHOD_ID = "email-password" as const;

interface AuthRuntimeAuthPaths {
  readonly accessDenied: typeof AUTH_ACCESS_DENIED_PATH;
  readonly backToWebsite: typeof AUTH_BACK_TO_WEBSITE_PATH;
  readonly error: typeof AUTH_ERROR_PATH;
  readonly forgotPassword: typeof AUTH_FORGOT_PASSWORD_PATH;
  readonly forgotPasswordSuccess: typeof AUTH_FORGOT_PASSWORD_SUCCESS_PATH;
  readonly invite: typeof AUTH_INVITE_PATH;
  readonly inviteAccept: typeof AUTH_INVITE_ACCEPT_PATH;
  readonly inviteConsumed: typeof AUTH_INVITE_CONSUMED_PATH;
  readonly inviteEmailMismatch: typeof AUTH_INVITE_EMAIL_MISMATCH_PATH;
  readonly inviteExpired: typeof AUTH_INVITE_EXPIRED_PATH;
  readonly inviteInvalid: typeof AUTH_INVITE_INVALID_PATH;
  readonly mfa: typeof AUTH_MFA_PATH;
  readonly mfaRecovery: typeof AUTH_MFA_RECOVERY_PATH;
  readonly oauthError: typeof AUTH_OAUTH_ERROR_PATH;
  readonly otp: typeof AUTH_OTP_PATH;
  readonly passkey: typeof AUTH_PASSKEY_PATH;
  readonly passkeyError: typeof AUTH_PASSKEY_ERROR_PATH;
  readonly resetPassword: typeof AUTH_RESET_PASSWORD_PATH;
  readonly resetPasswordSuccess: typeof AUTH_RESET_PASSWORD_SUCCESS_PATH;
  readonly securityReview: typeof AUTH_SECURITY_REVIEW_PATH;
  readonly sessionExpired: typeof AUTH_SESSION_EXPIRED_PATH;
  readonly signIn: typeof AUTH_SIGN_IN_PATH;
  readonly signUp: typeof AUTH_SIGN_UP_PATH;
  readonly sso: typeof AUTH_SSO_PATH;
  readonly ssoError: typeof AUTH_SSO_ERROR_PATH;
  readonly verifyEmail: typeof AUTH_VERIFY_EMAIL_PATH;
  readonly verifyEmailExpired: typeof AUTH_VERIFY_EMAIL_EXPIRED_PATH;
  readonly verifyEmailSent: typeof AUTH_VERIFY_EMAIL_SENT_PATH;
  readonly verifyEmailSuccess: typeof AUTH_VERIFY_EMAIL_SUCCESS_PATH;
}

interface AuthRuntimeBetterAuthEndpoints {
  readonly oauthCallbackPrefix: typeof BETTER_AUTH_OAUTH_CALLBACK_PREFIX;
  readonly passkeyVerifyAuthentication: typeof BETTER_AUTH_PASSKEY_VERIFY_AUTHENTICATION_ENDPOINT;
  readonly requestPasswordReset: typeof BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT;
  readonly resetPassword: typeof BETTER_AUTH_RESET_PASSWORD_ENDPOINT;
  readonly ssoOidcCallbackPrefix: typeof BETTER_AUTH_SSO_OIDC_CALLBACK_PREFIX;
  readonly ssoSamlCallbackPrefix: typeof BETTER_AUTH_SSO_SAML_CALLBACK_PREFIX;
  readonly ssoSignIn: typeof BETTER_AUTH_SSO_SIGN_IN_ENDPOINT;
}

interface AuthRuntimeSyncProfile {
  readonly authPaths: AuthRuntimeAuthPaths;
  readonly betterAuthEndpoints: AuthRuntimeBetterAuthEndpoints;
  readonly canonicalCredentialMethodId: typeof CANONICAL_CREDENTIAL_METHOD_ID;
  readonly canonicalForgotPasswordFormId: typeof CANONICAL_FORGOT_PASSWORD_FORM_ID;
  readonly canonicalMfaOtpFormId: typeof CANONICAL_MFA_OTP_FORM_ID;
  readonly canonicalMfaRecoveryFormId: typeof CANONICAL_MFA_RECOVERY_FORM_ID;
  readonly canonicalResetPasswordFormId: typeof CANONICAL_RESET_PASSWORD_FORM_ID;
  readonly invitationBodyTokenField: "invitationToken";
  readonly invitationGateEnabledDefault: boolean;
  readonly invitationGateEnv: "AFENDA_AUTH_INVITATION_GATE";
  readonly inviteOnlySignUp: boolean;
  readonly mfaAllowPasswordless: boolean;
  readonly mfaBackupCodeAmount: number;
  readonly mfaCapability: "active";
  readonly oauthDisableImplicitSignUp: boolean;
  readonly passkeyCapability: "active";
  readonly passkeyRegistrationRequiresSession: boolean;
  readonly passwordlessTwoFactorDefaultMode: "credential-only";
  readonly passwordlessTwoFactorEnforcedMode: "enforce-all";
  readonly passwordlessTwoFactorEnv: "AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR";
  readonly resetPasswordCapability: "active";
  readonly resetPasswordRequiresEmailVerification: boolean;
  readonly resetPasswordRevokesSessions: boolean;
  readonly socialProviderIds: readonly ["google", "github"];
  readonly ssoCapability: "active";
  readonly ssoDisableImplicitSignUp: boolean;
  readonly synchronizedFrom: {
    readonly authConfig: "packages/auth/src/auth.config.ts";
    readonly authPaths: "apps/erp/src/lib/auth/auth-path.registry.ts";
    readonly invitation: "packages/auth/src/auth.invitation.ts";
    readonly oauthPolicy: "packages/auth/src/auth.oauth-policy.ts";
    readonly passwordlessTwoFactorPolicy: "packages/auth/src/auth.passwordless-two-factor-policy.ts";
    readonly signInSurface: "packages/auth/src/auth.sign-in-surface.ts";
    readonly socialProviders: "packages/auth/src/auth.social-providers.ts";
    readonly ssoPolicy: "packages/auth/src/auth.sso-policy.ts";
  };
}

export const AUTH_RUNTIME_SYNC_PROFILE = {
  authPaths: {
    backToWebsite: AUTH_BACK_TO_WEBSITE_PATH,
    accessDenied: AUTH_ACCESS_DENIED_PATH,
    error: AUTH_ERROR_PATH,
    forgotPassword: AUTH_FORGOT_PASSWORD_PATH,
    forgotPasswordSuccess: AUTH_FORGOT_PASSWORD_SUCCESS_PATH,
    invite: AUTH_INVITE_PATH,
    inviteAccept: AUTH_INVITE_ACCEPT_PATH,
    inviteConsumed: AUTH_INVITE_CONSUMED_PATH,
    inviteEmailMismatch: AUTH_INVITE_EMAIL_MISMATCH_PATH,
    inviteExpired: AUTH_INVITE_EXPIRED_PATH,
    inviteInvalid: AUTH_INVITE_INVALID_PATH,
    mfa: AUTH_MFA_PATH,
    mfaRecovery: AUTH_MFA_RECOVERY_PATH,
    oauthError: AUTH_OAUTH_ERROR_PATH,
    otp: AUTH_OTP_PATH,
    passkey: AUTH_PASSKEY_PATH,
    passkeyError: AUTH_PASSKEY_ERROR_PATH,
    resetPassword: AUTH_RESET_PASSWORD_PATH,
    resetPasswordSuccess: AUTH_RESET_PASSWORD_SUCCESS_PATH,
    securityReview: AUTH_SECURITY_REVIEW_PATH,
    sessionExpired: AUTH_SESSION_EXPIRED_PATH,
    signIn: AUTH_SIGN_IN_PATH,
    signUp: AUTH_SIGN_UP_PATH,
    sso: AUTH_SSO_PATH,
    ssoError: AUTH_SSO_ERROR_PATH,
    verifyEmail: AUTH_VERIFY_EMAIL_PATH,
    verifyEmailExpired: AUTH_VERIFY_EMAIL_EXPIRED_PATH,
    verifyEmailSent: AUTH_VERIFY_EMAIL_SENT_PATH,
    verifyEmailSuccess: AUTH_VERIFY_EMAIL_SUCCESS_PATH,
  },
  betterAuthEndpoints: {
    oauthCallbackPrefix: BETTER_AUTH_OAUTH_CALLBACK_PREFIX,
    passkeyVerifyAuthentication:
      BETTER_AUTH_PASSKEY_VERIFY_AUTHENTICATION_ENDPOINT,
    requestPasswordReset: BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT,
    resetPassword: BETTER_AUTH_RESET_PASSWORD_ENDPOINT,
    ssoSamlCallbackPrefix: BETTER_AUTH_SSO_SAML_CALLBACK_PREFIX,
    ssoOidcCallbackPrefix: BETTER_AUTH_SSO_OIDC_CALLBACK_PREFIX,
    ssoSignIn: BETTER_AUTH_SSO_SIGN_IN_ENDPOINT,
  },
  canonicalCredentialMethodId: CANONICAL_CREDENTIAL_METHOD_ID,
  canonicalForgotPasswordFormId: CANONICAL_FORGOT_PASSWORD_FORM_ID,
  canonicalMfaOtpFormId: CANONICAL_MFA_OTP_FORM_ID,
  canonicalMfaRecoveryFormId: CANONICAL_MFA_RECOVERY_FORM_ID,
  canonicalResetPasswordFormId: CANONICAL_RESET_PASSWORD_FORM_ID,
  inviteOnlySignUp: true,
  invitationBodyTokenField: "invitationToken",
  invitationGateEnv: "AFENDA_AUTH_INVITATION_GATE",
  invitationGateEnabledDefault: true,
  mfaCapability: "active",
  mfaAllowPasswordless: true,
  mfaBackupCodeAmount: 10,
  passwordlessTwoFactorDefaultMode: "credential-only",
  passwordlessTwoFactorEnforcedMode: "enforce-all",
  passwordlessTwoFactorEnv: "AFENDA_AUTH_PASSWORDLESS_TWO_FACTOR",
  passkeyCapability: "active",
  passkeyRegistrationRequiresSession: true,
  oauthDisableImplicitSignUp: true,
  resetPasswordCapability: "active",
  resetPasswordRevokesSessions: true,
  resetPasswordRequiresEmailVerification: true,
  socialProviderIds: ["google", "github"],
  ssoCapability: "active",
  ssoDisableImplicitSignUp: true,
  synchronizedFrom: {
    authConfig: "packages/auth/src/auth.config.ts",
    invitation: "packages/auth/src/auth.invitation.ts",
    authPaths: "apps/erp/src/lib/auth/auth-path.registry.ts",
    oauthPolicy: "packages/auth/src/auth.oauth-policy.ts",
    passwordlessTwoFactorPolicy:
      "packages/auth/src/auth.passwordless-two-factor-policy.ts",
    signInSurface: "packages/auth/src/auth.sign-in-surface.ts",
    socialProviders: "packages/auth/src/auth.social-providers.ts",
    ssoPolicy: "packages/auth/src/auth.sso-policy.ts",
  },
} as const satisfies AuthRuntimeSyncProfile;

export interface AuthLoginMethodManifestEntry<
  TMethodId extends AuthLoginMethodId = AuthLoginMethodId,
> {
  readonly formId?:
    | typeof CANONICAL_FORGOT_PASSWORD_FORM_ID
    | typeof CANONICAL_LOGIN_FORM_ID
    | typeof CANONICAL_MFA_OTP_FORM_ID
    | typeof CANONICAL_MFA_RECOVERY_FORM_ID
    | typeof CANONICAL_REGISTER_FORM_ID
    | typeof CANONICAL_RESET_PASSWORD_FORM_ID;
  readonly href: string;
  readonly id: TMethodId;
  readonly kind: AuthLoginMethodKind;
  readonly label: string;
  readonly provider?: "google" | "github";
}

export interface LoginPageManifestEntry {
  readonly blockId: LoginPageBlockId;
  readonly defaultLane: AuthShellLane;
  readonly designPattern: LoginPageDesignPattern;
  readonly formId: typeof CANONICAL_LOGIN_FORM_ID;
  readonly methodIds: readonly AuthLoginMethodId[];
}

export interface RegisterPageManifestEntry {
  readonly blockId: RegisterPageBlockId;
  readonly defaultLane: "access";
  readonly designPattern: RegisterPageDesignPattern;
  readonly formId: typeof CANONICAL_REGISTER_FORM_ID;
  readonly inviteFirst: true;
  readonly methodIds: readonly AuthLoginMethodId[];
}

export interface ResetPasswordPageManifestEntry {
  readonly blockId: ResetPasswordPageBlockId;
  readonly defaultLane: "recover";
  readonly designPattern: ResetPasswordPageDesignPattern;
  readonly formId?:
    | typeof CANONICAL_FORGOT_PASSWORD_FORM_ID
    | typeof CANONICAL_RESET_PASSWORD_FORM_ID;
  readonly methodIds: readonly AuthLoginMethodId[];
  readonly path:
    | typeof AUTH_FORGOT_PASSWORD_PATH
    | typeof AUTH_FORGOT_PASSWORD_SUCCESS_PATH
    | typeof AUTH_RESET_PASSWORD_PATH
    | typeof AUTH_RESET_PASSWORD_SUCCESS_PATH;
  readonly runtimeEndpoint?:
    | typeof BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT
    | typeof BETTER_AUTH_RESET_PASSWORD_ENDPOINT;
}

export interface PreLoginPageManifestEntry {
  readonly blockId: PreLoginPageBlockId;
  readonly defaultLane: AuthShellLane | "invite" | "security";
  readonly designPattern: PreLoginPageDesignPattern;
  readonly formId?:
    | typeof CANONICAL_MFA_OTP_FORM_ID
    | typeof CANONICAL_MFA_RECOVERY_FORM_ID
    | typeof CANONICAL_REGISTER_FORM_ID;
  readonly methodIds: readonly AuthLoginMethodId[];
  readonly path:
    | typeof AUTH_ACCESS_DENIED_PATH
    | typeof AUTH_ERROR_PATH
    | typeof AUTH_INVITE_ACCEPT_PATH
    | typeof AUTH_INVITE_CONSUMED_PATH
    | typeof AUTH_INVITE_EMAIL_MISMATCH_PATH
    | typeof AUTH_INVITE_EXPIRED_PATH
    | typeof AUTH_INVITE_INVALID_PATH
    | typeof AUTH_INVITE_PATH
    | typeof AUTH_MFA_PATH
    | typeof AUTH_MFA_RECOVERY_PATH
    | typeof AUTH_OAUTH_ERROR_PATH
    | typeof AUTH_OTP_PATH
    | typeof AUTH_PASSKEY_ERROR_PATH
    | typeof AUTH_PASSKEY_PATH
    | typeof AUTH_SECURITY_REVIEW_PATH
    | typeof AUTH_SESSION_EXPIRED_PATH
    | typeof AUTH_SSO_ERROR_PATH
    | typeof AUTH_SSO_PATH
    | typeof AUTH_VERIFY_EMAIL_EXPIRED_PATH
    | typeof AUTH_VERIFY_EMAIL_PATH
    | typeof AUTH_VERIFY_EMAIL_SENT_PATH
    | typeof AUTH_VERIFY_EMAIL_SUCCESS_PATH;
}

export const LOGIN_METHOD_MANIFEST = {
  "email-password": {
    id: "email-password",
    kind: "credential",
    label: "Email and password",
    href: AUTH_SIGN_IN_PATH,
    formId: CANONICAL_LOGIN_FORM_ID,
  },
  google: {
    id: "google",
    kind: "oauth",
    provider: "google",
    label: "Continue with Google",
    href: AUTH_SIGN_IN_PATH,
  },
  github: {
    id: "github",
    kind: "oauth",
    provider: "github",
    label: "Continue with GitHub",
    href: AUTH_SIGN_IN_PATH,
  },
  passkey: {
    id: "passkey",
    kind: "passkey",
    label: "Use a passkey",
    href: AUTH_PASSKEY_PATH,
  },
  sso: {
    id: "sso",
    kind: "sso",
    label: "Continue with SSO",
    href: AUTH_SSO_PATH,
  },
  "verify-email": {
    id: "verify-email",
    kind: "email-verification",
    label: "Verify email",
    href: AUTH_VERIFY_EMAIL_PATH,
  },
  "verify-email-sent": {
    id: "verify-email-sent",
    kind: "email-verification",
    label: "Verification email sent",
    href: AUTH_VERIFY_EMAIL_SENT_PATH,
  },
  "verify-email-expired": {
    id: "verify-email-expired",
    kind: "email-verification",
    label: "Verification link expired",
    href: AUTH_VERIFY_EMAIL_EXPIRED_PATH,
  },
  "verify-email-success": {
    id: "verify-email-success",
    kind: "email-verification",
    label: "Email verified",
    href: AUTH_VERIFY_EMAIL_SUCCESS_PATH,
  },
  invite: {
    id: "invite",
    kind: "invite",
    label: "Invitation",
    href: AUTH_INVITE_PATH,
  },
  "accept-invitation": {
    id: "accept-invitation",
    kind: "invite",
    label: "Accept invitation",
    href: AUTH_INVITE_ACCEPT_PATH,
    formId: CANONICAL_REGISTER_FORM_ID,
  },
  "invitation-expired": {
    id: "invitation-expired",
    kind: "invite",
    label: "Invitation expired",
    href: AUTH_INVITE_EXPIRED_PATH,
  },
  "invitation-invalid": {
    id: "invitation-invalid",
    kind: "invite",
    label: "Invitation invalid",
    href: AUTH_INVITE_INVALID_PATH,
  },
  "invitation-consumed": {
    id: "invitation-consumed",
    kind: "invite",
    label: "Invitation already used",
    href: AUTH_INVITE_CONSUMED_PATH,
  },
  "invitation-email-mismatch": {
    id: "invitation-email-mismatch",
    kind: "invite",
    label: "Invitation email mismatch",
    href: AUTH_INVITE_EMAIL_MISMATCH_PATH,
  },
  "start-passkey": {
    id: "start-passkey",
    kind: "passkey",
    label: "Use a passkey",
    href: AUTH_PASSKEY_PATH,
  },
  "error-passkey": {
    id: "error-passkey",
    kind: "passkey",
    label: "Passkey unavailable",
    href: AUTH_PASSKEY_ERROR_PATH,
  },
  "start-sso": {
    id: "start-sso",
    kind: "sso",
    label: "Continue with SSO",
    href: AUTH_SSO_PATH,
  },
  "error-sso": {
    id: "error-sso",
    kind: "sso",
    label: "SSO unavailable",
    href: AUTH_SSO_ERROR_PATH,
  },
  "error-oauth": {
    id: "error-oauth",
    kind: "oauth",
    label: "OAuth sign-in failed",
    href: AUTH_OAUTH_ERROR_PATH,
  },
  "security-review": {
    id: "security-review",
    kind: "mfa",
    label: "Review security step",
    href: AUTH_SECURITY_REVIEW_PATH,
  },
  "submit-otp": {
    id: "submit-otp",
    kind: "mfa",
    label: "Continue",
    href: AUTH_OTP_PATH,
    formId: CANONICAL_MFA_OTP_FORM_ID,
  },
  "submit-mfa-otp": {
    id: "submit-mfa-otp",
    kind: "mfa",
    label: "Verify code",
    href: AUTH_MFA_PATH,
    formId: CANONICAL_MFA_OTP_FORM_ID,
  },
  "submit-mfa-recovery": {
    id: "submit-mfa-recovery",
    kind: "mfa",
    label: "Use recovery code",
    href: AUTH_MFA_RECOVERY_PATH,
    formId: CANONICAL_MFA_RECOVERY_FORM_ID,
  },
  "error-session-expired": {
    id: "error-session-expired",
    kind: "navigation",
    label: "Session expired",
    href: AUTH_SESSION_EXPIRED_PATH,
  },
  "error-access-denied": {
    id: "error-access-denied",
    kind: "navigation",
    label: "Access denied",
    href: AUTH_ACCESS_DENIED_PATH,
  },
  "error-authentication": {
    id: "error-authentication",
    kind: "navigation",
    label: "Authentication error",
    href: AUTH_ERROR_PATH,
  },
  "forgot-password": {
    id: "forgot-password",
    kind: "navigation",
    label: "Reset password",
    href: AUTH_FORGOT_PASSWORD_PATH,
  },
  "request-password-reset": {
    id: "request-password-reset",
    kind: "password-reset",
    label: "Send reset link",
    href: AUTH_FORGOT_PASSWORD_PATH,
    formId: CANONICAL_FORGOT_PASSWORD_FORM_ID,
  },
  "forgot-password-success": {
    id: "forgot-password-success",
    kind: "navigation",
    label: "Reset link sent",
    href: AUTH_FORGOT_PASSWORD_SUCCESS_PATH,
  },
  "reset-password": {
    id: "reset-password",
    kind: "password-reset",
    label: "Update password",
    href: AUTH_RESET_PASSWORD_PATH,
    formId: CANONICAL_RESET_PASSWORD_FORM_ID,
  },
  "reset-password-success": {
    id: "reset-password-success",
    kind: "navigation",
    label: "Password reset complete",
    href: AUTH_RESET_PASSWORD_SUCCESS_PATH,
  },
  "sign-in": {
    id: "sign-in",
    kind: "navigation",
    label: "Sign in",
    href: AUTH_SIGN_IN_PATH,
  },
  "sign-up": {
    id: "sign-up",
    kind: "navigation",
    label: "Use your invitation",
    href: AUTH_SIGN_UP_PATH,
  },
  "back-to-website": {
    id: "back-to-website",
    kind: "navigation",
    label: "Back to the website",
    href: AUTH_BACK_TO_WEBSITE_PATH,
  },
} as const satisfies {
  readonly [TMethodId in AuthLoginMethodId]: AuthLoginMethodManifestEntry<TMethodId>;
};

/**
 * @deprecated Lane routing is owned by `resolve-auth-shell.tsx`.
 * Compatibility mirror for existing public imports only.
 */
export const LOGIN_METHOD_LANE_DEFAULT_PAGE_MAP = {
  access: "login-page-04",
  verify: "login-page-02",
  recover: "forgot-password-page-01",
  error: "login-page-06",
} as const satisfies Record<AuthShellLane, AuthPageBlockId>;

export const LOGIN_PAGE_MANIFEST = {
  "login-page-01": {
    blockId: "login-page-01",
    formId: CANONICAL_LOGIN_FORM_ID,
    defaultLane: "access",
    designPattern: "centered-card",
    methodIds: [
      "email-password",
      "passkey",
      "sso",
      "google",
      "github",
      "forgot-password",
      "sign-up",
    ],
  },
  "login-page-02": {
    blockId: "login-page-02",
    formId: CANONICAL_LOGIN_FORM_ID,
    defaultLane: "verify",
    designPattern: "split-dashboard-preview",
    methodIds: [
      "email-password",
      "passkey",
      "sso",
      "google",
      "github",
      "forgot-password",
      "sign-up",
      "back-to-website",
    ],
  },
  "login-page-03": {
    blockId: "login-page-03",
    formId: CANONICAL_LOGIN_FORM_ID,
    defaultLane: "access",
    designPattern: "split-brand-panel",
    methodIds: [
      "email-password",
      "google",
      "github",
      "forgot-password",
      "sign-up",
    ],
  },
  "login-page-04": {
    blockId: "login-page-04",
    formId: CANONICAL_LOGIN_FORM_ID,
    defaultLane: "access",
    designPattern: "erp-operator-ingress",
    methodIds: [
      "email-password",
      "google",
      "github",
      "sso",
      "forgot-password",
      "sign-up",
    ],
  },
  "login-page-05": {
    blockId: "login-page-05",
    formId: CANONICAL_LOGIN_FORM_ID,
    defaultLane: "recover",
    designPattern: "compact-social-card",
    methodIds: [
      "email-password",
      "google",
      "github",
      "passkey",
      "forgot-password",
      "sign-up",
    ],
  },
  "login-page-06": {
    blockId: "login-page-06",
    formId: CANONICAL_LOGIN_FORM_ID,
    defaultLane: "error",
    designPattern: "cinematic-silk-panel",
    methodIds: [
      "email-password",
      "google",
      "github",
      "forgot-password",
      "sign-up",
    ],
  },
} as const satisfies Record<LoginPageBlockId, LoginPageManifestEntry>;

export const REGISTER_PAGE_MANIFEST = {
  "register-page-01": {
    blockId: "register-page-01",
    formId: CANONICAL_REGISTER_FORM_ID,
    defaultLane: "access",
    designPattern: "invite-first-centered-card",
    inviteFirst: true,
    methodIds: [
      "email-password",
      "google",
      "github",
      "sso",
      "passkey",
      "sign-in",
      "sign-up",
      "back-to-website",
    ],
  },
} as const satisfies Record<RegisterPageBlockId, RegisterPageManifestEntry>;

export const RESET_PASSWORD_PAGE_MANIFEST = {
  "forgot-password-page-01": {
    blockId: "forgot-password-page-01",
    formId: CANONICAL_FORGOT_PASSWORD_FORM_ID,
    defaultLane: "recover",
    designPattern: "forgot-password-centered-card",
    path: AUTH_FORGOT_PASSWORD_PATH,
    runtimeEndpoint: BETTER_AUTH_REQUEST_PASSWORD_RESET_ENDPOINT,
    methodIds: ["request-password-reset", "sign-in", "back-to-website"],
  },
  "forgot-password-success-page-01": {
    blockId: "forgot-password-success-page-01",
    defaultLane: "recover",
    designPattern: "forgot-password-success-card",
    path: AUTH_FORGOT_PASSWORD_SUCCESS_PATH,
    methodIds: ["forgot-password-success", "sign-in", "back-to-website"],
  },
  "reset-password-page-01": {
    blockId: "reset-password-page-01",
    formId: CANONICAL_RESET_PASSWORD_FORM_ID,
    defaultLane: "recover",
    designPattern: "reset-password-centered-card",
    path: AUTH_RESET_PASSWORD_PATH,
    runtimeEndpoint: BETTER_AUTH_RESET_PASSWORD_ENDPOINT,
    methodIds: ["reset-password", "sign-in"],
  },
  "reset-password-success-page-01": {
    blockId: "reset-password-success-page-01",
    defaultLane: "recover",
    designPattern: "reset-password-success-card",
    path: AUTH_RESET_PASSWORD_SUCCESS_PATH,
    methodIds: ["reset-password-success", "sign-in"],
  },
} as const satisfies Record<
  ResetPasswordPageBlockId,
  ResetPasswordPageManifestEntry
>;

export const PRE_LOGIN_PAGE_MANIFEST = {
  "verify-email-page-01": {
    blockId: "verify-email-page-01",
    defaultLane: "verify",
    designPattern: "email-verification-card",
    path: AUTH_VERIFY_EMAIL_PATH,
    methodIds: ["verify-email", "sign-in"],
  },
  "verify-email-sent-page-01": {
    blockId: "verify-email-sent-page-01",
    defaultLane: "verify",
    designPattern: "email-verification-card",
    path: AUTH_VERIFY_EMAIL_SENT_PATH,
    methodIds: ["verify-email-sent", "sign-in"],
  },
  "verify-email-expired-page-01": {
    blockId: "verify-email-expired-page-01",
    defaultLane: "verify",
    designPattern: "email-verification-card",
    path: AUTH_VERIFY_EMAIL_EXPIRED_PATH,
    methodIds: ["verify-email-expired", "sign-in"],
  },
  "verify-email-success-page-01": {
    blockId: "verify-email-success-page-01",
    defaultLane: "verify",
    designPattern: "email-verification-card",
    path: AUTH_VERIFY_EMAIL_SUCCESS_PATH,
    methodIds: ["verify-email-success", "sign-in"],
  },
  "invite-page-01": {
    blockId: "invite-page-01",
    defaultLane: "invite",
    designPattern: "invite-card",
    path: AUTH_INVITE_PATH,
    methodIds: ["invite", "sign-in"],
  },
  "invite-accept-page-01": {
    blockId: "invite-accept-page-01",
    defaultLane: "invite",
    designPattern: "invite-card",
    formId: CANONICAL_REGISTER_FORM_ID,
    path: AUTH_INVITE_ACCEPT_PATH,
    methodIds: ["accept-invitation", "sign-in", "back-to-website"],
  },
  "invite-expired-page-01": {
    blockId: "invite-expired-page-01",
    defaultLane: "invite",
    designPattern: "invite-card",
    path: AUTH_INVITE_EXPIRED_PATH,
    methodIds: ["invitation-expired", "sign-in", "back-to-website"],
  },
  "invite-invalid-page-01": {
    blockId: "invite-invalid-page-01",
    defaultLane: "invite",
    designPattern: "invite-failure-card",
    path: AUTH_INVITE_INVALID_PATH,
    methodIds: ["invitation-invalid", "sign-in", "back-to-website"],
  },
  "invite-consumed-page-01": {
    blockId: "invite-consumed-page-01",
    defaultLane: "invite",
    designPattern: "invite-failure-card",
    path: AUTH_INVITE_CONSUMED_PATH,
    methodIds: ["invitation-consumed", "sign-in", "back-to-website"],
  },
  "invite-email-mismatch-page-01": {
    blockId: "invite-email-mismatch-page-01",
    defaultLane: "invite",
    designPattern: "invite-failure-card",
    path: AUTH_INVITE_EMAIL_MISMATCH_PATH,
    methodIds: ["invitation-email-mismatch", "sign-in", "back-to-website"],
  },
  "passkey-page-01": {
    blockId: "passkey-page-01",
    defaultLane: "access",
    designPattern: "external-auth-card",
    path: AUTH_PASSKEY_PATH,
    methodIds: ["start-passkey", "sign-in"],
  },
  "error-passkey-page-01": {
    blockId: "error-passkey-page-01",
    defaultLane: "error",
    designPattern: "external-auth-card",
    path: AUTH_PASSKEY_ERROR_PATH,
    methodIds: ["error-passkey", "sign-in"],
  },
  "sso-page-01": {
    blockId: "sso-page-01",
    defaultLane: "access",
    designPattern: "external-auth-card",
    path: AUTH_SSO_PATH,
    methodIds: ["start-sso", "sign-in"],
  },
  "error-sso-page-01": {
    blockId: "error-sso-page-01",
    defaultLane: "error",
    designPattern: "external-auth-card",
    path: AUTH_SSO_ERROR_PATH,
    methodIds: ["error-sso", "sign-in"],
  },
  "error-oauth-page-01": {
    blockId: "error-oauth-page-01",
    defaultLane: "error",
    designPattern: "external-auth-card",
    path: AUTH_OAUTH_ERROR_PATH,
    methodIds: ["error-oauth", "sign-in"],
  },
  "otp-page-01": {
    blockId: "otp-page-01",
    defaultLane: "access",
    designPattern: "otp-challenge-card",
    formId: CANONICAL_MFA_OTP_FORM_ID,
    path: AUTH_OTP_PATH,
    methodIds: ["submit-otp", "sign-in"],
  },
  "mfa-page-01": {
    blockId: "mfa-page-01",
    defaultLane: "security",
    designPattern: "mfa-challenge-card",
    formId: CANONICAL_MFA_OTP_FORM_ID,
    path: AUTH_MFA_PATH,
    methodIds: ["submit-mfa-otp", "sign-in"],
  },
  "mfa-recovery-page-01": {
    blockId: "mfa-recovery-page-01",
    defaultLane: "security",
    designPattern: "mfa-challenge-card",
    formId: CANONICAL_MFA_RECOVERY_FORM_ID,
    path: AUTH_MFA_RECOVERY_PATH,
    methodIds: ["submit-mfa-recovery", "sign-in"],
  },
  "error-session-expired-page-01": {
    blockId: "error-session-expired-page-01",
    defaultLane: "security",
    designPattern: "auth-boundary-card",
    path: AUTH_SESSION_EXPIRED_PATH,
    methodIds: ["error-session-expired", "sign-in"],
  },
  "error-access-denied-page-01": {
    blockId: "error-access-denied-page-01",
    defaultLane: "security",
    designPattern: "auth-boundary-card",
    path: AUTH_ACCESS_DENIED_PATH,
    methodIds: ["error-access-denied", "sign-in"],
  },
  "security-review-page-01": {
    blockId: "security-review-page-01",
    defaultLane: "security",
    designPattern: "security-review-card",
    path: AUTH_SECURITY_REVIEW_PATH,
    methodIds: ["security-review", "sign-in"],
  },
  "error-authentication-page-01": {
    blockId: "error-authentication-page-01",
    defaultLane: "error",
    designPattern: "auth-boundary-card",
    path: AUTH_ERROR_PATH,
    methodIds: ["error-authentication", "sign-in"],
  },
} as const satisfies Record<PreLoginPageBlockId, PreLoginPageManifestEntry>;

export const LOGIN_PAGE_BLOCK_IDS = [
  "login-page-01",
  "login-page-02",
  "login-page-03",
  "login-page-04",
  "login-page-05",
  "login-page-06",
] as const satisfies readonly LoginPageBlockId[];

export const REGISTER_PAGE_BLOCK_IDS = [
  "register-page-01",
] as const satisfies readonly RegisterPageBlockId[];

export const RESET_PASSWORD_PAGE_BLOCK_IDS = [
  "forgot-password-page-01",
  "forgot-password-success-page-01",
  "reset-password-page-01",
  "reset-password-success-page-01",
] as const satisfies readonly ResetPasswordPageBlockId[];

export const PRE_LOGIN_PAGE_BLOCK_IDS = [
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
] as const satisfies readonly PreLoginPageBlockId[];

const LOGIN_PAGE_BLOCK_ID_SET: ReadonlySet<AuthPageBlockId> = new Set(
  LOGIN_PAGE_BLOCK_IDS
);
const REGISTER_PAGE_BLOCK_ID_SET: ReadonlySet<AuthPageBlockId> = new Set(
  REGISTER_PAGE_BLOCK_IDS
);
const RESET_PASSWORD_PAGE_BLOCK_ID_SET: ReadonlySet<AuthPageBlockId> = new Set(
  RESET_PASSWORD_PAGE_BLOCK_IDS
);

function isLoginPageBlockId(
  blockId: AuthPageBlockId
): blockId is LoginPageBlockId {
  return LOGIN_PAGE_BLOCK_ID_SET.has(blockId);
}

function isRegisterPageBlockId(
  blockId: AuthPageBlockId
): blockId is RegisterPageBlockId {
  return REGISTER_PAGE_BLOCK_ID_SET.has(blockId);
}

function isResetPasswordPageBlockId(
  blockId: AuthPageBlockId
): blockId is ResetPasswordPageBlockId {
  return RESET_PASSWORD_PAGE_BLOCK_ID_SET.has(blockId);
}

export function getLoginPageManifest(
  blockId: LoginPageBlockId
): LoginPageManifestEntry {
  return LOGIN_PAGE_MANIFEST[blockId];
}

export function getRegisterPageManifest(
  blockId: RegisterPageBlockId
): RegisterPageManifestEntry {
  return REGISTER_PAGE_MANIFEST[blockId];
}

export function getResetPasswordPageManifest(
  blockId: ResetPasswordPageBlockId
): ResetPasswordPageManifestEntry {
  return RESET_PASSWORD_PAGE_MANIFEST[blockId];
}

export function getPreLoginPageManifest(
  blockId: PreLoginPageBlockId
): PreLoginPageManifestEntry {
  return PRE_LOGIN_PAGE_MANIFEST[blockId];
}

export function getLoginMethod(
  methodId: AuthLoginMethodId
): AuthLoginMethodManifestEntry {
  return LOGIN_METHOD_MANIFEST[methodId];
}

export function getLoginMethods(
  methodIds: readonly AuthLoginMethodId[]
): readonly AuthLoginMethodManifestEntry[] {
  return methodIds.map((methodId) => getLoginMethod(methodId));
}

export function getLoginPageMethods(
  blockId: LoginPageBlockId
): readonly AuthLoginMethodManifestEntry[] {
  return getLoginMethods(getLoginPageManifest(blockId).methodIds);
}

export function getRegisterPageMethods(
  blockId: RegisterPageBlockId
): readonly AuthLoginMethodManifestEntry[] {
  return getLoginMethods(getRegisterPageManifest(blockId).methodIds);
}

export function getResetPasswordPageMethods(
  blockId: ResetPasswordPageBlockId
): readonly AuthLoginMethodManifestEntry[] {
  return getLoginMethods(getResetPasswordPageManifest(blockId).methodIds);
}

export function getPreLoginPageMethods(
  blockId: PreLoginPageBlockId
): readonly AuthLoginMethodManifestEntry[] {
  return getLoginMethods(getPreLoginPageManifest(blockId).methodIds);
}

export function getRequiredLoginMethod(
  blockId: AuthPageBlockId,
  methodId: AuthLoginMethodId
): AuthLoginMethodManifestEntry {
  const page = resolveAuthPageManifest(blockId);

  if (!page.methodIds.includes(methodId)) {
    throw new Error(`${blockId} does not declare auth method: ${methodId}`);
  }

  return getLoginMethod(methodId);
}

function resolveAuthPageManifest(
  blockId: AuthPageBlockId
):
  | LoginPageManifestEntry
  | PreLoginPageManifestEntry
  | RegisterPageManifestEntry
  | ResetPasswordPageManifestEntry {
  if (isLoginPageBlockId(blockId)) {
    return getLoginPageManifest(blockId);
  }

  if (isRegisterPageBlockId(blockId)) {
    return getRegisterPageManifest(blockId);
  }

  if (isResetPasswordPageBlockId(blockId)) {
    return getResetPasswordPageManifest(blockId);
  }

  return getPreLoginPageManifest(blockId);
}

export function assertCanonicalLoginForm(blockId: LoginPageBlockId): void {
  const page = getLoginPageManifest(blockId);

  if (page.formId !== CANONICAL_LOGIN_FORM_ID) {
    throw new Error(`${blockId} must render the canonical login form.`);
  }
}

export function assertCanonicalRegisterForm(
  blockId: RegisterPageBlockId
): void {
  const page = getRegisterPageManifest(blockId);

  if (page.formId !== CANONICAL_REGISTER_FORM_ID) {
    throw new Error(`${blockId} must render the canonical register form.`);
  }
}

export function assertCanonicalForgotPasswordForm(
  blockId: ResetPasswordPageBlockId
): void {
  const page = getResetPasswordPageManifest(blockId);

  if (page.formId !== CANONICAL_FORGOT_PASSWORD_FORM_ID) {
    throw new Error(
      `${blockId} must render the canonical forgot password form.`
    );
  }
}

export function assertCanonicalResetPasswordForm(
  blockId: ResetPasswordPageBlockId
): void {
  const page = getResetPasswordPageManifest(blockId);

  if (page.formId !== CANONICAL_RESET_PASSWORD_FORM_ID) {
    throw new Error(
      `${blockId} must render the canonical reset password form.`
    );
  }
}

export function assertCanonicalMfaOtpForm(blockId: PreLoginPageBlockId): void {
  const page = getPreLoginPageManifest(blockId);

  if (page.formId !== CANONICAL_MFA_OTP_FORM_ID) {
    throw new Error(`${blockId} must render the canonical MFA OTP form.`);
  }
}

export function assertCanonicalMfaRecoveryForm(
  blockId: PreLoginPageBlockId
): void {
  const page = getPreLoginPageManifest(blockId);

  if (page.formId !== CANONICAL_MFA_RECOVERY_FORM_ID) {
    throw new Error(`${blockId} must render the canonical MFA recovery form.`);
  }
}

export function assertCanonicalInviteAcceptForm(
  blockId: PreLoginPageBlockId
): void {
  const page = getPreLoginPageManifest(blockId);

  if (page.formId !== CANONICAL_REGISTER_FORM_ID) {
    throw new Error(`${blockId} must render the canonical register form.`);
  }
}
