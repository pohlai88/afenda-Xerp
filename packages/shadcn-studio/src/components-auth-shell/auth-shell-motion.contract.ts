import type { AuthPageBlockId } from "./auth-shell-method-manifest.js";

export type AuthShellMotionVariant =
  | "access"
  | "error"
  | "invite"
  | "recover"
  | "security"
  | "verify";

export const AUTH_SHELL_PIXEL_IMAGE_PATH =
  "/afenda-brand/pixel/afenda-lynx-pixel.png";
export const AUTH_SHELL_PIXEL_STORYBOOK_IMAGE_PATH =
  "/studio-assets/afenda-brand/pixel/afenda-lynx-pixel.png";

export const AUTH_SHELL_PIXEL_IMAGE_SOURCES = [
  AUTH_SHELL_PIXEL_IMAGE_PATH,
  AUTH_SHELL_PIXEL_STORYBOOK_IMAGE_PATH,
] satisfies readonly [string, string];

export const AUTH_SHELL_MOTION_VARIANT_BY_BLOCK_ID = {
  "login-page-01": "access",
  "login-page-02": "access",
  "login-page-03": "access",
  "login-page-04": "access",
  "login-page-05": "access",
  "login-page-06": "access",
  "register-page-01": "access",
  "forgot-password-page-01": "recover",
  "forgot-password-success-page-01": "recover",
  "reset-password-page-01": "recover",
  "reset-password-success-page-01": "recover",
  "verify-email-page-01": "verify",
  "verify-email-sent-page-01": "verify",
  "verify-email-expired-page-01": "verify",
  "verify-email-success-page-01": "verify",
  "invite-page-01": "invite",
  "invite-accept-page-01": "invite",
  "invite-expired-page-01": "invite",
  "invite-invalid-page-01": "invite",
  "invite-consumed-page-01": "invite",
  "invite-email-mismatch-page-01": "invite",
  "passkey-page-01": "security",
  "error-passkey-page-01": "error",
  "sso-page-01": "security",
  "error-sso-page-01": "error",
  "error-oauth-page-01": "error",
  "otp-page-01": "security",
  "mfa-page-01": "security",
  "mfa-recovery-page-01": "security",
  "error-session-expired-page-01": "error",
  "error-access-denied-page-01": "error",
  "security-review-page-01": "security",
  "error-authentication-page-01": "error",
} as const satisfies Record<AuthPageBlockId, AuthShellMotionVariant>;

export function resolveAuthShellMotionVariant(
  blockId: AuthPageBlockId
): AuthShellMotionVariant {
  return AUTH_SHELL_MOTION_VARIANT_BY_BLOCK_ID[blockId];
}
