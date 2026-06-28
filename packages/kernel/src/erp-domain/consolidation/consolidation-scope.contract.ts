export const CONSOLIDATION_SCOPES = [
  "legal",
  "management",
  "tax",
  "segment",
] as const;

export type ConsolidationScope = (typeof CONSOLIDATION_SCOPES)[number];

export function isConsolidationScope(
  value: string
): value is ConsolidationScope {
  return (CONSOLIDATION_SCOPES as readonly string[]).includes(value);
}
