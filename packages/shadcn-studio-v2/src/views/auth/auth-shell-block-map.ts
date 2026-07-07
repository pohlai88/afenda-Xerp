import type { ReactNode } from "react";

/** ERP metadata block IDs wired to public auth ingress surfaces. */
export const AUTH_SHELL_ERP_BLOCK_IDS = [
  "login-page-03",
  "login-page-04",
  "register-page-01",
  "forgot-password-page-01",
  "forgot-password-success-page-01",
  "reset-password-page-01",
  "reset-password-success-page-01",
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

export type AuthShellErpBlockId = (typeof AUTH_SHELL_ERP_BLOCK_IDS)[number];

export type AuthShellVariantPresetId =
  | "sign-in"
  | "otp"
  | "mfa"
  | "invite"
  | "error";

export interface AuthShellBlockPreset {
  readonly blockId: AuthShellErpBlockId;
  readonly description?: ReactNode;
  readonly title: ReactNode;
  readonly variantId: AuthShellVariantPresetId;
}

const VARIANT_PRESET_COPY = {
  "sign-in": {
    title: "Sign in to Afenda",
    description: "Use your workspace credentials to access operator surfaces.",
  },
  otp: {
    title: "Enter verification code",
    description: "We sent a one-time code to your registered device.",
  },
  mfa: {
    title: "Multi-factor authentication",
    description: "Confirm your identity with your authenticator app.",
  },
  invite: {
    title: "Accept workspace invitation",
    description: "Review the invitation details before joining the workspace.",
  },
  error: {
    title: "Authentication unavailable",
    description: "The sign-in request could not be completed. Try again.",
  },
} as const satisfies Record<
  AuthShellVariantPresetId,
  { readonly description: string; readonly title: string }
>;

const ERP_BLOCK_TO_VARIANT_ID: Record<
  AuthShellErpBlockId,
  AuthShellVariantPresetId
> = {
  "login-page-04": "sign-in",
  "register-page-01": "sign-in",
  "otp-page-01": "otp",
  "mfa-page-01": "mfa",
  "mfa-recovery-page-01": "mfa",
  "invite-page-01": "invite",
  "invite-accept-page-01": "invite",
  "invite-expired-page-01": "invite",
  "invite-invalid-page-01": "invite",
  "invite-consumed-page-01": "invite",
  "invite-email-mismatch-page-01": "invite",
  "error-passkey-page-01": "error",
  "error-sso-page-01": "error",
  "error-oauth-page-01": "error",
  "error-session-expired-page-01": "error",
  "error-access-denied-page-01": "error",
  "error-authentication-page-01": "error",
  "login-page-03": "sign-in",
  "forgot-password-page-01": "sign-in",
  "forgot-password-success-page-01": "sign-in",
  "reset-password-page-01": "sign-in",
  "reset-password-success-page-01": "sign-in",
  "verify-email-page-01": "sign-in",
  "verify-email-sent-page-01": "sign-in",
  "verify-email-expired-page-01": "sign-in",
  "verify-email-success-page-01": "sign-in",
  "passkey-page-01": "sign-in",
  "sso-page-01": "sign-in",
  "security-review-page-01": "error",
};

const ERP_BLOCK_COPY_OVERRIDES: Partial<
  Record<
    AuthShellErpBlockId,
    Pick<AuthShellBlockPreset, "title" | "description">
  >
> = {
  "login-page-04": {
    title: "Sign in to Afenda",
    description: "Use your workspace credentials to access operator surfaces.",
  },
  "login-page-03": {
    title: "Select workspace",
    description: "Choose the workspace scope for this sign-in session.",
  },
  "register-page-01": {
    title: "Accept invitation",
    description: "Create credentials for your approved Afenda ERP workspace.",
  },
  "error-access-denied-page-01": {
    title: "Access denied",
    description: "Use an approved account before accessing this workspace.",
  },
  "error-session-expired-page-01": {
    title: "Session expired",
    description: "Sign in again after the previous session expired.",
  },
};

function isAuthShellErpBlockId(
  blockId: string
): blockId is AuthShellErpBlockId {
  return (AUTH_SHELL_ERP_BLOCK_IDS as readonly string[]).includes(blockId);
}

export function resolveAuthShellBlockPreset(
  blockId: string
): AuthShellBlockPreset | undefined {
  if (!isAuthShellErpBlockId(blockId)) {
    return;
  }

  const variantId = ERP_BLOCK_TO_VARIANT_ID[blockId];
  const presetCopy = VARIANT_PRESET_COPY[variantId];
  const override = ERP_BLOCK_COPY_OVERRIDES[blockId];

  return {
    blockId,
    variantId,
    title: override?.title ?? presetCopy.title,
    description: override?.description ?? presetCopy.description,
  };
}

export function resolveAuthShellBlockPresetOrSignIn(
  blockId: string
): AuthShellBlockPreset {
  return (
    resolveAuthShellBlockPreset(blockId) ?? {
      blockId: "login-page-04",
      variantId: "sign-in",
      title: VARIANT_PRESET_COPY["sign-in"].title,
      description: VARIANT_PRESET_COPY["sign-in"].description,
    }
  );
}
