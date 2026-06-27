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

/** Postgres `~` CHECK fragment for a registered enterprise ID prefix. */
export function getCanonicalIdPostgresCheckPattern(prefix: string): string {
  return buildCanonicalEnterpriseIdPatternSource(prefix);
}

function buildCanonicalIdPostgresChecks(): Record<EnterpriseIdFamily, string> {
  const checks = {} as Record<EnterpriseIdFamily, string>;
  for (const family of ENTERPRISE_ID_FAMILIES) {
    checks[family] = getCanonicalIdPostgresCheckPattern(
      ID_FAMILIES[family].prefix
    );
  }
  return checks;
}

/** Frozen CHECK patterns for all 22 enterprise ID families — DB expectation only. */
export const CANONICAL_ID_POSTGRES_CHECKS = buildCanonicalIdPostgresChecks();

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

export function getPostgresCanonicalIdCheckPattern(
  family: EnterpriseIdFamily
): string {
  return CANONICAL_ID_POSTGRES_CHECKS[family];
}

/** Governance compatibility alias — prefer `getCanonicalIdPostgresCheckPattern`. */
export const buildCanonicalEnterpriseIdCheckPattern =
  getCanonicalIdPostgresCheckPattern;
