/**
 * PAS-006B — presentation block lifecycle transitions (Presentation NS §8.1).
 */

export {
  BLOCK_LIFECYCLE_ORDER,
  type BlockLifecycleState,
  isBlockLifecycleState,
} from "../meta-contracts/block-lifecycle.contract.js";

import {
  BLOCK_LIFECYCLE_ORDER,
  type BlockLifecycleState,
} from "../meta-contracts/block-lifecycle.contract.js";

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
