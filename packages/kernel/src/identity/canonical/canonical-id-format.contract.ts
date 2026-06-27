/**
 * PAS-001 §4.1.3 — canonical enterprise ID format authority.
 *
 * Format: `<prefix>_<ulid_body>` where prefix is 3 lowercase letters from
 * `ID_FAMILIES` and ulid_body is 26 Crockford base32 characters (ULID spec).
 *
 * @see https://github.com/ulid/spec — Crockford alphabet excludes I, L, O, U.
 */

/** Registered family prefix — exactly three lowercase ASCII letters. */
export const CANONICAL_ID_PREFIX_PATTERN = "[a-z]{3}" as const;

export const CANONICAL_ID_SEPARATOR = "_" as const;

/** Crockford base32 ULID body — 26 characters, uppercase on the wire. */
export const CANONICAL_ID_BODY_PATTERN = "[0-9A-HJKMNP-TV-Z]{26}" as const;

export const CANONICAL_ID_BODY_LENGTH = 26 as const;
export const CANONICAL_ID_PREFIX_LENGTH = 3 as const;

/** ULID spec Crockford base32 alphabet (32 symbols). Shared with generator. */
export const CANONICAL_ID_CROCKFORD_ALPHABET =
  "0123456789ABCDEFGHJKMNPQRSTVWXYZ" as const;

export const CANONICAL_ID_PATTERN_SOURCE =
  `^${CANONICAL_ID_PREFIX_PATTERN}${CANONICAL_ID_SEPARATOR}${CANONICAL_ID_BODY_PATTERN}$` as const;

export const CANONICAL_ID_PATTERN = new RegExp(CANONICAL_ID_PATTERN_SOURCE);

export const CANONICAL_ID_BODY_PATTERN_SOURCE =
  `^${CANONICAL_ID_BODY_PATTERN}$` as const;

export const CANONICAL_ID_BODY_REGEX = new RegExp(
  CANONICAL_ID_BODY_PATTERN_SOURCE
);

/** SQL CHECK / family-specific full-ID pattern for a registered 3-char prefix. */
export function buildCanonicalEnterpriseIdPatternSource(
  prefix: string
): string {
  return `^${prefix}${CANONICAL_ID_SEPARATOR}${CANONICAL_ID_BODY_PATTERN}$`;
}

/** Family-specific full-ID regex for a registered 3-char prefix. */
export function buildCanonicalEnterpriseIdRegex(prefix: string): RegExp {
  return new RegExp(buildCanonicalEnterpriseIdPatternSource(prefix));
}

/** Governance compatibility alias — prefer `CANONICAL_ID_PATTERN_SOURCE`. */
export const ANY_CANONICAL_ENTERPRISE_ID_PATTERN = CANONICAL_ID_PATTERN_SOURCE;

/** Governance compatibility alias — prefer `CANONICAL_ID_PATTERN`. */
export const ANY_CANONICAL_ENTERPRISE_ID_REGEX = CANONICAL_ID_PATTERN;
