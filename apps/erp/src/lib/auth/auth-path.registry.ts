export const AUTH_LANES = [
  "access",
  "verify",
  "recover",
  "invite",
  "workspace",
  "security",
] as const;

export type AuthLane = (typeof AUTH_LANES)[number];

export type AuthShellFormLane = "access" | "verify" | "recover" | "error";
export type AuthShellVariant =
  | "login-page-01"
  | "login-page-02"
  | "login-page-03"
  | "login-page-04"
  | "login-page-05"
  | "login-page-06"
  | "register-page-01"
  | "forgot-password-page-01"
  | "forgot-password-success-page-01"
  | "reset-password-page-01"
  | "reset-password-success-page-01"
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

export const AUTH_PATHS = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  otp: "/otp",
  mfa: "/mfa",
  mfaRecovery: "/mfa/recovery",
  verifyEmail: {
    root: "/verify-email",
    sent: "/verify-email/sent",
    expired: "/verify-email/expired",
    success: "/verify-email/success",
  },
  forgotPassword: {
    root: "/forgot-password",
    success: "/forgot-password/success",
  },
  resetPassword: {
    root: "/reset-password",
    success: "/reset-password/success",
  },
  invite: {
    root: "/invite",
    accept: "/invite/accept",
    expired: "/invite/expired",
    invalid: "/invite/invalid",
    consumed: "/invite/consumed",
    emailMismatch: "/invite/email-mismatch",
  },
  passkey: {
    root: "/passkey",
    error: "/passkey/error",
  },
  sso: {
    root: "/sso",
    error: "/sso/error",
  },
  oauth: {
    error: "/oauth/error",
  },
  workspaceSelect: "/workspace/select",
  organizationSelect: "/organization/select",
  sessionExpired: "/session-expired",
  accessDenied: "/access-denied",
  securityReview: "/security/review",
  postAuthComplete: "/auth/complete",
  error: "/error",
} as const;

export type AuthPathKey =
  | "signIn"
  | "signUp"
  | "otp"
  | "mfa"
  | "mfaRecovery"
  | "verifyEmail.root"
  | "verifyEmail.sent"
  | "verifyEmail.expired"
  | "verifyEmail.success"
  | "forgotPassword.root"
  | "forgotPassword.success"
  | "resetPassword.root"
  | "resetPassword.success"
  | "invite.root"
  | "invite.accept"
  | "invite.expired"
  | "invite.invalid"
  | "invite.consumed"
  | "invite.emailMismatch"
  | "passkey.root"
  | "passkey.error"
  | "sso.root"
  | "sso.error"
  | "oauth.error"
  | "workspaceSelect"
  | "organizationSelect"
  | "sessionExpired"
  | "accessDenied"
  | "securityReview"
  | "postAuthComplete"
  | "error";

/** Flat list of every auth-segment pathname for proxy and completeness tests. */
export const AUTH_SEGMENT_PATHS = [
  AUTH_PATHS.signIn,
  AUTH_PATHS.signUp,
  AUTH_PATHS.otp,
  AUTH_PATHS.mfa,
  AUTH_PATHS.mfaRecovery,
  AUTH_PATHS.verifyEmail.root,
  AUTH_PATHS.verifyEmail.sent,
  AUTH_PATHS.verifyEmail.expired,
  AUTH_PATHS.verifyEmail.success,
  AUTH_PATHS.forgotPassword.root,
  AUTH_PATHS.forgotPassword.success,
  AUTH_PATHS.resetPassword.root,
  AUTH_PATHS.resetPassword.success,
  AUTH_PATHS.invite.root,
  AUTH_PATHS.invite.accept,
  AUTH_PATHS.invite.expired,
  AUTH_PATHS.invite.invalid,
  AUTH_PATHS.invite.consumed,
  AUTH_PATHS.invite.emailMismatch,
  AUTH_PATHS.passkey.root,
  AUTH_PATHS.passkey.error,
  AUTH_PATHS.sso.root,
  AUTH_PATHS.sso.error,
  AUTH_PATHS.oauth.error,
  AUTH_PATHS.workspaceSelect,
  AUTH_PATHS.organizationSelect,
  AUTH_PATHS.sessionExpired,
  AUTH_PATHS.accessDenied,
  AUTH_PATHS.securityReview,
  AUTH_PATHS.error,
] as const;

