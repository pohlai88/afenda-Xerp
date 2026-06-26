import type {
  AuthShellEntryLane,
  AuthShellSerializableCopy,
} from "@afenda/appshell/auth-shell";
import type { Metadata } from "next";

import { internalErpMetadata } from "@/lib/metadata/site-metadata";

import { AUTH_PATHS, authFormEyebrow } from "./auth-path.registry";

function authRouteMetadata(title: string): Metadata {
  return {
    title,
    ...internalErpMetadata,
  };
}

/** Serializable route copy aligned with `@afenda/appshell/auth-shell` lane contracts. */
export interface AuthRouteEntryCopy
  extends Required<AuthShellSerializableCopy> {
  readonly lane: AuthShellEntryLane;
}

type AuthRouteFormEntry = AuthShellSerializableCopy & {
  readonly metadata: Metadata;
  readonly lane: AuthShellEntryLane;
  readonly skeletonLabel: string;
};

export const AUTH_ROUTE_REGISTRY = {
  signIn: {
    eyebrow: authFormEyebrow("access", AUTH_PATHS.signIn),
    title: "Sign in to Afenda ERP",
    description:
      "Authenticate with your organization credentials to enter your workspace.",
    metadata: authRouteMetadata("Sign in"),
    lane: "access",
    skeletonLabel: "Loading sign-in…",
  },
  signUp: {
    eyebrow: authFormEyebrow("access", AUTH_PATHS.signUp),
    title: "Create account",
    description: "Complete your profile to join your organization workspace.",
    metadata: authRouteMetadata("Create account"),
    lane: "access",
    skeletonLabel: "Loading sign-up…",
  },
  verifyEmailSent: {
    eyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.sent),
    title: "Check your inbox",
    description:
      "We sent a verification link. Open it from the same device when you are ready.",
    metadata: authRouteMetadata("Verify email sent"),
    lane: "verify",
    skeletonLabel: "Loading…",
  },
  forgotPassword: {
    eyebrow: authFormEyebrow("recover", AUTH_PATHS.forgotPassword),
    title: "Reset your password",
    description: "Enter the email associated with your Afenda account.",
    metadata: authRouteMetadata("Forgot password"),
    lane: "recover",
    skeletonLabel: "Loading recovery…",
  },
  resetPassword: {
    eyebrow: authFormEyebrow("recover", AUTH_PATHS.resetPassword.root),
    title: "Choose a new password",
    description:
      "Create a strong password to restore access to your Afenda workspace.",
    metadata: authRouteMetadata("Reset password"),
    lane: "recover",
    skeletonLabel: "Loading reset form…",
  },
  resetPasswordSuccess: {
    eyebrow: authFormEyebrow("recover", AUTH_PATHS.resetPassword.success),
    title: "Password updated",
    description: "Your password has been updated. You can sign in with it now.",
    metadata: authRouteMetadata("Password updated"),
    lane: "recover",
    skeletonLabel: "Loading…",
  },
  otp: {
    eyebrow: authFormEyebrow("access", AUTH_PATHS.otp),
    title: "One-time passcode",
    description: "Enter the sign-in code sent to your email.",
    metadata: authRouteMetadata("One-time passcode"),
    lane: "access",
    skeletonLabel: "Loading passcode…",
  },
  mfa: {
    eyebrow: authFormEyebrow("access", AUTH_PATHS.mfa),
    title: "Verify your identity",
    description:
      "Complete multi-factor verification to continue into your workspace.",
    metadata: authRouteMetadata("Verify identity"),
    lane: "access",
    skeletonLabel: "Loading verification…",
  },
  mfaRecovery: {
    eyebrow: authFormEyebrow("access", AUTH_PATHS.mfaRecovery),
    title: "Recovery code",
    description: "Enter a backup recovery code to complete sign-in.",
    metadata: authRouteMetadata("MFA recovery"),
    lane: "access",
    skeletonLabel: "Loading recovery…",
  },
  verifyEmail: {
    eyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.root),
    title: "Verify your email",
    description:
      "One more step before you can enter your workspace. Open the verification link we sent to your inbox.",
    metadata: authRouteMetadata("Verify your email"),
    lane: "verify",
    skeletonLabel: "Loading verification…",
  },
  verifyEmailExpired: {
    eyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.expired),
    title: "Link expired",
    description:
      "This verification link is no longer valid. Request a new link or sign in if you have already verified.",
    metadata: authRouteMetadata("Verification expired"),
    lane: "verify",
    skeletonLabel: "Loading…",
  },
  verifyEmailSuccess: {
    eyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.success),
    title: "Email verified",
    description:
      "Your email address is confirmed. Sign in to enter your Afenda ERP workspace.",
    metadata: authRouteMetadata("Email verified"),
    lane: "verify",
    skeletonLabel: "Loading…",
  },
  sessionExpired: {
    eyebrow: authFormEyebrow("error", AUTH_PATHS.sessionExpired),
    title: "Session expired",
    description: "Your session expired. Sign in again to continue securely.",
    metadata: authRouteMetadata("Session expired"),
    lane: "error",
    skeletonLabel: "Loading…",
  },
  accessDenied: {
    eyebrow: authFormEyebrow("error", AUTH_PATHS.accessDenied),
    title: "Access cannot be granted",
    description:
      "Your identity is valid, but this workspace does not currently allow entry.",
    metadata: authRouteMetadata("Access denied"),
    lane: "error",
    skeletonLabel: "Loading…",
  },
  securityReview: {
    eyebrow: authFormEyebrow("error", AUTH_PATHS.securityReview),
    title: "Security review",
    description:
      "A security review is required before you can continue into Afenda ERP.",
    metadata: authRouteMetadata("Security review"),
    lane: "error",
    skeletonLabel: "Loading…",
  },
  invite: {
    eyebrow: `Invite · ${AUTH_PATHS.invite.root}`,
    title: "Workspace invitation",
    description:
      "You have been invited to join an Afenda ERP workspace. Accept the invitation to continue.",
    metadata: authRouteMetadata("Invitation"),
    lane: "access",
    skeletonLabel: "Loading invitation…",
  },
  inviteExpired: {
    eyebrow: `Invite · ${AUTH_PATHS.invite.expired}`,
    title: "Invitation expired",
    description:
      "This invitation link is no longer valid. Ask your administrator to send a new invitation.",
    metadata: authRouteMetadata("Invitation expired"),
    lane: "access",
    skeletonLabel: "Loading…",
  },
  workspaceSelect: {
    eyebrow: `Workspace · ${AUTH_PATHS.workspaceSelect}`,
    title: "Choose workspace",
    description:
      "Select the workspace you want to enter before continuing into Afenda ERP.",
    metadata: authRouteMetadata("Workspace selection"),
    lane: "access",
    skeletonLabel: "Loading workspaces…",
  },
  organizationSelect: {
    eyebrow: `Organization · ${AUTH_PATHS.organizationSelect}`,
    title: "Choose organization",
    description:
      "Select the organization context you want to work in before entering your workspace.",
    metadata: authRouteMetadata("Organization selection"),
    lane: "access",
    skeletonLabel: "Loading organizations…",
  },
} as const satisfies Record<string, AuthRouteFormEntry>;

export type AuthRouteId = keyof typeof AUTH_ROUTE_REGISTRY;

export function resolveAuthRouteCopy(route: AuthRouteId): AuthRouteEntryCopy {
  const entry = AUTH_ROUTE_REGISTRY[route];
  return {
    description: entry.description,
    eyebrow: entry.eyebrow,
    title: entry.title,
    lane: entry.lane,
  };
}
