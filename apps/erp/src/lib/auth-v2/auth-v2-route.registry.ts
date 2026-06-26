import type {
  AuthShellEntryLane,
  AuthShellSerializableCopy,
} from "@afenda/appshell/auth-shell-v2";
import type { Metadata } from "next";

import { internalErpMetadata } from "@/lib/metadata/site-metadata";

import { AUTH_V2_PATHS, authV2FormEyebrow } from "./auth-v2-path.registry";

function authV2RouteMetadata(title: string): Metadata {
  return {
    title,
    ...internalErpMetadata,
  };
}

/** Serializable route copy aligned with `@afenda/appshell/auth-shell-v2` lane contracts. */
export interface AuthV2RouteEntryCopy
  extends Required<AuthShellSerializableCopy> {
  readonly lane: AuthShellEntryLane;
}

type AuthV2RouteFormEntry = AuthShellSerializableCopy & {
  readonly metadata: Metadata;
  readonly lane: AuthShellEntryLane;
  readonly skeletonLabel: string;
};

export const AUTH_V2_ROUTE_REGISTRY = {
  signIn: {
    eyebrow: authV2FormEyebrow("access", AUTH_V2_PATHS.signIn),
    title: "Sign in to Afenda ERP",
    description:
      "Authenticate with your organization credentials to enter your workspace.",
    metadata: authV2RouteMetadata("Sign in (V2)"),
    lane: "access",
    skeletonLabel: "Loading sign-in…",
  },
  signUp: {
    eyebrow: authV2FormEyebrow("access", AUTH_V2_PATHS.signUp),
    title: "Create account",
    description: "Complete your profile to join your organization workspace.",
    metadata: authV2RouteMetadata("Create account (V2)"),
    lane: "access",
    skeletonLabel: "Loading sign-up…",
  },
  verifyEmailSent: {
    eyebrow: authV2FormEyebrow("verify", AUTH_V2_PATHS.verifyEmail.sent),
    title: "Check your inbox",
    description:
      "We sent a verification link. Open it from the same device when you are ready.",
    metadata: authV2RouteMetadata("Verify email sent (V2)"),
    lane: "verify",
    skeletonLabel: "Loading…",
  },
  forgotPassword: {
    eyebrow: authV2FormEyebrow("recover", AUTH_V2_PATHS.forgotPassword),
    title: "Reset your password",
    description: "Enter the email associated with your Afenda account.",
    metadata: authV2RouteMetadata("Forgot password (V2)"),
    lane: "recover",
    skeletonLabel: "Loading recovery…",
  },
  resetPassword: {
    eyebrow: authV2FormEyebrow("recover", AUTH_V2_PATHS.resetPassword.root),
    title: "Choose a new password",
    description:
      "Create a strong password to restore access to your Afenda workspace.",
    metadata: authV2RouteMetadata("Reset password (V2)"),
    lane: "recover",
    skeletonLabel: "Loading reset form…",
  },
  resetPasswordSuccess: {
    eyebrow: authV2FormEyebrow("recover", AUTH_V2_PATHS.resetPassword.success),
    title: "Password updated",
    description: "Your password has been updated. You can sign in with it now.",
    metadata: authV2RouteMetadata("Password updated (V2)"),
    lane: "recover",
    skeletonLabel: "Loading…",
  },
  otp: {
    eyebrow: authV2FormEyebrow("access", AUTH_V2_PATHS.otp),
    title: "One-time passcode",
    description: "Enter the sign-in code sent to your email.",
    metadata: authV2RouteMetadata("One-time passcode (V2)"),
    lane: "access",
    skeletonLabel: "Loading passcode…",
  },
  mfa: {
    eyebrow: authV2FormEyebrow("access", AUTH_V2_PATHS.mfa),
    title: "Verify your identity",
    description:
      "Complete multi-factor verification to continue into your workspace.",
    metadata: authV2RouteMetadata("Verify identity (V2)"),
    lane: "access",
    skeletonLabel: "Loading verification…",
  },
  mfaRecovery: {
    eyebrow: authV2FormEyebrow("access", AUTH_V2_PATHS.mfaRecovery),
    title: "Recovery code",
    description: "Enter a backup recovery code to complete sign-in.",
    metadata: authV2RouteMetadata("MFA recovery (V2)"),
    lane: "access",
    skeletonLabel: "Loading recovery…",
  },
  verifyEmail: {
    eyebrow: authV2FormEyebrow("verify", AUTH_V2_PATHS.verifyEmail.root),
    title: "Verify your email",
    description:
      "One more step before you can enter your workspace. Open the verification link we sent to your inbox.",
    metadata: authV2RouteMetadata("Verify your email (V2)"),
    lane: "verify",
    skeletonLabel: "Loading verification…",
  },
  verifyEmailExpired: {
    eyebrow: authV2FormEyebrow("verify", AUTH_V2_PATHS.verifyEmail.expired),
    title: "Link expired",
    description:
      "This verification link is no longer valid. Request a new link or sign in if you have already verified.",
    metadata: authV2RouteMetadata("Verification expired (V2)"),
    lane: "verify",
    skeletonLabel: "Loading…",
  },
  verifyEmailSuccess: {
    eyebrow: authV2FormEyebrow("verify", AUTH_V2_PATHS.verifyEmail.success),
    title: "Email verified",
    description:
      "Your email address is confirmed. Sign in to enter your Afenda ERP workspace.",
    metadata: authV2RouteMetadata("Email verified (V2)"),
    lane: "verify",
    skeletonLabel: "Loading…",
  },
  sessionExpired: {
    eyebrow: authV2FormEyebrow("error", AUTH_V2_PATHS.sessionExpired),
    title: "Session expired",
    description: "Your session expired. Sign in again to continue securely.",
    metadata: authV2RouteMetadata("Session expired (V2)"),
    lane: "error",
    skeletonLabel: "Loading…",
  },
  accessDenied: {
    eyebrow: authV2FormEyebrow("error", AUTH_V2_PATHS.accessDenied),
    title: "Access cannot be granted",
    description:
      "Your identity is valid, but this workspace does not currently allow entry.",
    metadata: authV2RouteMetadata("Access denied (V2)"),
    lane: "error",
    skeletonLabel: "Loading…",
  },
  securityReview: {
    eyebrow: authV2FormEyebrow("error", AUTH_V2_PATHS.securityReview),
    title: "Security review",
    description:
      "A security review is required before you can continue into Afenda ERP.",
    metadata: authV2RouteMetadata("Security review (V2)"),
    lane: "error",
    skeletonLabel: "Loading…",
  },
  invite: {
    eyebrow: `Invite · ${AUTH_V2_PATHS.invite.root}`,
    title: "Workspace invitation",
    description:
      "You have been invited to join an Afenda ERP workspace. Accept the invitation to continue.",
    metadata: authV2RouteMetadata("Invitation (V2)"),
    lane: "access",
    skeletonLabel: "Loading invitation…",
  },
  inviteExpired: {
    eyebrow: `Invite · ${AUTH_V2_PATHS.invite.expired}`,
    title: "Invitation expired",
    description:
      "This invitation link is no longer valid. Ask your administrator to send a new invitation.",
    metadata: authV2RouteMetadata("Invitation expired (V2)"),
    lane: "access",
    skeletonLabel: "Loading…",
  },
  workspaceSelect: {
    eyebrow: `Workspace · ${AUTH_V2_PATHS.workspaceSelect}`,
    title: "Choose workspace",
    description:
      "Select the workspace you want to enter before continuing into Afenda ERP.",
    metadata: authV2RouteMetadata("Workspace selection (V2)"),
    lane: "access",
    skeletonLabel: "Loading workspaces…",
  },
  organizationSelect: {
    eyebrow: `Organization · ${AUTH_V2_PATHS.organizationSelect}`,
    title: "Choose organization",
    description:
      "Select the organization context you want to work in before entering your workspace.",
    metadata: authV2RouteMetadata("Organization selection (V2)"),
    lane: "access",
    skeletonLabel: "Loading organizations…",
  },
} as const satisfies Record<string, AuthV2RouteFormEntry>;

export type AuthV2RouteId = keyof typeof AUTH_V2_ROUTE_REGISTRY;

export function resolveAuthV2RouteCopy(
  route: AuthV2RouteId
): AuthV2RouteEntryCopy {
  const entry = AUTH_V2_ROUTE_REGISTRY[route];
  return {
    description: entry.description,
    eyebrow: entry.eyebrow,
    title: entry.title,
    lane: entry.lane,
  };
}
