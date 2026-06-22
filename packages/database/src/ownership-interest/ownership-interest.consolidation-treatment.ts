import type { ConsolidationMethod } from "../database.types.js";

export const CONSOLIDATION_TREATMENTS = [
  "full_consolidation",
  "equity_method",
  "proportionate_consolidation",
  "fair_value_or_cost",
  "excluded",
] as const;

export type ConsolidationTreatment = (typeof CONSOLIDATION_TREATMENTS)[number];

const CONSOLIDATION_TREATMENT_TO_METHOD = {
  full_consolidation: "full",
  equity_method: "equity",
  proportionate_consolidation: "proportional",
  fair_value_or_cost: "cost",
  excluded: "none",
} as const satisfies Record<ConsolidationTreatment, ConsolidationMethod>;

const CONSOLIDATION_METHOD_TO_TREATMENT = {
  full: "full_consolidation",
  equity: "equity_method",
  proportional: "proportionate_consolidation",
  cost: "fair_value_or_cost",
  none: "excluded",
} as const satisfies Record<ConsolidationMethod, ConsolidationTreatment>;

export function isConsolidationTreatment(
  value: string
): value is ConsolidationTreatment {
  return (CONSOLIDATION_TREATMENTS as readonly string[]).includes(value);
}

export function consolidationTreatmentToMethod(
  treatment: ConsolidationTreatment
): ConsolidationMethod {
  return CONSOLIDATION_TREATMENT_TO_METHOD[treatment];
}

export function consolidationMethodToTreatment(
  method: ConsolidationMethod
): ConsolidationTreatment {
  return CONSOLIDATION_METHOD_TO_TREATMENT[method];
}
