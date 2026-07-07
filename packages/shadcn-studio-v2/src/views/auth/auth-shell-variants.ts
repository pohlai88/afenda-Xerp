import type { ReactNode } from "react";

/** Canonical auth ingress presentation presets — naming aligned with ERP block IDs (read-only reference). */
export type AuthShellVariantPresetId =
  | "sign-in"
  | "otp"
  | "mfa"
  | "invite"
  | "error";

export interface AuthShellVariantPreset {
  readonly actions?: ReactNode;
  readonly blockId: string;
  readonly children?: ReactNode;
  readonly description?: ReactNode;
  readonly footer?: ReactNode;
  readonly id: AuthShellVariantPresetId;
  readonly secondaryActions?: ReactNode;
  readonly title: ReactNode;
}

export const AUTH_SHELL_VARIANT_PRESETS = {
  "sign-in": {
    id: "sign-in",
    blockId: "sign-in-page-01",
    title: "Sign in to Afenda",
    description: "Use your workspace credentials to access operator surfaces.",
  },
  otp: {
    id: "otp",
    blockId: "otp-page-01",
    title: "Enter verification code",
    description: "We sent a one-time code to your registered device.",
  },
  mfa: {
    id: "mfa",
    blockId: "mfa-page-01",
    title: "Multi-factor authentication",
    description: "Confirm your identity with your authenticator app.",
  },
  invite: {
    id: "invite",
    blockId: "invite-page-01",
    title: "Accept workspace invitation",
    description: "Review the invitation details before joining the workspace.",
  },
  error: {
    id: "error",
    blockId: "error-page-01",
    title: "Authentication unavailable",
    description: "The sign-in request could not be completed. Try again.",
  },
} as const satisfies Record<AuthShellVariantPresetId, AuthShellVariantPreset>;

export function getAuthShellVariantPreset(
  id: AuthShellVariantPresetId
): AuthShellVariantPreset {
  return AUTH_SHELL_VARIANT_PRESETS[id];
}

export const AUTH_SHELL_CANONICAL_VARIANT_IDS = [
  "sign-in",
  "otp",
  "mfa",
  "invite",
  "error",
] as const satisfies readonly AuthShellVariantPresetId[];
