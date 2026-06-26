import { buildAuthPath } from "./auth-path.registry";

export const AUTH_SAFE_ERRORS = {
  signInFailed:
    "We could not complete this request. Please check your details and try again.",
  socialSignInFailed:
    "We could not complete sign-in with that provider. Try again or use another method.",
  passkeySignInFailed:
    "We could not complete passkey sign-in. Try again or use your email and password.",
  ssoSignInFailed:
    "We could not start single sign-on. Check your work email and try again.",
  signUpFailed:
    "We could not complete account creation. Please check your details and try again.",
  passwordResetRequestFailed:
    "We could not complete this request. Please check your details and try again.",
  passwordResetFailed:
    "We could not update your password. Request a new reset link and try again.",
  mfaVerificationFailed:
    "We could not verify that code. Check the code and try again.",
  genericActionFailed:
    "We could not complete this request. Please try again in a moment.",
} as const;

export const AUTH_SECURITY_COPY = {
  linkExpiry: "For security, this link may expire after a short time.",
  sessionExpiredLead:
    "Your session expired. Sign in again to continue securely.",
  sessionExpiredHint:
    "Your work is preserved where possible. Sign in to return to your workspace.",
  accessDeniedLead: "You do not have access to this workspace.",
  accessDeniedHint:
    "Contact your organization administrator if you believe this is an error.",
  unlinkedSessionLead: "Your account is not linked to an Afenda ERP workspace.",
  unlinkedSessionHint:
    "Ask your administrator for an invitation, or sign in with a different account.",
  securityReviewLead: "A security review is required before you can continue.",
  securityReviewHint:
    "Follow the steps below or contact your administrator for assistance.",
  securityReviewSteps: [
    "Confirm this sign-in attempt was you.",
    "If you do not recognize this activity, contact support immediately.",
    "Review your password and multi-factor settings after you continue.",
  ] as const,
} as const;

export const AUTH_WORKSPACE_STUB_COPY = {
  workspaceSelectLead: "Choose the workspace you want to enter.",
  workspaceSelectHint:
    "Full workspace selection is rolling out. Continue to your default workspace for now.",
  organizationSelectLead: "Choose the organization you want to work in.",
  organizationSelectHint:
    "Organization selection is not yet available. Continue to your workspace for now.",
} as const;

export const AUTH_INVITE_COPY = {
  inviteLandingLead: "You have been invited to join an Afenda ERP workspace.",
  inviteLandingHint:
    "Use the button below to accept your invitation and create your account.",
  inviteExpiredLead: "This invitation link is no longer valid.",
  inviteExpiredHint: "Ask your administrator to send a new invitation.",
} as const;

export const AUTH_VERIFY_COPY = {
  sentLead: "Check your inbox for the verification link.",
  sentHint:
    "Open the activation link in the email we sent after sign-up. Links expire after a short time for your security.",
  expiredLead: "This verification link has expired.",
  expiredHint:
    "Request a new verification email or sign in if you have already verified your account.",
  successLead: "Your email has been verified.",
  successHint: "Sign in to enter your Afenda ERP workspace.",
  spamHint:
    "If you do not see the email within a few minutes, check your spam folder or ask your administrator for a new invitation.",
} as const;

export const AUTH_RECOVER_COPY = {
  resetSuccessLead: "Your password has been updated.",
  resetSuccessHint: "Sign in with your new password to continue.",
} as const;

export const AUTH_FORM_WORK_EMAIL_HINT =
  "Use the email address associated with your Afenda ERP account." as const;

export const AUTH_FORM_SIGN_IN_LINK = buildAuthPath("signIn");
export const AUTH_FORM_SIGN_IN_PASSWORD_RESET_NOTICE_LINK = buildAuthPath(
  "signIn",
  { notice: "password-reset" }
);
export const AUTH_FORM_SIGN_IN_VERIFY_EMAIL_NOTICE_LINK = buildAuthPath(
  "signIn",
  { notice: "verify-email" }
);

export const SIGN_IN_SOCIAL_LEAD =
  "Choose how you want to sign in to your workspace." as const;
export const SIGN_IN_CREDENTIALS_LEAD =
  "Enter your work email and password to continue." as const;
export const SIGN_IN_PASSWORD_HINT =
  "Use the password associated with your Afenda ERP account." as const;

export const FORGOT_PASSWORD_SUCCESS_LEAD =
  "If an account exists for that email, a reset link has been sent." as const;
export const FORGOT_PASSWORD_SUCCESS_HINT =
  "The link expires after a short time. Check your spam folder if you do not see it within a few minutes." as const;

export const RESET_PASSWORD_REQUEST_LEAD =
  "Create a strong password to secure your Afenda ERP account." as const;
export const RESET_PASSWORD_REQUIREMENTS_HINT =
  "Use at least 12 characters with letters, numbers, and symbols for a strong password." as const;
export const RESET_PASSWORD_CONFIRM_HINT =
  "Re-enter the same password to confirm your change." as const;
export const RESET_PASSWORD_INVALID_LINK_HINT =
  "Password reset links expire after a short time for your security." as const;