export const AUTH_PATH_LANE_MAP: Record<
  (typeof AUTH_SEGMENT_PATHS)[number],
  AuthLane
> = {
  [AUTH_PATHS.signIn]: "access",
  [AUTH_PATHS.signUp]: "access",
  [AUTH_PATHS.otp]: "access",
  [AUTH_PATHS.mfa]: "security",
  [AUTH_PATHS.mfaRecovery]: "security",
  [AUTH_PATHS.verifyEmail.root]: "verify",
  [AUTH_PATHS.verifyEmail.sent]: "verify",
  [AUTH_PATHS.verifyEmail.expired]: "verify",
  [AUTH_PATHS.verifyEmail.success]: "verify",
  [AUTH_PATHS.forgotPassword.root]: "recover",
  [AUTH_PATHS.forgotPassword.success]: "recover",
  [AUTH_PATHS.resetPassword.root]: "recover",
  [AUTH_PATHS.resetPassword.success]: "recover",
  [AUTH_PATHS.invite.root]: "invite",
  [AUTH_PATHS.invite.accept]: "invite",
  [AUTH_PATHS.invite.expired]: "invite",
  [AUTH_PATHS.invite.invalid]: "invite",
  [AUTH_PATHS.invite.consumed]: "invite",
  [AUTH_PATHS.invite.emailMismatch]: "invite",
  [AUTH_PATHS.passkey.root]: "access",
  [AUTH_PATHS.passkey.error]: "security",
  [AUTH_PATHS.sso.root]: "access",
  [AUTH_PATHS.sso.error]: "security",
  [AUTH_PATHS.oauth.error]: "security",
  [AUTH_PATHS.workspaceSelect]: "workspace",
  [AUTH_PATHS.organizationSelect]: "workspace",
  [AUTH_PATHS.sessionExpired]: "security",
  [AUTH_PATHS.accessDenied]: "security",
  [AUTH_PATHS.securityReview]: "security",
  [AUTH_PATHS.error]: "security",
};

export const AUTH_FORM_LANE_LABEL: Record<AuthShellFormLane, string> = {
  access: "Access",
  verify: "Verify",
  recover: "Recovery",
  error: "Error",
};

export const AUTH_PATH_FORM_VARIANT_MAP: Record<
  (typeof AUTH_SEGMENT_PATHS)[number],
  AuthShellVariant
> = {
  [AUTH_PATHS.signIn]: "login-page-04",
  [AUTH_PATHS.signUp]: "register-page-01",
  [AUTH_PATHS.otp]: "otp-page-01",
  [AUTH_PATHS.mfa]: "mfa-page-01",
  [AUTH_PATHS.mfaRecovery]: "mfa-recovery-page-01",
  [AUTH_PATHS.verifyEmail.root]: "verify-email-page-01",
  [AUTH_PATHS.verifyEmail.sent]: "verify-email-sent-page-01",
  [AUTH_PATHS.verifyEmail.expired]: "verify-email-expired-page-01",
  [AUTH_PATHS.verifyEmail.success]: "verify-email-success-page-01",
  [AUTH_PATHS.forgotPassword.root]: "forgot-password-page-01",
  [AUTH_PATHS.forgotPassword.success]: "forgot-password-success-page-01",
  [AUTH_PATHS.resetPassword.root]: "reset-password-page-01",
  [AUTH_PATHS.resetPassword.success]: "reset-password-success-page-01",
  [AUTH_PATHS.invite.root]: "invite-page-01",
  [AUTH_PATHS.invite.accept]: "invite-accept-page-01",
  [AUTH_PATHS.invite.expired]: "invite-expired-page-01",
  [AUTH_PATHS.invite.invalid]: "invite-invalid-page-01",
  [AUTH_PATHS.invite.consumed]: "invite-consumed-page-01",
  [AUTH_PATHS.invite.emailMismatch]: "invite-email-mismatch-page-01",
  [AUTH_PATHS.passkey.root]: "passkey-page-01",
  [AUTH_PATHS.passkey.error]: "error-passkey-page-01",
  [AUTH_PATHS.sso.root]: "sso-page-01",
  [AUTH_PATHS.sso.error]: "error-sso-page-01",
  [AUTH_PATHS.oauth.error]: "error-oauth-page-01",
  [AUTH_PATHS.workspaceSelect]: "login-page-03",
  [AUTH_PATHS.organizationSelect]: "login-page-03",
  [AUTH_PATHS.sessionExpired]: "error-session-expired-page-01",
  [AUTH_PATHS.accessDenied]: "error-access-denied-page-01",
  [AUTH_PATHS.securityReview]: "security-review-page-01",
  [AUTH_PATHS.error]: "error-authentication-page-01",
};

