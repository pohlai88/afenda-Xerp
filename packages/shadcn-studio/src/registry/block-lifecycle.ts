/**
 * PAS-006B — presentation block lifecycle (Presentation NS §8.1).
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

const BLOCK_LIFECYCLE_INDEX: Readonly<Record<BlockLifecycleState, number>> =
  BLOCK_LIFECYCLE_ORDER.reduce(
    (accumulator, state, index) => {
      accumulator[state] = index;
      return accumulator;
    },
    {} as Record<BlockLifecycleState, number>
  );

export function isValidBlockLifecycleTransition(
  from: BlockLifecycleState,
  to: BlockLifecycleState
): boolean {
  if (from === to) {
    return true;
  }

  if (from === "retired") {
    return false;
  }

  const fromIndex = BLOCK_LIFECYCLE_INDEX[from];
  const toIndex = BLOCK_LIFECYCLE_INDEX[to];

  return toIndex === fromIndex + 1;
}
