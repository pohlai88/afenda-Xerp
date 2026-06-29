/**
 * PAS-001 amendment — effective-dating vocabulary helpers (Kernel NS §4 effective dating).
 *
 * Kernel carries as-of date words on hierarchy contexts; resolver "as-of" behavior is consumer-owned.
 */

/** Closed interval effective dating — `effectiveFrom` inclusive, `effectiveTo` inclusive or open. */
export function isRecordEffectiveAt(
  effectiveFrom: string,
  effectiveTo: string | null,
  asOf: string
): boolean {
  if (effectiveFrom > asOf) {
    return false;
  }

  return effectiveTo === null || effectiveTo >= asOf;
}

/** Nullable lower bound — open start when `effectiveFrom` is null. */
export function isNullableEffectiveRangeAt(
  effectiveFrom: string | null,
  effectiveTo: string | null,
  asOf: string
): boolean {
  if (effectiveFrom !== null && effectiveFrom > asOf) {
    return false;
  }

  return effectiveTo === null || effectiveTo >= asOf;
}
