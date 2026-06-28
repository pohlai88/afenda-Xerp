export const RESOLUTION_TYPES = [
  "fixed",
  "workaround",
  "duplicate",
  "not_reproducible",
] as const;

export type ResolutionType = (typeof RESOLUTION_TYPES)[number];

export function isResolutionType(value: string): value is ResolutionType {
  return (RESOLUTION_TYPES as readonly string[]).includes(value);
}
