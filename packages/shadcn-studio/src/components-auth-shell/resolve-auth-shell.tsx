import type { ComponentType } from "react";
import type {
  AuthPageBlockId,
  AuthShellFormLane,
} from "./auth-shell-method-manifest.js";
import ErrorAccessDeniedPage01 from "./error-access-denied-page-01.js";
import ErrorAuthenticationPage01 from "./error-authentication-page-01.js";
import ErrorOauthPage01 from "./error-oauth-page-01.js";
import ErrorPasskeyPage01 from "./error-passkey-page-01.js";
import ErrorSessionExpiredPage01 from "./error-session-expired-page-01.js";
import ErrorSsoPage01 from "./error-sso-page-01.js";
import ForgotPasswordPage01 from "./forgot-password-page-01.js";
import ForgotPasswordSuccessPage01 from "./forgot-password-success-page-01.js";
import InviteAcceptPage01 from "./invite-accept-page-01.js";
import InviteConsumedPage01 from "./invite-consumed-page-01.js";
import InviteEmailMismatchPage01 from "./invite-email-mismatch-page-01.js";
import InviteExpiredPage01 from "./invite-expired-page-01.js";
import InviteInvalidPage01 from "./invite-invalid-page-01.js";
import InvitePage01 from "./invite-page-01.js";
import LoginPage01 from "./login-page-01.js";
import LoginPage02 from "./login-page-02.js";
import LoginPage03 from "./login-page-03.js";
import LoginPage04 from "./login-page-04.js";
import LoginPage05 from "./login-page-05.js";
import LoginPage06 from "./login-page-06.js";
import MfaPage01 from "./mfa-page-01.js";
import MfaRecoveryPage01 from "./mfa-recovery-page-01.js";
import OtpPage01 from "./otp-page-01.js";
import PasskeyPage01 from "./passkey-page-01.js";
import RegisterPage01 from "./register-page-01.js";
import ResetPasswordPage01 from "./reset-password-page-01.js";
import ResetPasswordSuccessPage01 from "./reset-password-success-page-01.js";
import SecurityReviewPage01 from "./security-review-page-01.js";
import SsoPage01 from "./sso-page-01.js";
import VerifyEmailExpiredPage01 from "./verify-email-expired-page-01.js";
import VerifyEmailPage01 from "./verify-email-page-01.js";
import VerifyEmailSentPage01 from "./verify-email-sent-page-01.js";
import VerifyEmailSuccessPage01 from "./verify-email-success-page-01.js";

/**
 * Form lanes for pre-auth ingress surfaces — keep aligned with
 * `apps/erp/src/lib/auth/auth-path.registry.ts` (`AuthShellFormLane`).
 */
export type { AuthShellFormLane };

type AuthShellBlock = ComponentType;

export const AUTH_SHELL_LANE_DEFAULT_PAGE_MAP = {
  access: "login-page-04",
  verify: "login-page-02",
  recover: "forgot-password-page-01",
  error: "login-page-06",
} as const satisfies Record<AuthShellFormLane, AuthPageBlockId>;

const AUTH_SHELL_BLOCK_COMPONENTS = {
  "login-page-01": LoginPage01,
  "login-page-02": LoginPage02,
  "login-page-03": LoginPage03,
  "login-page-04": LoginPage04,
  "login-page-05": LoginPage05,
  "login-page-06": LoginPage06,
  "register-page-01": RegisterPage01,
  "forgot-password-page-01": ForgotPasswordPage01,
  "forgot-password-success-page-01": ForgotPasswordSuccessPage01,
  "reset-password-page-01": ResetPasswordPage01,
  "reset-password-success-page-01": ResetPasswordSuccessPage01,
  "verify-email-page-01": VerifyEmailPage01,
  "verify-email-sent-page-01": VerifyEmailSentPage01,
  "verify-email-expired-page-01": VerifyEmailExpiredPage01,
  "verify-email-success-page-01": VerifyEmailSuccessPage01,
  "invite-page-01": InvitePage01,
  "invite-accept-page-01": InviteAcceptPage01,
  "invite-expired-page-01": InviteExpiredPage01,
  "invite-invalid-page-01": InviteInvalidPage01,
  "invite-consumed-page-01": InviteConsumedPage01,
  "invite-email-mismatch-page-01": InviteEmailMismatchPage01,
  "passkey-page-01": PasskeyPage01,
  "error-passkey-page-01": ErrorPasskeyPage01,
  "sso-page-01": SsoPage01,
  "error-sso-page-01": ErrorSsoPage01,
  "error-oauth-page-01": ErrorOauthPage01,
  "otp-page-01": OtpPage01,
  "mfa-page-01": MfaPage01,
  "mfa-recovery-page-01": MfaRecoveryPage01,
  "error-session-expired-page-01": ErrorSessionExpiredPage01,
  "error-access-denied-page-01": ErrorAccessDeniedPage01,
  "security-review-page-01": SecurityReviewPage01,
  "error-authentication-page-01": ErrorAuthenticationPage01,
} as const satisfies Record<AuthPageBlockId, AuthShellBlock>;

export function resolveAuthShellBlock(
  blockId: AuthPageBlockId
): AuthShellBlock {
  return AUTH_SHELL_BLOCK_COMPONENTS[blockId];
}

export function resolveAuthShell(
  lane: AuthShellFormLane = "access"
): AuthShellBlock {
  return resolveAuthShellBlock(AUTH_SHELL_LANE_DEFAULT_PAGE_MAP[lane]);
}
