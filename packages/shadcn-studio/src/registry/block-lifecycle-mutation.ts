/**
 * PAS-006B P06-004 — block lifecycle registry mutations (NS §8.1).
 */

import {
  type BlockLifecycleState,
  isValidBlockLifecycleTransition,
} from "./block-lifecycle.js";
import { SHADCN_STUDIO_BLOCK_PARITY_REGISTRY } from "./studio-block-parity.registry.js";

export interface BlockLifecycleRegistryEntry {
  readonly blockId: string;
  readonly lifecycleState: BlockLifecycleState;
}

export type BlockLifecycleTransitionFailure = {
  readonly ok: false;
  readonly code: "block-not-found" | "invalid-transition";
  readonly blockId: string;
  readonly from?: BlockLifecycleState;
  readonly to: BlockLifecycleState;
};

export type BlockLifecycleTransitionSuccess = {
  readonly ok: true;
  readonly entry: BlockLifecycleRegistryEntry;
};

export type BlockLifecycleTransitionResult =
  | BlockLifecycleTransitionSuccess
  | BlockLifecycleTransitionFailure;

export function buildInitialBlockLifecycleRegistry(): readonly BlockLifecycleRegistryEntry[] {
  return SHADCN_STUDIO_BLOCK_PARITY_REGISTRY.map(
    (parity) =>
      ({
        blockId: parity.mcpBlockId,
        lifecycleState: "imported",
      }) satisfies BlockLifecycleRegistryEntry
  );
}

export const BLOCK_LIFECYCLE_REGISTRY = buildInitialBlockLifecycleRegistry();

export function transitionBlockLifecycleEntry(
  entry: BlockLifecycleRegistryEntry,
  target: BlockLifecycleState
): BlockLifecycleTransitionResult {
  if (!isValidBlockLifecycleTransition(entry.lifecycleState, target)) {
    return {
      ok: false,
      code: "invalid-transition",
      blockId: entry.blockId,
      from: entry.lifecycleState,
      to: target,
    };
  }

  return {
    ok: true,
    entry: {
      blockId: entry.blockId,
      lifecycleState: target,
    },
  };
}

export function transitionBlockLifecycleRegistry(
  registry: readonly BlockLifecycleRegistryEntry[],
  blockId: string,
  target: BlockLifecycleState
): {
  readonly registry: readonly BlockLifecycleRegistryEntry[];
  readonly result: BlockLifecycleTransitionResult;
} {
  const index = registry.findIndex((entry) => entry.blockId === blockId);

  if (index === -1) {
    return {
      registry,
      result: {
        ok: false,
        code: "block-not-found",
        blockId,
        to: target,
      },
    };
  }

  const current = registry[index];
  if (current === undefined) {
    return {
      registry,
      result: {
        ok: false,
        code: "block-not-found",
        blockId,
        to: target,
      },
    };
  }

  const result = transitionBlockLifecycleEntry(current, target);

  if (!result.ok) {
    return { registry, result };
  }

  const next = registry.slice();
  next[index] = result.entry;

  return { registry: next, result };
}

export function assertBlockLifecycleRegistryValid(
  registry: readonly BlockLifecycleRegistryEntry[]
): boolean {
  return registry.every((entry) =>
    isValidBlockLifecycleTransition(entry.lifecycleState, entry.lifecycleState)
  );
}
