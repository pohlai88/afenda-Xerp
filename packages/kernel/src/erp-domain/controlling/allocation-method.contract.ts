export const ALLOCATION_METHODS = [
  "direct",
  "step_down",
  "reciprocal",
  "activity_based",
] as const;

export type AllocationMethod = (typeof ALLOCATION_METHODS)[number];

export function isAllocationMethod(value: string): value is AllocationMethod {
  return (ALLOCATION_METHODS as readonly string[]).includes(value);
}
