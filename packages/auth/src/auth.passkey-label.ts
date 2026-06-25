import { getAuthenticatorName } from "@better-auth/passkey";

export interface PasskeyDisplayLabelInput {
  readonly aaguid?: string | null;
  readonly name?: string | null;
}

/** Resolves a human-readable passkey label for user settings UI (ARCH-AUTH-001 Slice 13b). */
export function resolvePasskeyDisplayLabel(
  record: PasskeyDisplayLabelInput
): string {
  const trimmedName = record.name?.trim();

  if (trimmedName) {
    return trimmedName;
  }

  if (record.aaguid) {
    return getAuthenticatorName(record.aaguid) ?? "Passkey";
  }

  return "Passkey";
}
