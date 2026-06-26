import type { Metadata } from "next";
import type { ReactNode } from "react";

import { internalErpMetadata } from "@/lib/metadata/site-metadata";

import { AUTH_PATHS, type AuthLane } from "./auth-path.registry";

function authRouteMetadata(title: string): Metadata {
  return {
    title,
    ...internalErpMetadata,
  };
}

const AUTH_LANE_EYEBROW_LABEL: Record<AuthLane, string> = {
  access: "Access",
  verify: "Verify",
  recover: "Recovery",
  invite: "Invite",
  workspace: "Workspace",
  security: "Security",
};

function authFormEyebrow(lane: AuthLane, path: string): string {
  return `${AUTH_LANE_EYEBROW_LABEL[lane]} Lane · ${path}`;
}

export type AuthRouteStatusVariant = "form" | "status" | "error" | "success";

export interface AuthRouteEntryCopy {
  readonly formDescription: ReactNode;
  readonly formEyebrow: ReactNode;
  readonly formHeading: ReactNode;
}

type AuthRouteRegistryFormEntry = {
  readonly formDescription: string;
  readonly formEyebrow: string;
  readonly formHeading: string;
  readonly metadata: Metadata;
  readonly lane: AuthLane;
  readonly statusVariant: AuthRouteStatusVariant;
  readonly skeletonLabel: string;
};

type AuthRouteFormEntry = AuthRouteRegistryFormEntry;

type AuthRouteSegmentErrorEntry = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly retryLabel: string;
  readonly metadata: Metadata;
  readonly lane: "security";
  readonly statusVariant: "error";
};

