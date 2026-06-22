/**
 * Client payloads must never carry authority scope IDs.
 * Selection hints use slugs/headers; the server resolves and verifies membership.
 */
export const UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS = [
  "tenantId",
  "entityGroupId",
  "legalEntityId",
  "companyId",
  "organizationUnitId",
  "organizationId",
  "teamId",
  "projectId",
] as const;

export type UntrustedClientAuthorityFieldKey =
  (typeof UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS)[number];

const UNTRUSTED_CLIENT_AUTHORITY_FIELD_LOOKUP: Readonly<
  Record<UntrustedClientAuthorityFieldKey, true>
> = {
  tenantId: true,
  entityGroupId: true,
  legalEntityId: true,
  companyId: true,
  organizationUnitId: true,
  organizationId: true,
  teamId: true,
  projectId: true,
};

export function isUntrustedClientAuthorityFieldKey(
  key: string
): key is UntrustedClientAuthorityFieldKey {
  return Object.hasOwn(UNTRUSTED_CLIENT_AUTHORITY_FIELD_LOOKUP, key);
}

/** Returns forbidden authority keys present on a top-level request/action body. */
export function findUntrustedClientAuthorityFields(
  value: unknown
): readonly UntrustedClientAuthorityFieldKey[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  const record = value as Record<string, unknown>;

  return UNTRUSTED_CLIENT_AUTHORITY_FIELD_KEYS.filter((key) =>
    Object.hasOwn(record, key)
  );
}