export const RESET_PASSWORD_MISSING_TOKEN_HINT =
  "Open the latest reset email from Afenda ERP or request a new link below." as const;

export const INVITATION_LEAD =
  "Complete your account using the invitation sent to your email." as const;
export const INVITATION_HINT =
  "Use the invited email address and choose a strong password for your Afenda ERP account." as const;
export const SIGN_UP_PROFILE_LEAD =
  "Tell us who you are and set a password to activate your workspace access." as const;
export const MISSING_INVITATION_LEAD =
  "This sign-up page requires a valid invitation link from your organization administrator." as const;
export const MISSING_INVITATION_HINT =
  "Ask your administrator to send a new invitation, or sign in if you already have an account." as const;
export const SIGN_UP_NAME_HINT =
  "This name appears on your Afenda ERP profile and shared workspace surfaces." as const;
export const SIGN_UP_EMAIL_HINT =
  "Your invitation is tied to this email address." as const;
export const SIGN_UP_PASSWORD_HINT =
  "Use at least 12 characters with letters, numbers, and symbols for a strong password." as const;

export const VERIFY_EMAIL_LEAD = AUTH_VERIFY_COPY.sentLead;
export const VERIFY_EMAIL_HINT = AUTH_VERIFY_COPY.sentHint;
export const VERIFY_EMAIL_SPAM_HINT = AUTH_VERIFY_COPY.spamHint;

export const MFA_OTP_DELIVERY_NOTICE =
  "We sent a sign-in code to your email." as const;
export const MFA_OTP_DELIVERY_HINT =
  "The code expires after a short time. Check spam if you do not see it within a few minutes." as const;

export const AUTH_SIGN_IN_COPY = {
  emailLabel: "Work email",
  emailPlaceholder: "name@company.com",
  passwordLabel: "Password",
  passwordPlaceholder: "••••••••",
  forgotPasswordLink: "Forgot password?",
  orContinueWithEmail: "Or continue with email",
  submitLabel: "Sign in with email",
  signingIn: "Signing in…",
  noAccountPrompt: "No account?",
  createAccountLink: "Create account",
} as const;

export const AUTH_SIGN_UP_COPY = {
  nameLabel: "Full name",
  namePlaceholder: "Your full name",
  emailLabel: "Email",
  emailPlaceholder: "name@company.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Create a strong password",
  createAccountButton: "Create account",
  creatingAccount: "Creating account…",
  alreadyHaveAccountLabel: "Already have an account?",
  signInLink: "Sign in",
  alreadyHaveAccessLabel: "Already have access?",
  returnToSignInLink: "Return to sign in",
} as const;

export const AUTH_MFA_COPY = {
  headingTotp: "Enter your authenticator code",
  headingOtp: "Enter the code from your email",
  headingBackupCode: "Enter a backup code",
  headingDefault: "Verify your identity",
  inputLabelTotp: "Authentication code",
  inputLabelOtp: "Email code",
  inputLabelBackupCode: "Backup code",
  inputLabelDefault: "Verification code",
  placeholderTotp: "000000",
  placeholderOtp: "000000",
  placeholderBackupCode: "Backup code",
  fieldHintTotp:
    "Open your authenticator app and enter the current 6-digit code.",
  fieldHintOtp: "Check your inbox for a one-time sign-in code.",
  fieldHintBackupCode:
    "Enter one of the backup codes you saved when you enabled two-factor authentication.",
  emptyCodeTotp: "Enter the code from your authenticator app.",
  emptyCodeOtp: "Enter the code sent to your email.",
  emptyCodeBackupCode: "Enter a backup code.",
  emptyCodeDefault: "Enter your verification code.",
  useEmailCodeLabel: "Use email code instead",
  useAuthCodeLabel: "Use authenticator code instead",
  useBackupCodeLabel: "Use a backup code instead",
  backToSignIn: "Back to sign in",
  sendingOtp: "Sending sign-in code…",
  verifying: "Verifying…",
  verifyAndContinue: "Verify and continue",
  otherVerificationOptions: "Other verification options",
  resendEmailCode: "Resend email code",
} as const;

/** Phrases that must not appear in user-facing auth copy (enumeration leaks). */
export const AUTH_ENUMERATION_FORBIDDEN_PHRASES = [
  /email not found/i,
  /invalid user/i,
  /password is incorrect/i,
  /user does not exist/i,
  /account not found/i,
  /no user found/i,
] as const;

export function collectAuthCopyStrings(): string[] {
  const buckets = [
    AUTH_SAFE_ERRORS,
    AUTH_SECURITY_COPY,
    AUTH_WORKSPACE_STUB_COPY,
    AUTH_INVITE_COPY,
    AUTH_VERIFY_COPY,
    AUTH_RECOVER_COPY,
  ];

  const strings: string[] = [];
  for (const bucket of buckets) {
    for (const value of Object.values(bucket)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          strings.push(item);
        }
        continue;
      }

      strings.push(value);
    }
  }

  return strings;
}
