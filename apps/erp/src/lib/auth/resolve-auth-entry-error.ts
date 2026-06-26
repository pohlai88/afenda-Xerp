import {
  AUTH_SAFE_ERRORS,
  AUTH_SECURITY_COPY,
} from "@/lib/auth/auth-copy.registry";

export type AuthEntryErrorReason = "unlinked";

const AUTH_ENTRY_ERROR_REASONS = [
  "unlinked",
] as const satisfies readonly AuthEntryErrorReason[];

export const AUTH_ENTRY_ERROR_MESSAGES: Record<AuthEntryErrorReason, string> = {
  unlinked: AUTH_SECURITY_COPY.unlinkedSessionLead,
};

export const AUTH_ENTRY_ERROR_HINTS: Record<AuthEntryErrorReason, string> = {
  unlinked: AUTH_SECURITY_COPY.unlinkedSessionHint,
};

export function resolveAuthEntryError(
  raw: string | null | undefined
): AuthEntryErrorReason | null {
  if (raw === undefined || raw === null || raw.length === 0) {
    return null;
  }

  return AUTH_ENTRY_ERROR_REASONS.includes(raw as AuthEntryErrorReason)
    ? (raw as AuthEntryErrorReason)
    : null;
}

export function mapAuthClientError(
  _providerMessage: string | undefined,
  fallback: keyof typeof AUTH_SAFE_ERRORS = "genericActionFailed"
): string {
  return AUTH_SAFE_ERRORS[fallback];
}