export const AUTH_ROUTE_REGISTRY = {
  signIn: {
    formEyebrow: authFormEyebrow("access", AUTH_PATHS.signIn),
    formHeading: "Sign in to Afenda ERP",
    formDescription:
      "Authenticate with your organization credentials to enter your workspace.",
    metadata: authRouteMetadata("Sign in"),
    skeletonLabel: "Loading sign-in…",
    lane: "access",
    statusVariant: "form",
  },
  signUp: {
    formEyebrow: authFormEyebrow("access", AUTH_PATHS.signUp),
    formHeading: "Create account",
    formDescription:
      "Your invitation is the key to this workspace. Complete your profile to join your organization.",
    metadata: authRouteMetadata("Create account"),
    skeletonLabel: "Loading sign-up…",
    lane: "access",
    statusVariant: "form",
  },
  otp: {
    formEyebrow: authFormEyebrow("access", AUTH_PATHS.otp),
    formHeading: "One-time passcode",
    formDescription: "Enter the sign-in code sent to your email.",
    metadata: authRouteMetadata("One-time passcode"),
    skeletonLabel: "Loading passcode…",
    lane: "access",
    statusVariant: "form",
  },
  mfa: {
    formEyebrow: authFormEyebrow("security", AUTH_PATHS.mfa),
    formHeading: "Verify your identity",
    formDescription:
      "Complete multi-factor verification to continue into your workspace.",
    metadata: authRouteMetadata("Verify identity"),
    skeletonLabel: "Loading verification…",
    lane: "security",
    statusVariant: "form",
  },
  mfaRecovery: {
    formEyebrow: authFormEyebrow("security", AUTH_PATHS.mfaRecovery),
    formHeading: "Recovery code",
    formDescription: "Enter a backup recovery code to complete sign-in.",
    metadata: authRouteMetadata("MFA recovery"),
    skeletonLabel: "Loading recovery…",
    lane: "security",
    statusVariant: "form",
  },
  verifyEmail: {
    formEyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.root),
    formHeading: "Verify your email",
    formDescription:
      "One more step before you can enter your workspace. Open the verification link we sent to your inbox.",
    metadata: authRouteMetadata("Verify your email"),
    skeletonLabel: "Loading verification…",
    lane: "verify",
    statusVariant: "status",
  },
  verifyEmailSent: {
    formEyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.sent),
    formHeading: "Check your inbox",
    formDescription:
      "We sent a verification link to your email. Open it to activate your account.",
    metadata: authRouteMetadata("Verification sent"),
    skeletonLabel: "Loading…",
    lane: "verify",
    statusVariant: "status",
  },
  verifyEmailExpired: {
    formEyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.expired),
    formHeading: "Link expired",
    formDescription:
      "This verification link is no longer valid. Request a new link or sign in if you have already verified.",
    metadata: authRouteMetadata("Verification expired"),
    skeletonLabel: "Loading…",
    lane: "verify",
    statusVariant: "error",
  },
  verifyEmailSuccess: {
    formEyebrow: authFormEyebrow("verify", AUTH_PATHS.verifyEmail.success),
    formHeading: "Email verified",
    formDescription:
      "Your email address is confirmed. Sign in to enter your Afenda ERP workspace.",
    metadata: authRouteMetadata("Email verified"),
    skeletonLabel: "Loading…",
    lane: "verify",
    statusVariant: "success",
  },
  forgotPassword: {
    formEyebrow: authFormEyebrow("recover", AUTH_PATHS.forgotPassword),
    formHeading: "Recover access",
    formDescription:
      "Enter your work email and we will send a secure, time-limited link to restore access.",
    metadata: authRouteMetadata("Recover access"),
    skeletonLabel: "Loading recovery…",
    lane: "recover",
    statusVariant: "form",
  },
  resetPassword: {
    formEyebrow: authFormEyebrow("recover", AUTH_PATHS.resetPassword.root),
    formHeading: "Choose a new password",
    formDescription:
      "You arrived here from a secure reset link. Choose a new password to restore access.",
    metadata: authRouteMetadata("Choose a new password"),
    skeletonLabel: "Loading reset form…",
    lane: "recover",
    statusVariant: "form",
  },
  resetPasswordSuccess: {
    formEyebrow: authFormEyebrow("recover", AUTH_PATHS.resetPassword.success),
    formHeading: "Password updated",
    formDescription:
      "Your password has been changed. Sign in with your new credentials to continue.",
    metadata: authRouteMetadata("Password updated"),
    skeletonLabel: "Loading…",
    lane: "recover",
    statusVariant: "success",
  },
  invite: {
    formEyebrow: authFormEyebrow("invite", AUTH_PATHS.invite.root),
    formHeading: "Workspace invitation",
    formDescription:
      "You have been invited to join an Afenda ERP workspace. Accept the invitation to continue.",
    metadata: authRouteMetadata("Invitation"),
    skeletonLabel: "Loading invitation…",
    lane: "invite",
    statusVariant: "status",
  },
  inviteAccept: {
    formEyebrow: authFormEyebrow("invite", AUTH_PATHS.invite.accept),
    formHeading: "Accept invitation",
    formDescription:
      "Complete your account setup to join your organization on Afenda ERP.",
    metadata: authRouteMetadata("Accept invitation"),
    skeletonLabel: "Loading…",
    lane: "invite",
    statusVariant: "form",
  },
  inviteExpired: {
    formEyebrow: authFormEyebrow("invite", AUTH_PATHS.invite.expired),
    formHeading: "Invitation expired",
    formDescription:
      "This invitation link is no longer valid. Ask your administrator to send a new invitation.",
    metadata: authRouteMetadata("Invitation expired"),
    skeletonLabel: "Loading…",
    lane: "invite",
    statusVariant: "error",
  },
  workspaceSelect: {
    formEyebrow: authFormEyebrow("workspace", AUTH_PATHS.workspaceSelect),
    formHeading: "Choose workspace",
    formDescription: "Select the workspace you want to enter.",
    metadata: authRouteMetadata("Choose workspace"),
    skeletonLabel: "Loading workspaces…",
    lane: "workspace",
    statusVariant: "status",
  },
  organizationSelect: {
    formEyebrow: authFormEyebrow("workspace", AUTH_PATHS.organizationSelect),
    formHeading: "Choose organization",
    formDescription: "Select the organization you want to work in.",
    metadata: authRouteMetadata("Choose organization"),
    skeletonLabel: "Loading organizations…",
    lane: "workspace",
    statusVariant: "status",
  },
  sessionExpired: {
    formEyebrow: authFormEyebrow("security", AUTH_PATHS.sessionExpired),
    formHeading: "Session expired",
    formDescription:
      "Your session expired. Sign in again to continue securely.",
    metadata: authRouteMetadata("Session expired"),
    skeletonLabel: "Loading…",
    lane: "security",
    statusVariant: "error",
  },
  accessDenied: {
    formEyebrow: authFormEyebrow("security", AUTH_PATHS.accessDenied),
    formHeading: "Access cannot be granted.",
    formDescription:
      "Your identity is valid, but this workspace does not currently allow entry.",
    metadata: authRouteMetadata("Access denied"),
    skeletonLabel: "Loading…",
    lane: "security",
    statusVariant: "error",
  },
  securityReview: {
    formEyebrow: authFormEyebrow("security", AUTH_PATHS.securityReview),
    formHeading: "Security review",
    formDescription:
      "A security review is required before you can continue into Afenda ERP.",
    metadata: authRouteMetadata("Security review"),
    skeletonLabel: "Loading…",
    lane: "security",
    statusVariant: "status",
  },
  segmentError: {
    eyebrow: "Sign-in interrupted",
    title: "Could not load sign-in",
    description:
      "The authentication surface failed before your session could start. This is usually temporary — reload the page or wait a moment, then try again.",
    retryLabel: "Reload sign-in",
    metadata: authRouteMetadata("Sign-in unavailable"),
    lane: "security",
    statusVariant: "error",
  },
} as const satisfies Record<
  string,
  AuthRouteFormEntry | AuthRouteSegmentErrorEntry
>;

export type AuthRouteId = keyof typeof AUTH_ROUTE_REGISTRY;

export type AuthEntryRouteId = Exclude<AuthRouteId, "segmentError">;

type AuthRouteRegistryEntry = (typeof AUTH_ROUTE_REGISTRY)[AuthRouteId];

type AuthRouteRegistryFormEntryFromUnion = Extract<
  AuthRouteRegistryEntry,
  { readonly formHeading: string }
>;

export function isAuthRouteFormEntry(
  entry: AuthRouteRegistryEntry
): entry is AuthRouteRegistryFormEntryFromUnion {
  return "formHeading" in entry;
}

export function resolveAuthEntryRouteCopy(
  route: AuthEntryRouteId
): AuthRouteEntryCopy {
  const config = AUTH_ROUTE_REGISTRY[route];

  if (!isAuthRouteFormEntry(config)) {
    return {
      formEyebrow: "Authentication Lane",
      formHeading: "Continue authentication",
      formDescription: "Complete the required step to access Afenda ERP.",
    };
  }

  return {
    formEyebrow: config.formEyebrow,
    formHeading: config.formHeading,
    formDescription: config.formDescription,
  };
}
