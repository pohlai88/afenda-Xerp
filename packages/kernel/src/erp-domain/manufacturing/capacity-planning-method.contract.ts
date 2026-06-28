export const CAPACITY_PLANNING_METHODS = [
  "finite",
  "infinite",
  "hybrid",
] as const;

export type CapacityPlanningMethod = (typeof CAPACITY_PLANNING_METHODS)[number];

export function isCapacityPlanningMethod(
  value: string
): value is CapacityPlanningMethod {
  return (CAPACITY_PLANNING_METHODS as readonly string[]).includes(value);
}
