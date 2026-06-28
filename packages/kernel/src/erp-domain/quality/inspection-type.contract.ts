export const INSPECTION_TYPES = [
  "incoming",
  "in_process",
  "final",
  "audit",
] as const;

export type InspectionType = (typeof INSPECTION_TYPES)[number];

export function isInspectionType(value: string): value is InspectionType {
  return (INSPECTION_TYPES as readonly string[]).includes(value);
}
