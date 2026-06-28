export const CONSOLIDATION_PERMISSION_DOMAINS = [
  "consolidationRun",
  "elimination",
  "reportingUnit",
] as const;

export type ConsolidationPermissionDomain =
  (typeof CONSOLIDATION_PERMISSION_DOMAINS)[number];

export const CONSOLIDATION_PERMISSION_ACTIONS = {
  consolidationRun: ["read", "create", "approve", "close"] as const,
  elimination: ["read", "manage"] as const,
  reportingUnit: ["read", "manage"] as const,
} as const satisfies Record<ConsolidationPermissionDomain, readonly string[]>;

export type ConsolidationPermissionAction<
  TDomain extends ConsolidationPermissionDomain = ConsolidationPermissionDomain,
> = (typeof CONSOLIDATION_PERMISSION_ACTIONS)[TDomain][number];

export function toConsolidationPermissionKey(
  domain: ConsolidationPermissionDomain,
  action: ConsolidationPermissionAction
): string {
  return `consolidation.${domain}_${action}`;
}

export const CONSOLIDATION_PERMISSION_KEY_VOCABULARY = [
  toConsolidationPermissionKey("consolidationRun", "read"),
  toConsolidationPermissionKey("consolidationRun", "create"),
  toConsolidationPermissionKey("consolidationRun", "approve"),
  toConsolidationPermissionKey("consolidationRun", "close"),
  toConsolidationPermissionKey("elimination", "read"),
  toConsolidationPermissionKey("elimination", "manage"),
  toConsolidationPermissionKey("reportingUnit", "read"),
  toConsolidationPermissionKey("reportingUnit", "manage"),
] as const;

export type ConsolidationPermissionKey =
  (typeof CONSOLIDATION_PERMISSION_KEY_VOCABULARY)[number];
