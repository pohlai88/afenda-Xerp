/**
 * @afenda.l1-contract-envelope block-lifecycle
 * Role: Block lifecycle state vocabulary + isBlockLifecycleState guard
 * Family: block-lifecycle · flat L1 wire
 * Relies on: —
 * Relied on by: acceptance-record.contract, registry/block-lifecycle, index barrel
 * Refactored: 2026-07-01 · series flat-L1
 * Gate: check:studio-l1-contracts
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
