export const AUTH_V2_PATHS = {
  signIn: "/v2/sign-in",
  signUp: "/v2/sign-up",
  otp: "/v2/otp",
  mfa: "/v2/mfa",
  mfaRecovery: "/v2/mfa/recovery",
  verifyEmail: {
    root: "/v2/verify-email",
    sent: "/v2/verify-email/sent",
    expired: "/v2/verify-email/expired",
    success: "/v2/verify-email/success",
  },
  forgotPassword: "/v2/forgot-password",
  resetPassword: {
    root: "/v2/reset-password",
    success: "/v2/reset-password/success",
  },
  invite: {
    root: "/v2/invite",
    accept: "/v2/invite/accept",
    expired: "/v2/invite/expired",
  },
  workspaceSelect: "/v2/workspace/select",
  organizationSelect: "/v2/organization/select",
  accessDenied: "/v2/access-denied",
  sessionExpired: "/v2/session-expired",
  securityReview: "/v2/security/review",
  postAuthComplete: "/v2/auth/complete",
  error: "/v2/error",
} as const;

export type AuthV2ShellLane = "access" | "verify" | "recover" | "error";

export type AuthV2PathKey =
  | "signIn"
  | "signUp"
  | "otp"
  | "mfa"
  | "mfaRecovery"
  | "verifyEmail.root"
  | "verifyEmail.sent"
  | "verifyEmail.expired"
  | "verifyEmail.success"
  | "forgotPassword"
  | "resetPassword.root"
  | "resetPassword.success"
  | "invite.root"
  | "invite.accept"
  | "invite.expired"
  | "workspaceSelect"
  | "organizationSelect"
  | "accessDenied"
  | "sessionExpired"
  | "securityReview"
  | "postAuthComplete"
  | "error";

export const AUTH_V2_SEGMENT_PATHS = [
  AUTH_V2_PATHS.signIn,
  AUTH_V2_PATHS.signUp,
  AUTH_V2_PATHS.otp,
  AUTH_V2_PATHS.mfa,
  AUTH_V2_PATHS.mfaRecovery,
  AUTH_V2_PATHS.verifyEmail.root,
  AUTH_V2_PATHS.verifyEmail.sent,
  AUTH_V2_PATHS.verifyEmail.expired,
  AUTH_V2_PATHS.verifyEmail.success,
  AUTH_V2_PATHS.forgotPassword,
  AUTH_V2_PATHS.resetPassword.root,
  AUTH_V2_PATHS.resetPassword.success,
  AUTH_V2_PATHS.invite.root,
  AUTH_V2_PATHS.invite.accept,
  AUTH_V2_PATHS.invite.expired,
  AUTH_V2_PATHS.workspaceSelect,
  AUTH_V2_PATHS.organizationSelect,
  AUTH_V2_PATHS.accessDenied,
  AUTH_V2_PATHS.sessionExpired,
  AUTH_V2_PATHS.securityReview,
  AUTH_V2_PATHS.error,
] as const;

export const AUTH_V2_LANE_LABEL: Record<AuthV2ShellLane, string> = {
  access: "Access",
  verify: "Verify",
  recover: "Recovery",
  error: "Error",
};

export function authV2FormEyebrow(lane: AuthV2ShellLane, path: string): string {
  return `${AUTH_V2_LANE_LABEL[lane]} Lane · ${path}`;
}

function resolveAuthV2PathString(key: AuthV2PathKey): string {
  switch (key) {
    case "signIn":
      return AUTH_V2_PATHS.signIn;
    case "signUp":
      return AUTH_V2_PATHS.signUp;
    case "otp":
      return AUTH_V2_PATHS.otp;
    case "mfa":
      return AUTH_V2_PATHS.mfa;
    case "mfaRecovery":
      return AUTH_V2_PATHS.mfaRecovery;
    case "verifyEmail.root":
      return AUTH_V2_PATHS.verifyEmail.root;
    case "verifyEmail.sent":
      return AUTH_V2_PATHS.verifyEmail.sent;
    case "verifyEmail.expired":
      return AUTH_V2_PATHS.verifyEmail.expired;
    case "verifyEmail.success":
      return AUTH_V2_PATHS.verifyEmail.success;
    case "forgotPassword":
      return AUTH_V2_PATHS.forgotPassword;
    case "resetPassword.root":
      return AUTH_V2_PATHS.resetPassword.root;
    case "resetPassword.success":
      return AUTH_V2_PATHS.resetPassword.success;
    case "invite.root":
      return AUTH_V2_PATHS.invite.root;
    case "invite.accept":
      return AUTH_V2_PATHS.invite.accept;
    case "invite.expired":
      return AUTH_V2_PATHS.invite.expired;
    case "workspaceSelect":
      return AUTH_V2_PATHS.workspaceSelect;
    case "organizationSelect":
      return AUTH_V2_PATHS.organizationSelect;
    case "accessDenied":
      return AUTH_V2_PATHS.accessDenied;
    case "sessionExpired":
      return AUTH_V2_PATHS.sessionExpired;
    case "securityReview":
      return AUTH_V2_PATHS.securityReview;
    case "postAuthComplete":
      return AUTH_V2_PATHS.postAuthComplete;
    case "error":
      return AUTH_V2_PATHS.error;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

export function buildAuthV2Path(
  key: AuthV2PathKey,
  query?: Record<string, string | undefined>
): string {
  const path = resolveAuthV2PathString(key);
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

export const AUTH_V2_FORM_SIGN_IN_LINK = AUTH_V2_PATHS.signIn;

export const AUTH_V2_FORM_SIGN_IN_PASSWORD_RESET_NOTICE_LINK = buildAuthV2Path(
  "signIn",
  { notice: "password-reset" }
);

export const AUTH_V2_FORM_SIGN_IN_VERIFY_EMAIL_NOTICE_LINK = buildAuthV2Path(
  "signIn",
  { notice: "verify-email" }
);
