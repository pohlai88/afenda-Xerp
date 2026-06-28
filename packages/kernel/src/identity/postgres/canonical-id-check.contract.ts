/**
 * PAS-001 §4.1.12 / ADR-0022 — Postgres CHECK expectation contracts (not migrations).
 *
 * Freezes DB validation patterns derived from the kernel format authority.
 * Migrations and Drizzle helpers consume these expectations via parity gates.
 */

import { buildCanonicalEnterpriseIdPatternSource } from "../canonical/canonical-id-format.contract.js";
import {
  ENTERPRISE_ID_FAMILIES,
  type EnterpriseIdFamily,
  ID_FAMILIES,
} from "../registry/id-family.registry.js";

/**
 * Postgres `~` CHECK fragment for a registered three-letter enterprise ID prefix.
 *
 * Use {@link getPostgresCanonicalIdCheckPattern} when the family key is known.
 */
export function getCanonicalIdPostgresCheckPattern(prefix: string): string {
  return buildCanonicalEnterpriseIdPatternSource(prefix);
}

/** Frozen CHECK patterns for all 22 enterprise ID families — DB expectation only. */
export const CANONICAL_ID_POSTGRES_CHECKS: Record<EnterpriseIdFamily, string> =
  Object.freeze(
    Object.fromEntries(
      ENTERPRISE_ID_FAMILIES.map((family): [EnterpriseIdFamily, string] => [
        family,
        getCanonicalIdPostgresCheckPattern(ID_FAMILIES[family].prefix),
      ])
    ) as Record<EnterpriseIdFamily, string>
  );

export type PostgresCanonicalIdCheckPattern = {
  readonly family: EnterpriseIdFamily;
  readonly prefix: string;
  readonly pattern: string;
};

export const POSTGRES_CANONICAL_ID_CHECK_PATTERNS = ENTERPRISE_ID_FAMILIES.map(
  (family): PostgresCanonicalIdCheckPattern => ({
    family,
    prefix: ID_FAMILIES[family].prefix,
    pattern: getCanonicalIdPostgresCheckPattern(ID_FAMILIES[family].prefix),
  })
);

/**
 * Postgres `~` CHECK fragment for a registered enterprise ID family key.
 *
 * Use {@link getCanonicalIdPostgresCheckPattern} when only the prefix is known.
 */
export function getPostgresCanonicalIdCheckPattern(
  family: EnterpriseIdFamily
): string {
  return CANONICAL_ID_POSTGRES_CHECKS[family];
}

/**
 * Database parity gate alias for {@link getCanonicalIdPostgresCheckPattern}.
 *
 * `check:enterprise-id-db-parity` imports this symbol by name — keep stable.
 */
export const buildCanonicalEnterpriseIdCheckPattern =
  getCanonicalIdPostgresCheckPattern;
