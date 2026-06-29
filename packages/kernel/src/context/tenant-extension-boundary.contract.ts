/**
 * PAS-001 amendment — tenant extension boundary vocabulary (Kernel NS §3.1 · I6).
 *
 * Tenant-specific custom fields and UI extensions are explicitly non-authoritative
 * for kernel brands and operating-context layers.
 */

export const TENANT_EXTENSION_NON_AUTHORITATIVE_KINDS = [
  "custom_field",
  "tenant_metadata",
  "ui_extension",
] as const;

export type TenantExtensionNonAuthoritativeKind =
  (typeof TENANT_EXTENSION_NON_AUTHORITATIVE_KINDS)[number];

/** Canonical enterprise ID prefix pattern — extensions must not mimic these keys. */
export const TENANT_EXTENSION_FORBIDDEN_FIELD_KEY_PATTERN =
  /^[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}$/;

export interface TenantExtensionBoundaryVocabulary {
  readonly fieldKey: string;
  readonly kind: TenantExtensionNonAuthoritativeKind;
}

/** JSON/wire format — parse via `tenant-extension-boundary.parser.ts` at ingress. */
export interface WireTenantExtensionBoundaryVocabulary {
  readonly fieldKey: string;
  readonly kind: string;
}

export function isTenantExtensionNonAuthoritativeKind(
  value: string
): value is TenantExtensionNonAuthoritativeKind {
  return (
    TENANT_EXTENSION_NON_AUTHORITATIVE_KINDS as readonly string[]
  ).includes(value);
}

/** Fail-closed guard — extension keys must not look like canonical enterprise IDs. */
export function assertTenantExtensionFieldKeyDoesNotForkKernelBrand(
  fieldKey: string,
  label = "fieldKey"
): void {
  const trimmed = fieldKey.trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  if (TENANT_EXTENSION_FORBIDDEN_FIELD_KEY_PATTERN.test(trimmed)) {
    throw new Error(
      `${label} must not match canonical enterprise ID shape (<prefix>_<ulid>).`
    );
  }
}
