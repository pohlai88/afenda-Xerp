/**
 * PAS-001 §4.1.9 — frozen wire pattern sources for audit internal-entity PK guards.
 *
 * @afenda/observability cannot import @afenda/kernel at runtime. Pattern sources
 * are parity-validated against kernel authority via `pnpm check:observability-identity-parity`.
 */

/** Parity with kernel `CANONICAL_ID_PATTERN_SOURCE` (format tier only). */
export const AUDIT_CANONICAL_ENTERPRISE_ID_PATTERN_SOURCE =
  "^[a-z]{3}_[0-9A-HJKMNP-TV-Z]{26}$" as const;

/** Parity with kernel `UUID_V7_WIRE_PATTERN_SOURCE` (RFC 9562 UUID v7). */
export const AUDIT_UUID_V7_WIRE_PATTERN_SOURCE =
  "^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$" as const;

/** Parity with kernel `TENANT_HUMAN_REFERENCE_PATTERN_SOURCE` in primitive-brand.helpers. */
export const AUDIT_TENANT_HUMAN_REFERENCE_PATTERN_SOURCE =
  "^[A-Z][A-Z0-9]*-[A-Z0-9-]+$" as const;

export const AUDIT_CANONICAL_ENTERPRISE_ID_PATTERN = new RegExp(
  AUDIT_CANONICAL_ENTERPRISE_ID_PATTERN_SOURCE
);

export const AUDIT_UUID_V7_WIRE_PATTERN = new RegExp(
  AUDIT_UUID_V7_WIRE_PATTERN_SOURCE,
  "i"
);

export const AUDIT_TENANT_HUMAN_REFERENCE_PATTERN = new RegExp(
  AUDIT_TENANT_HUMAN_REFERENCE_PATTERN_SOURCE
);
