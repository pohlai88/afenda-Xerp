/** Consolidation method labels — contract-only; no elimination arithmetic. */
export const CONSOLIDATION_METHODS = [
  "full",
  "proportional",
  "equity",
  "cost",
  "none",
] as const;

export type ConsolidationMethod = (typeof CONSOLIDATION_METHODS)[number];

export function isConsolidationMethod(
  value: string
): value is ConsolidationMethod {
  return (CONSOLIDATION_METHODS as readonly string[]).includes(value);
}
