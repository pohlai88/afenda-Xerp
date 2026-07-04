import type { Metadata } from "next";

export type AuthField =
  | "code"
  | "email"
  | "invite-code"
  | "passkey"
  | "password"
  | "recovery-code"
  | "sso"
  | "totp";

export type AuthLane =
  | "entry"
  | "error"
  | "invite"
  | "recovery"
  | "security"
  | "verification";

export interface DeveloperAuthFixture {
  readonly ctaLabel: string;
  readonly description: string;
  readonly fields: readonly AuthField[];
  readonly lane: AuthLane;
  readonly path: string;
  readonly surfaceId: string;
  readonly title: string;
}

/**
 * Single source of truth (SSOT) for developer auth routes and metadata.
 *
 * All auth route identity/path/lane/title metadata must be defined here.
 */
const DEVELOPER_AUTH_FIXTURES = [
  {
    ctaLabel: "Continue",
    description: "Primary operator sign-in surface for route-lab QA.",
    fields: ["email", "password"],
    lane: "entry",
    path: "/sign-in",
    surfaceId: "auth.sign-in",
    title: "Sign in",
  },
  {
    ctaLabel: "Create account",
    description:
      "Fixture-backed registration surface for developer route-lab QA.",
    fields: ["email", "password"],
    lane: "entry",
    path: "/sign-up",
    surfaceId: "auth.sign-up",
    title: "Create workspace access",
  },
  {
    ctaLabel: "Send instructions",
    description: "Recovery request surface for form-state and copy validation.",
    fields: ["email"],
    lane: "recovery",
    path: "/forgot-password",
    surfaceId: "auth.forgot-password",
    title: "Request reset instructions",
  },
  {
    ctaLabel: "Continue",
    description: "Confirmation surface after a recovery request completes.",
    fields: [],
    lane: "recovery",
    path: "/forgot-password/success",
    surfaceId: "auth.forgot-password-success",
    title: "Reset instructions sent",
  },
  {
    ctaLabel: "Update password",
    description: "Password replacement surface for validation-state QA.",
    fields: ["password"],
    lane: "recovery",
    path: "/reset-password",
    surfaceId: "auth.reset-password",
    title: "Create new password",
  },
  {
    ctaLabel: "Continue",
    description: "Confirmation surface after a password reset completes.",
    fields: [],
    lane: "recovery",
    path: "/reset-password/success",
    surfaceId: "auth.reset-password-success",
    title: "Password updated",
  },
  {
    ctaLabel: "Send verification",
    description: "Verification request surface for delivery-state QA.",
    fields: ["email"],
    lane: "verification",
    path: "/verify-email",
    surfaceId: "auth.verify-email",
    title: "Verify email",
  },
  {
    ctaLabel: "Continue",
    description: "Delivery confirmation surface for verification flow review.",
    fields: [],
    lane: "verification",
    path: "/verify-email/sent",
    surfaceId: "auth.verify-email-sent",
    title: "Check your email",
  },
  {
    ctaLabel: "Continue",
    description: "Failure-state surface when a verification link has expired.",
    fields: [],
    lane: "verification",
    path: "/verify-email/expired",
    surfaceId: "auth.verify-email-expired",
    title: "Verification expired",
  },
  {
    ctaLabel: "Continue",
    description: "Confirmation surface after email verification succeeds.",
    fields: [],
    lane: "verification",
    path: "/verify-email/success",
    surfaceId: "auth.verify-email-success",
    title: "Email verified",
  },
  {
    ctaLabel: "Continue",
    description:
      "Workspace invite entry surface for route-lab presentation review.",
    fields: ["invite-code", "email", "password"],
    lane: "invite",
    path: "/invite",
    surfaceId: "auth.invite",
    title: "Workspace invitation",
  },
  {
    ctaLabel: "Accept invitation",
    description: "Acceptance surface for invitation onboarding QA.",
    fields: ["invite-code", "email", "password"],
    lane: "invite",
    path: "/invite/accept",
    surfaceId: "auth.invite-accept",
    title: "Accept invitation",
  },
  {
    ctaLabel: "Continue",
    description: "Expired invitation error surface.",
    fields: [],
    lane: "invite",
    path: "/invite/expired",
    surfaceId: "auth.invite-expired",
    title: "Invitation expired",
  },
  {
    ctaLabel: "Continue",
    description: "Invalid invitation error surface.",
    fields: [],
    lane: "invite",
    path: "/invite/invalid",
    surfaceId: "auth.invite-invalid",
    title: "Invitation invalid",
  },
  {
    ctaLabel: "Continue",
    description: "Used invitation confirmation surface.",
    fields: [],
    lane: "invite",
    path: "/invite/consumed",
    surfaceId: "auth.invite-consumed",
    title: "Invitation already used",
  },
  {
    ctaLabel: "Continue",
    description: "Invite mismatch error surface.",
    fields: [],
    lane: "invite",
    path: "/invite/email-mismatch",
    surfaceId: "auth.invite-email-mismatch",
    title: "Invitation email mismatch",
  },
  {
    ctaLabel: "Continue with passkey",
    description: "Passkey entry surface for alternative auth treatment review.",
    fields: ["passkey"],
    lane: "entry",
    path: "/passkey",
    surfaceId: "auth.passkey",
    title: "Use a passkey",
  },
  {
    ctaLabel: "Return to sign in",
    description: "Passkey failure surface.",
    fields: [],
    lane: "error",
    path: "/passkey/error",
    surfaceId: "auth.passkey-error",
    title: "Passkey unavailable",
  },
  {
    ctaLabel: "Continue with SSO",
    description: "SSO entry surface for federation UI review.",
    fields: ["sso"],
    lane: "entry",
    path: "/sso",
    surfaceId: "auth.sso",
    title: "Continue with SSO",
  },
  {
    ctaLabel: "Return to sign in",
    description: "SSO failure surface.",
    fields: [],
    lane: "error",
    path: "/sso/error",
    surfaceId: "auth.sso-error",
    title: "SSO unavailable",
  },
  {
    ctaLabel: "Return to sign in",
    description: "OAuth callback failure surface.",
    fields: [],
    lane: "error",
    path: "/oauth/error",
    surfaceId: "auth.oauth-error",
    title: "Social sign-in failed",
  },
  {
    ctaLabel: "Verify",
    description: "One-time code surface for challenge-state QA.",
    fields: ["code"],
    lane: "verification",
    path: "/otp",
    surfaceId: "auth.otp",
    title: "One-time passcode",
  },
  {
    ctaLabel: "Verify",
    description: "MFA verification surface for step-up challenge QA.",
    fields: ["totp"],
    lane: "verification",
    path: "/mfa",
    surfaceId: "auth.mfa",
    title: "Multi-factor verification",
  },
  {
    ctaLabel: "Use recovery code",
    description: "Recovery-code surface for fallback challenge QA.",
    fields: ["recovery-code"],
    lane: "recovery",
    path: "/mfa/recovery",
    surfaceId: "auth.mfa-recovery",
    title: "Recovery code",
  },
  {
    ctaLabel: "Return to sign in",
    description: "Expired-session re-entry surface.",
    fields: [],
    lane: "error",
    path: "/session-expired",
    surfaceId: "auth.session-expired",
    title: "Session expired",
  },
  {
    ctaLabel: "Return to sign in",
    description: "Access denial surface for auth-adjacent error review.",
    fields: [],
    lane: "error",
    path: "/access-denied",
    surfaceId: "auth.access-denied",
    title: "Access denied",
  },
  {
    ctaLabel: "Review security requirements",
    description: "Security review gating surface.",
    fields: [],
    lane: "security",
    path: "/security/review",
    surfaceId: "auth.security-review",
    title: "Security review required",
  },
  {
    ctaLabel: "Return to sign in",
    description: "Generic auth error surface.",
    fields: [],
    lane: "error",
    path: "/error",
    surfaceId: "auth.error",
    title: "Authentication error",
  },
] as const satisfies readonly DeveloperAuthFixture[];

export function resolveDeveloperAuthFixture(
  authRoute: readonly string[] | undefined
): DeveloperAuthFixture | undefined {
  if (authRoute === undefined || authRoute.length === 0) {
    return;
  }

  const path = `/${authRoute.join("/")}`;

  return resolveDeveloperAuthFixtureByPath(path);
}

export function resolveDeveloperAuthFixtureByPath(
  path: string
): DeveloperAuthFixture | undefined {
  return DEVELOPER_AUTH_FIXTURES.find((fixture) => fixture.path === path);
}

export function createDeveloperAuthMetadata(
  fixture: DeveloperAuthFixture
): Metadata {
  return {
    description: fixture.description,
    title: fixture.title,
  };
}
