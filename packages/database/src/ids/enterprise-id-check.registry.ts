/**
 * PAS §4.1 — live platform table CHECK constraint registry (ADR-0022).
 *
 * TypeScript parser (@afenda/kernel) + Postgres CHECK = two-layer enforcement.
 */

import {
  buildEnterpriseIdCheckPattern,
  type EnterpriseIdFamilyKey,
} from "./enterprise-id-patterns.js";
import { LIVE_PLATFORM_ENTITY_TABLES } from "./platform-entity-table-registry.js";

export interface EnterpriseIdCheckRegistryEntry {
  readonly checkPattern: string;
  readonly constraintName: string;
  readonly family: EnterpriseIdFamilyKey;
  readonly tableName: string;
}

export const LIVE_ENTERPRISE_ID_CHECK_REGISTRY =
  LIVE_PLATFORM_ENTITY_TABLES.map(
    (entry): EnterpriseIdCheckRegistryEntry => ({
      family: entry.family,
      tableName: entry.tableName,
      constraintName: `enterprise_id_${entry.family}_format`,
      checkPattern: buildEnterpriseIdCheckPattern(entry.family),
    })
  );

export const ENTERPRISE_ID_FORMAT_CHECKS_MIGRATION_TAG =
  "20260627022317_enterprise_id_format_checks" as const;

export function buildEnterpriseIdFormatChecksCompleteProbe(): string {
  const existsClauses = LIVE_ENTERPRISE_ID_CHECK_REGISTRY.map(
    (entry) =>
      `EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${entry.constraintName}')`
  ).join("\n      AND ");

  return `
    SELECT (
      ${existsClauses}
    ) AS ok`;
}

export function buildEnterpriseIdFormatChecksPartialProbe(): string {
  const anyClause = LIVE_ENTERPRISE_ID_CHECK_REGISTRY.map(
    (entry) =>
      `EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '${entry.constraintName}')`
  ).join("\n      OR ");

  return `
    SELECT (
      ${anyClause}
    ) AS partial`;
}

export function buildEnterpriseIdFormatChecksPartialCleanup(): readonly string[] {
  return LIVE_ENTERPRISE_ID_CHECK_REGISTRY.map(
    (entry) =>
      `ALTER TABLE "${entry.tableName}" DROP CONSTRAINT IF EXISTS "${entry.constraintName}"`
  );
}