export function resolveAuthShellVariantForPath(
  pathname: string
): AuthShellVariant {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const entry = AUTH_SEGMENT_PATHS.find((path) => path === normalized);

  if (entry === undefined) {
    return "login-page-04";
  }

  return AUTH_PATH_FORM_VARIANT_MAP[entry];
}

export function resolveAuthShellBlockIdForPath(pathname: string): string {
  return resolveAuthShellVariantForPath(pathname);
}

export function authFormEyebrow(lane: AuthShellFormLane, path: string): string {
  return `${AUTH_FORM_LANE_LABEL[lane]} Lane · ${path}`;
}

export function buildAuthPath(
  key: AuthPathKey,
  query?: Record<string, string | undefined>
): string {
  const path = resolveAuthPathString(key);
  if (query === undefined) {
    return path;
  }

  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value.length > 0) {
      params.set(name, value);
    }
  }

  const serialized = params.toString();
  return serialized.length > 0 ? `${path}?${serialized}` : path;
}

function resolveAuthPathString(key: AuthPathKey): string {
  switch (key) {
    case "signIn":
      return AUTH_PATHS.signIn;
    case "signUp":
      return AUTH_PATHS.signUp;
    case "otp":
      return AUTH_PATHS.otp;
    case "mfa":
      return AUTH_PATHS.mfa;
    case "mfaRecovery":
      return AUTH_PATHS.mfaRecovery;
    case "verifyEmail.root":
      return AUTH_PATHS.verifyEmail.root;
    case "verifyEmail.sent":
      return AUTH_PATHS.verifyEmail.sent;
    case "verifyEmail.expired":
      return AUTH_PATHS.verifyEmail.expired;
    case "verifyEmail.success":
      return AUTH_PATHS.verifyEmail.success;
    case "forgotPassword.root":
      return AUTH_PATHS.forgotPassword.root;
    case "forgotPassword.success":
      return AUTH_PATHS.forgotPassword.success;
    case "resetPassword.root":
      return AUTH_PATHS.resetPassword.root;
    case "resetPassword.success":
      return AUTH_PATHS.resetPassword.success;
    case "invite.root":
      return AUTH_PATHS.invite.root;
    case "invite.accept":
      return AUTH_PATHS.invite.accept;
    case "invite.expired":
      return AUTH_PATHS.invite.expired;
    case "invite.invalid":
      return AUTH_PATHS.invite.invalid;
    case "invite.consumed":
      return AUTH_PATHS.invite.consumed;
    case "invite.emailMismatch":
      return AUTH_PATHS.invite.emailMismatch;
    case "passkey.root":
      return AUTH_PATHS.passkey.root;
    case "passkey.error":
      return AUTH_PATHS.passkey.error;
    case "sso.root":
      return AUTH_PATHS.sso.root;
    case "sso.error":
      return AUTH_PATHS.sso.error;
    case "oauth.error":
      return AUTH_PATHS.oauth.error;
    case "workspaceSelect":
      return AUTH_PATHS.workspaceSelect;
    case "organizationSelect":
      return AUTH_PATHS.organizationSelect;
    case "sessionExpired":
      return AUTH_PATHS.sessionExpired;
    case "accessDenied":
      return AUTH_PATHS.accessDenied;
    case "securityReview":
      return AUTH_PATHS.securityReview;
    case "postAuthComplete":
      return AUTH_PATHS.postAuthComplete;
    case "error":
      return AUTH_PATHS.error;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

export const AUTH_FORM_SIGN_IN_LINK = AUTH_PATHS.signIn;

export const AUTH_FORM_SIGN_IN_PASSWORD_RESET_NOTICE_LINK = buildAuthPath(
  "signIn",
  { notice: "password-reset" }
);

export const AUTH_FORM_SIGN_IN_VERIFY_EMAIL_NOTICE_LINK = buildAuthPath(
  "signIn",
  { notice: "verify-email" }
);
