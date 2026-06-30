/**
 * PAS-006B — block lifecycle wire vocabulary (Presentation NS §8.1).
 */

export const BLOCK_LIFECYCLE_ORDER = [
  "imported",
  "normalized",
  "stabilized",
  "theme-bound",
  "metadata-bound",
  "accepted",
  "production-wired",
  "customized",
  "deprecated",
  "retired",
] as const;

export type BlockLifecycleState = (typeof BLOCK_LIFECYCLE_ORDER)[number];

export function isBlockLifecycleState(
  value: unknown
): value is BlockLifecycleState {
  return (
    typeof value === "string" &&
    (BLOCK_LIFECYCLE_ORDER as readonly string[]).includes(value)
  );
}
