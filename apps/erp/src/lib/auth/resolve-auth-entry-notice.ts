export type AuthEntryNotice = "password-reset" | "verify-email";

const AUTH_ENTRY_NOTICES = [
  "password-reset",
  "verify-email",
] as const satisfies readonly AuthEntryNotice[];

export const AUTH_ENTRY_NOTICE_MESSAGES: Record<AuthEntryNotice, string> = {
  "password-reset":
    "Your password has been updated. Sign in with your new password.",
  "verify-email":
    "Check your email for a verification link, then sign in to continue.",
};

export const AUTH_ENTRY_NOTICE_HINTS: Record<AuthEntryNotice, string> = {
  "password-reset": "Use your updated password below.",
  "verify-email":
    "Open the verification link in your email, then return here to sign in.",
};

export function resolveAuthEntryNotice(
  raw: string | null | undefined
): AuthEntryNotice | null {
  if (raw === undefined || raw === null || raw.length === 0) {
    return null;
  }

  return AUTH_ENTRY_NOTICES.includes(raw as AuthEntryNotice)
    ? (raw as AuthEntryNotice)
    : null;
}
