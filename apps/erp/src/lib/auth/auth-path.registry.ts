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
  forgotPassword: "/forgot-password",
  resetPassword: {
    root: "/reset-password",
    success: "/reset-password/success",
  },
  invite: {
    root: "/invite",
    accept: "/invite/accept",
    expired: "/invite/expired",
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
  | "forgotPassword"
  | "resetPassword.root"
  | "resetPassword.success"
  | "invite.root"
  | "invite.accept"
  | "invite.expired"
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
  AUTH_PATHS.forgotPassword,
  AUTH_PATHS.resetPassword.root,
  AUTH_PATHS.resetPassword.success,
  AUTH_PATHS.invite.root,
  AUTH_PATHS.invite.accept,
  AUTH_PATHS.invite.expired,
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
  [AUTH_PATHS.forgotPassword]: "recover",
  [AUTH_PATHS.resetPassword.root]: "recover",
  [AUTH_PATHS.resetPassword.success]: "recover",
  [AUTH_PATHS.invite.root]: "invite",
  [AUTH_PATHS.invite.accept]: "invite",
  [AUTH_PATHS.invite.expired]: "invite",
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
    case "forgotPassword":
      return AUTH_PATHS.forgotPassword;
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
