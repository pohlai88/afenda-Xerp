import type { AuthPageBlockId } from "../../components-auth-shell/auth-shell-method-manifest.js";

export const AUTH_SHELL_STORY_PATTERN_LABELS = {
  "login-page-01": "centered-card",
  "login-page-02": "split-dashboard-preview",
  "login-page-03": "split-brand-panel",
  "login-page-04": "erp-operator-ingress",
  "login-page-05": "compact-social-card",
  "login-page-06": "cinematic-silk-panel",
  "register-page-01": "invite-first-centered-card",
  "forgot-password-page-01": "forgot-password-centered-card",
  "forgot-password-success-page-01": "forgot-password-success-card",
  "reset-password-page-01": "reset-password-centered-card",
  "reset-password-success-page-01": "reset-password-success-card",
  "verify-email-page-01": "email-verification-card",
  "verify-email-sent-page-01": "email-verification-card",
  "verify-email-expired-page-01": "email-verification-card",
  "verify-email-success-page-01": "email-verification-card",
  "invite-page-01": "invite-card",
  "invite-accept-page-01": "invite-card",
  "invite-expired-page-01": "invite-card",
  "invite-invalid-page-01": "invite-failure-card",
  "invite-consumed-page-01": "invite-failure-card",
  "invite-email-mismatch-page-01": "invite-failure-card",
  "passkey-page-01": "external-auth-card",
  "error-passkey-page-01": "external-auth-card",
  "sso-page-01": "external-auth-card",
  "error-sso-page-01": "external-auth-card",
  "error-oauth-page-01": "external-auth-card",
  "otp-page-01": "otp-challenge-card",
  "mfa-page-01": "mfa-challenge-card",
  "mfa-recovery-page-01": "mfa-challenge-card",
  "error-session-expired-page-01": "auth-boundary-card",
  "error-access-denied-page-01": "auth-boundary-card",
  "security-review-page-01": "security-review-card",
  "error-authentication-page-01": "auth-boundary-card",
} as const satisfies Record<AuthPageBlockId, string>;

export type AuthShellStoryPatternLabel =
  (typeof AUTH_SHELL_STORY_PATTERN_LABELS)[AuthPageBlockId];

export function getAuthShellStoryPatternLabel(
  blockId: AuthPageBlockId
): AuthShellStoryPatternLabel {
  return AUTH_SHELL_STORY_PATTERN_LABELS[blockId];
}
