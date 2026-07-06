/**
 * PAS-006C P06-007 — auth-adjacent surface registry for WCAG 2.2 AA pack.
 */

import { ERROR_PAGE_PUBLIC_PATH_PREFIXES } from "@/lib/presentation/error-page-surface.registry";

export const AUTH_ADJACENT_SURFACE_PATHS = [
  "/sign-in",
  "/verify-email",
  "/verify-email/sent",
  "/verify-email/expired",
  "/verify-email/success",
  "/invite",
  "/invite/accept",
  "/invite/expired",
  "/invite/invalid",
  "/invite/consumed",
  "/invite/email-mismatch",
  "/passkey",
  "/passkey/error",
  "/sso",
  "/sso/error",
  "/oauth/error",
  "/otp",
  "/mfa",
  "/mfa/recovery",
  "/session-expired",
  "/access-denied",
  "/auth/complete",
  "/workspace/select",
  "/organization/select",
  "/error",
  "/security/review",
  ...ERROR_PAGE_PUBLIC_PATH_PREFIXES.filter(
    (path) => path !== "/session-expired" && path !== "/access-denied"
  ),
] as const;

export type AuthAdjacentSurfacePath =
  (typeof AUTH_ADJACENT_SURFACE_PATHS)[number];

/** Presentation blocks wired to auth-adjacent ERP routes. */
export const AUTH_ADJACENT_AUTH_BLOCK_IDS = [
  "login-page-03",
  "login-page-04",
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
] as const;

export type AuthAdjacentAuthBlockId =
  (typeof AUTH_ADJACENT_AUTH_BLOCK_IDS)[number];

/** Slot ids that must exist for WCAG form labeling on auth blocks. */
export const AUTH_ADJACENT_WCAG_REQUIRED_SLOTS: Readonly<
  Record<AuthAdjacentAuthBlockId, readonly string[]>
> = {
  "login-page-03": [
    "workspace-select.title",
    "workspace-select.description",
    "workspace-select.action",
  ],
  "login-page-04": [
    "login.branding.title",
    "login.form.title",
    "login.email",
    "login.password",
    "login.submit",
  ],
  "verify-email-page-01": [
    "verify-email.title",
    "verify-email.message",
    "verify-email.cta",
  ],
  "verify-email-sent-page-01": [
    "verify-email-sent.title",
    "verify-email-sent.message",
    "verify-email-sent.cta",
  ],
  "verify-email-expired-page-01": [
    "verify-email-expired.title",
    "verify-email-expired.message",
    "verify-email-expired.cta",
  ],
  "verify-email-success-page-01": [
    "verify-email-success.title",
    "verify-email-success.message",
    "verify-email-success.cta",
  ],
  "invite-page-01": ["invite.title", "invite.message", "invite.cta"],
  "invite-accept-page-01": [
    "invite-accept.form.title",
    "invite-accept.email",
    "invite-accept.password",
    "invite-accept.submit",
  ],
  "invite-expired-page-01": [
    "invite-expired.title",
    "invite-expired.message",
    "invite-expired.cta",
  ],
  "invite-invalid-page-01": [
    "invite-invalid.title",
    "invite-invalid.message",
    "invite-invalid.cta",
  ],
  "invite-consumed-page-01": [
    "invite-consumed.title",
    "invite-consumed.message",
    "invite-consumed.cta",
  ],
  "invite-email-mismatch-page-01": [
    "invite-email-mismatch.title",
    "invite-email-mismatch.message",
    "invite-email-mismatch.cta",
  ],
  "passkey-page-01": ["passkey.title", "passkey.message", "passkey.cta"],
  "error-passkey-page-01": [
    "error-passkey.title",
    "error-passkey.message",
    "error-passkey.cta",
  ],
  "sso-page-01": ["sso.title", "sso.message", "sso.cta"],
  "error-sso-page-01": [
    "error-sso.title",
    "error-sso.message",
    "error-sso.cta",
  ],
  "error-oauth-page-01": [
    "error-oauth.title",
    "error-oauth.message",
    "error-oauth.cta",
  ],
  "otp-page-01": ["otp.form.title", "otp.code", "otp.submit"],
  "mfa-page-01": ["mfa.form.title", "mfa.code", "mfa.submit"],
  "mfa-recovery-page-01": [
    "mfa-recovery.form.title",
    "mfa-recovery.code",
    "mfa-recovery.submit",
  ],
  "error-session-expired-page-01": [
    "error-session-expired.title",
    "error-session-expired.message",
    "error-session-expired.cta",
  ],
  "error-access-denied-page-01": [
    "error-access-denied.title",
    "error-access-denied.message",
    "error-access-denied.cta",
  ],
  "security-review-page-01": [
    "security-review.title",
    "security-review.message",
    "security-review.cta",
  ],
  "error-authentication-page-01": [
    "error-authentication.title",
    "error-authentication.message",
    "error-authentication.cta",
  ],
};
