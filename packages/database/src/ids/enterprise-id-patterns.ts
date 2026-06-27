/**
 * PAS-001 §4.1 / ADR-0022 — database-side CHECK patterns.
 *
 * Duplicated from `@afenda/kernel` identity patterns (package boundary).
 * Parity enforced by `check:enterprise-id-db-parity`.
 */

export const CANONICAL_ID_BODY_PATTERN = "[0-9A-HJKMNP-TV-Z]{26}" as const;

/** Enterprise ID families persisted on platform entity tables. */
export const ENTERPRISE_ID_FAMILY_PREFIXES = {
  tenant: "ten",
  entityGroup: "egp",
  company: "cmp",
  organization: "org",
  team: "tea",
  project: "prj",
  user: "usr",
  role: "rol",
  membership: "mem",
  permission: "per",
  policy: "pol",
  auditEvent: "aud",
  execution: "exe",
  correlation: "cor",
  ownershipInterest: "own",
  customer: "cus",
  supplier: "sup",
  product: "prd",
  employee: "emp",
  warehouse: "whs",
  document: "doc",
  asset: "ast",
} as const;

export type EnterpriseIdFamilyKey = keyof typeof ENTERPRISE_ID_FAMILY_PREFIXES;

export function buildEnterpriseIdCheckPattern(
  family: EnterpriseIdFamilyKey
): string {
  const prefix = ENTERPRISE_ID_FAMILY_PREFIXES[family];
  return `^${prefix}_${CANONICAL_ID_BODY_PATTERN}$`;
}
