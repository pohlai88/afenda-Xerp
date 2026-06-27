import { type SQL, sql } from "drizzle-orm";
import { type AnyPgColumn, check } from "drizzle-orm/pg-core";

import {
  buildEnterpriseIdCheckPattern,
  type EnterpriseIdFamilyKey,
} from "./enterprise-id-patterns.js";

/**
 * Table-level CHECK for Kernel canonical `enterprise_id` format.
 * Allows NULL during phased backfill migrations (ADR-0022).
 *
 * Pairs with {@link LIVE_ENTERPRISE_ID_CHECK_REGISTRY} SQL migration for
 * TypeScript parser + Postgres CHECK two-layer enforcement (PAS §4.1).
 */
export function enterpriseIdFormatCheck(
  column: AnyPgColumn,
  family: EnterpriseIdFamilyKey,
  constraintName?: string
) {
  const pattern = buildEnterpriseIdCheckPattern(family);
  const name = constraintName ?? `enterprise_id_${family}_format`;
  return check(name, sql`(${column} is null or ${column} ~ ${pattern})` as SQL);
}

/** Mirrors Postgres `(enterprise_id IS NULL OR enterprise_id ~ pattern)` for tests and probes. */
export function satisfiesEnterpriseIdFormatCheck(
  enterpriseId: string | null,
  family: EnterpriseIdFamilyKey
): boolean {
  if (enterpriseId === null) {
    return true;
  }

  return new RegExp(buildEnterpriseIdCheckPattern(family)).test(enterpriseId);
}

/** @deprecated Use enterpriseIdFormatCheck */
export const enterpriseIdCheckConstraint = enterpriseIdFormatCheck;
