/**
 * PAS-006 — canonical auth route catalog (ERP SSOT).
 * Path, lane, block, surface template, copy, and WCAG slot requirements.
 */

import type { AuthLane, AuthShellVariant } from "./auth-path.registry";

export type AuthRouteCatalogEntry = {
  readonly blockId: AuthShellVariant;
  readonly description: string;
  readonly lane: AuthLane;
  readonly path: string;
  readonly surfaceTemplateId: string;
  readonly title: string;
  readonly wcagRequiredSlots: readonly string[];
};

export const AUTH_ROUTE_CATALOG = [
  {
    blockId: "login-page-04",
    description: "Access your Afenda ERP operator workspace.",
    lane: "access",
    path: "/sign-in",
    surfaceTemplateId: "surface-template.auth-sign-in",
    title: "Sign in",
    wcagRequiredSlots: [
      "login.branding.title",
      "login.form.title",
      "login.email",
      "login.password",
      "login.submit",
    ],
  },
  {
    blockId: "register-page-01",
    description: "Create credentials for your approved Afenda ERP workspace.",
    lane: "access",
    path: "/sign-up",
    surfaceTemplateId: "surface-template.auth-sign-up",
    title: "Accept invitation",
    wcagRequiredSlots: [],
  },
  {
    blockId: "forgot-password-page-01",
    description: "Request reset instructions for your Afenda ERP account.",
    lane: "recover",
    path: "/forgot-password",
    surfaceTemplateId: "surface-template.auth-forgot-password",
    title: "Reset password",
    wcagRequiredSlots: [],
  },
  {
    blockId: "forgot-password-success-page-01",
    description: "Reset instructions were sent if the account exists.",
    lane: "recover",
    path: "/forgot-password/success",
    surfaceTemplateId: "surface-template.auth-forgot-password-success",
    title: "Check your email",
    wcagRequiredSlots: [],
  },
  {
    blockId: "reset-password-page-01",
    description: "Create a new password for your Afenda ERP account.",
    lane: "recover",
    path: "/reset-password",
    surfaceTemplateId: "surface-template.auth-reset-password",
    title: "Create new password",
    wcagRequiredSlots: [],
  },
  {
    blockId: "reset-password-success-page-01",
    description: "Return to sign in with your updated password.",
    lane: "recover",
    path: "/reset-password/success",
    surfaceTemplateId: "surface-template.auth-reset-password-success",
    title: "Password updated",
    wcagRequiredSlots: [],
  },
  {
    blockId: "verify-email-page-01",
    description: "Verify your email address before signing in.",
    lane: "verify",
    path: "/verify-email",
    surfaceTemplateId: "surface-template.auth-verify-email",
    title: "Verify email",
    wcagRequiredSlots: [
      "verify-email.title",
      "verify-email.message",
      "verify-email.cta",
    ],
  },
  {
    blockId: "verify-email-sent-page-01",
    description: "Verification instructions were sent if the account exists.",
    lane: "verify",
    path: "/verify-email/sent",
    surfaceTemplateId: "surface-template.auth-verify-email-sent",
    title: "Check your email",
    wcagRequiredSlots: [
      "verify-email-sent.title",
      "verify-email-sent.message",
      "verify-email-sent.cta",
    ],
  },
  {
    blockId: "verify-email-expired-page-01",
    description: "Request a fresh verification link before signing in.",
    lane: "verify",
    path: "/verify-email/expired",
    surfaceTemplateId: "surface-template.auth-verify-email-expired",
    title: "Verification expired",
    wcagRequiredSlots: [
      "verify-email-expired.title",
      "verify-email-expired.message",
      "verify-email-expired.cta",
    ],
  },
  {
    blockId: "verify-email-success-page-01",
    description: "Return to sign in with your verified email address.",
    lane: "verify",
    path: "/verify-email/success",
    surfaceTemplateId: "surface-template.auth-verify-email-success",
    title: "Email verified",
    wcagRequiredSlots: [
      "verify-email-success.title",
      "verify-email-success.message",
      "verify-email-success.cta",
    ],
  },
  {
    blockId: "invite-page-01",
    description: "Review the workspace invitation entry point.",
    lane: "invite",
    path: "/invite",
    surfaceTemplateId: "surface-template.auth-invite",
    title: "Workspace invitation",
    wcagRequiredSlots: ["invite.title", "invite.message", "invite.cta"],
  },
  {
    blockId: "invite-accept-page-01",
    description: "Create credentials with the approved workspace invitation.",
    lane: "invite",
    path: "/invite/accept",
    surfaceTemplateId: "surface-template.auth-invite-accept",
    title: "Accept invitation",
    wcagRequiredSlots: [
      "invite-accept.form.title",
      "invite-accept.email",
      "invite-accept.password",
      "invite-accept.submit",
    ],
  },
  {
    blockId: "invite-expired-page-01",
    description: "Request a new invitation from your workspace administrator.",
    lane: "invite",
    path: "/invite/expired",
    surfaceTemplateId: "surface-template.auth-invite-expired",
    title: "Invitation expired",
    wcagRequiredSlots: [
      "invite-expired.title",
      "invite-expired.message",
      "invite-expired.cta",
    ],
  },
  {
    blockId: "invite-invalid-page-01",
    description:
      "Request a valid workspace invitation before creating credentials.",
    lane: "invite",
    path: "/invite/invalid",
    surfaceTemplateId: "surface-template.auth-invite-invalid",
    title: "Invitation invalid",
    wcagRequiredSlots: [
      "invite-invalid.title",
      "invite-invalid.message",
      "invite-invalid.cta",
    ],
  },
  {
    blockId: "invite-consumed-page-01",
    description:
      "Sign in with the account that already accepted this invitation.",
    lane: "invite",
    path: "/invite/consumed",
    surfaceTemplateId: "surface-template.auth-invite-consumed",
    title: "Invitation already used",
    wcagRequiredSlots: [
      "invite-consumed.title",
      "invite-consumed.message",
      "invite-consumed.cta",
    ],
  },
  {
    blockId: "invite-email-mismatch-page-01",
    description:
      "Use the invited email address or request a corrected invitation.",
    lane: "invite",
    path: "/invite/email-mismatch",
    surfaceTemplateId: "surface-template.auth-invite-email-mismatch",
    title: "Invitation email mismatch",
    wcagRequiredSlots: [
      "invite-email-mismatch.title",
      "invite-email-mismatch.message",
      "invite-email-mismatch.cta",
    ],
  },
  {
    blockId: "passkey-page-01",
    description:
      "Continue with a registered passkey for this operator account.",
    lane: "access",
    path: "/passkey",
    surfaceTemplateId: "surface-template.auth-passkey",
    title: "Use a passkey",
    wcagRequiredSlots: ["passkey.title", "passkey.message", "passkey.cta"],
  },
  {
    blockId: "error-passkey-page-01",
    description:
      "Restart sign-in after the passkey request could not complete.",
    lane: "security",
    path: "/passkey/error",
    surfaceTemplateId: "surface-template.error-auth-passkey",
    title: "Passkey unavailable",
    wcagRequiredSlots: [
      "error-passkey.title",
      "error-passkey.message",
      "error-passkey.cta",
    ],
  },
  {
    blockId: "sso-page-01",
    description: "Continue with your organization identity provider.",
    lane: "access",
    path: "/sso",
    surfaceTemplateId: "surface-template.auth-sso",
    title: "Continue with SSO",
    wcagRequiredSlots: ["sso.title", "sso.message", "sso.cta"],
  },
  {
    blockId: "error-sso-page-01",
    description:
      "Restart sign-in after the organization identity request failed.",
    lane: "security",
    path: "/sso/error",
    surfaceTemplateId: "surface-template.error-auth-sso",
    title: "SSO unavailable",
    wcagRequiredSlots: [
      "error-sso.title",
      "error-sso.message",
      "error-sso.cta",
    ],
  },
  {
    blockId: "error-oauth-page-01",
    description: "Restart sign-in after the external provider callback failed.",
    lane: "security",
    path: "/oauth/error",
    surfaceTemplateId: "surface-template.error-auth-oauth",
    title: "Social sign-in failed",
    wcagRequiredSlots: [
      "error-oauth.title",
      "error-oauth.message",
      "error-oauth.cta",
    ],
  },
  {
    blockId: "otp-page-01",
    description:
      "Enter the one-time passcode required to continue authentication.",
    lane: "access",
    path: "/otp",
    surfaceTemplateId: "surface-template.auth-otp",
    title: "One-time passcode",
    wcagRequiredSlots: ["otp.form.title", "otp.code", "otp.submit"],
  },
  {
    blockId: "mfa-page-01",
    description: "Complete multi-factor verification before workspace access.",
    lane: "security",
    path: "/mfa",
    surfaceTemplateId: "surface-template.auth-mfa",
    title: "Multi-factor verification",
    wcagRequiredSlots: ["mfa.form.title", "mfa.code", "mfa.submit"],
  },
  {
    blockId: "mfa-recovery-page-01",
    description: "Use a recovery code to complete multi-factor verification.",
    lane: "security",
    path: "/mfa/recovery",
    surfaceTemplateId: "surface-template.auth-mfa-recovery",
    title: "Recovery code",
    wcagRequiredSlots: [
      "mfa-recovery.form.title",
      "mfa-recovery.code",
      "mfa-recovery.submit",
    ],
  },
  {
    blockId: "error-session-expired-page-01",
    description: "Sign in again after the previous session expired.",
    lane: "security",
    path: "/session-expired",
    surfaceTemplateId: "surface-template.error-auth-session-expired",
    title: "Session expired",
    wcagRequiredSlots: [
      "error-session-expired.title",
      "error-session-expired.message",
      "error-session-expired.cta",
    ],
  },
  {
    blockId: "error-access-denied-page-01",
    description: "Use an approved account before accessing this workspace.",
    lane: "security",
    path: "/access-denied",
    surfaceTemplateId: "surface-template.error-auth-access-denied",
    title: "Access denied",
    wcagRequiredSlots: [
      "error-access-denied.title",
      "error-access-denied.message",
      "error-access-denied.cta",
    ],
  },
  {
    blockId: "login-page-03",
    description: "Choose the workspace scope for this sign-in session.",
    lane: "workspace",
    path: "/workspace/select",
    surfaceTemplateId: "surface-template.auth-workspace-select",
    title: "Select workspace",
    wcagRequiredSlots: [
      "workspace-select.title",
      "workspace-select.description",
      "workspace-select.action",
      "auth-complete.title",
      "auth-complete.description",
      "auth-complete.status",
    ],
  },
  {
    blockId: "login-page-03",
    description: "Choose the organization scope for this sign-in session.",
    lane: "workspace",
    path: "/organization/select",
    surfaceTemplateId: "surface-template.auth-workspace-select",
    title: "Select organization",
    wcagRequiredSlots: [
      "workspace-select.title",
      "workspace-select.description",
      "workspace-select.action",
      "auth-complete.title",
      "auth-complete.description",
      "auth-complete.status",
    ],
  },
  {
    blockId: "login-page-03",
    description:
      "Resolve workspace access before continuing to your destination.",
    lane: "workspace",
    path: "/auth/complete",
    surfaceTemplateId: "surface-template.auth-workspace-select",
    title: "Completing sign-in",
    wcagRequiredSlots: [
      "workspace-select.title",
      "workspace-select.description",
      "workspace-select.action",
      "auth-complete.title",
      "auth-complete.description",
      "auth-complete.status",
    ],
  },
  {
    blockId: "security-review-page-01",
    description:
      "Complete the required security review before workspace access.",
    lane: "security",
    path: "/security/review",
    surfaceTemplateId: "surface-template.auth-security-review",
    title: "Security review required",
    wcagRequiredSlots: [
      "security-review.title",
      "security-review.message",
      "security-review.cta",
    ],
  },
  {
    blockId: "error-authentication-page-01",
    description: "Restart sign-in after an authentication request error.",
    lane: "security",
    path: "/error",
    surfaceTemplateId: "surface-template.error-authentication",
    title: "Authentication error",
    wcagRequiredSlots: [
      "error-authentication.title",
      "error-authentication.message",
      "error-authentication.cta",
    ],
  },
] as const satisfies readonly AuthRouteCatalogEntry[];

export type AuthRouteCatalogPath = (typeof AUTH_ROUTE_CATALOG)[number]["path"];

export function getAuthRouteCatalogEntryByPath(
  pathname: string
): AuthRouteCatalogEntry | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return AUTH_ROUTE_CATALOG.find((entry) => entry.path === normalized);
}

export function resolveAuthRouteTitle(path: AuthRouteCatalogPath): string {
  const entry = getAuthRouteCatalogEntryByPath(path);
  return entry?.title ?? "Sign in";
}

export function resolveAuthRouteDescription(
  path: AuthRouteCatalogPath
): string {
  const entry = getAuthRouteCatalogEntryByPath(path);
  return entry?.description ?? "Access your Afenda ERP operator workspace.";
}
