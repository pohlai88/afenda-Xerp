/**
 * PAS-001 amendment B112 — decimal precision vocabulary (Kernel NS §3.1 · ADR-0029).
 *
 * Scale codes (0–18) only — no decimal formatting or rounding execution in kernel.
 */

export const DECIMAL_PRECISION_MIN = 0 as const;
export const DECIMAL_PRECISION_MAX = 18 as const;

export type DecimalPrecision = number;

export interface DecimalPrecisionVocabulary {
  readonly scale: DecimalPrecision;
}

/** Wire JSON shape — parse via decimal-precision.parser.ts at ingress. */
export interface WireDecimalPrecisionVocabulary {
  readonly scale: number;
}

export function isDecimalPrecisionScale(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= DECIMAL_PRECISION_MIN &&
    value <= DECIMAL_PRECISION_MAX
  );
}
