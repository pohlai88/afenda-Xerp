import type { AuthRouteId } from "./auth-route.registry";

export type AuthBlockIntent = "access" | "verify" | "recover" | "error";

export type AuthFormStateName =
  | "idle"
  | "submitting"
  | "success"
  | "invalid"
  | "error"
  | "forbidden"
  | "expired";

export interface AuthBlockEntry {
  readonly allowedStates: readonly AuthFormStateName[];
  readonly id: string;
  readonly intent: AuthBlockIntent;
  readonly primaryActionLabel: string;
}

// Compile-time guard: every AuthRouteId must have a block entry.
// If a new route is added to AUTH_ROUTE_REGISTRY without a matching entry here,
// the type assignment below will produce a TS error.
type _AssertAllRoutesCovered = {
  [K in AuthRouteId]: AuthBlockEntry;
};

export const AUTH_BLOCK_REGISTRY = {
  signIn: {
    id: "sign-in",
    intent: "access",
    primaryActionLabel: "Sign in with email",
    allowedStates: ["idle", "submitting", "error", "invalid"],
  },
  signUp: {
    id: "sign-up",
    intent: "access",
    primaryActionLabel: "Create account",
    allowedStates: ["idle", "submitting", "error", "invalid"],
  },
  verifyEmailSent: {
    id: "verify-email-sent",
    intent: "verify",
    primaryActionLabel: "Return to sign in",
    allowedStates: ["idle"],
  },
  forgotPassword: {
    id: "forgot-password",
    intent: "recover",
    primaryActionLabel: "Send reset link",
    allowedStates: ["idle", "submitting", "success", "error"],
  },
  resetPassword: {
    id: "reset-password",
    intent: "recover",
    primaryActionLabel: "Set new password",
    allowedStates: [
      "idle",
      "submitting",
      "success",
      "error",
      "invalid",
      "expired",
    ],
  },
  resetPasswordSuccess: {
    id: "reset-password-success",
    intent: "recover",
    primaryActionLabel: "Return to sign in",
    allowedStates: ["idle", "success"],
  },
  otp: {
    id: "otp",
    intent: "access",
    primaryActionLabel: "Verify code",
    allowedStates: ["idle", "submitting", "error", "invalid"],
  },
  mfa: {
    id: "mfa",
    intent: "verify",
    primaryActionLabel: "Verify code",
    allowedStates: ["idle", "submitting", "error", "invalid"],
  },
  mfaRecovery: {
    id: "mfa-recovery",
    intent: "recover",
    primaryActionLabel: "Use backup code",
    allowedStates: ["idle", "submitting", "error", "invalid"],
  },
  verifyEmail: {
    id: "verify-email",
    intent: "verify",
    primaryActionLabel: "Verify email",
    allowedStates: ["idle", "submitting", "success", "error"],
  },
  verifyEmailExpired: {
    id: "verify-email-expired",
    intent: "error",
    primaryActionLabel: "Return to sign in",
    allowedStates: ["idle", "error", "expired"],
  },
  verifyEmailSuccess: {
    id: "verify-email-success",
    intent: "verify",
    primaryActionLabel: "Continue to sign in",
    allowedStates: ["idle", "success"],
  },
  sessionExpired: {
    id: "session-expired",
    intent: "error",
    primaryActionLabel: "Return to sign in",
    allowedStates: ["idle", "error", "expired"],
  },
  accessDenied: {
    id: "access-denied",
    intent: "error",
    primaryActionLabel: "Return to sign in",
    allowedStates: ["idle", "forbidden"],
  },
  securityReview: {
    id: "security-review",
    intent: "error",
    primaryActionLabel: "Continue",
    allowedStates: ["idle", "submitting", "success", "error"],
  },
  invite: {
    id: "invite",
    intent: "access",
    primaryActionLabel: "Accept invitation",
    allowedStates: ["idle", "submitting", "success", "error"],
  },
  inviteExpired: {
    id: "invite-expired",
    intent: "error",
    primaryActionLabel: "Return to sign in",
    allowedStates: ["idle", "error", "expired"],
  },
  workspaceSelect: {
    id: "workspace-select",
    intent: "access",
    primaryActionLabel: "Continue to workspace",
    allowedStates: ["idle", "submitting", "error"],
  },
  organizationSelect: {
    id: "organization-select",
    intent: "access",
    primaryActionLabel: "Continue to organization",
    allowedStates: ["idle", "submitting", "error"],
  },
} as const satisfies Record<string, AuthBlockEntry> & _AssertAllRoutesCovered;
