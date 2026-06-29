/**
 * PAS-001 amendment B112 — rounding mode vocabulary (Kernel NS §3.1 · ADR-0029).
 *
 * Platform-level rounding mode codes only — no rounding arithmetic in kernel.
 */

export const ROUNDING_MODES = [
  "half_up",
  "half_even",
  "down",
  "up",
  "half_down",
] as const;

export type RoundingMode = (typeof ROUNDING_MODES)[number];

export interface RoundingModeVocabulary {
  readonly mode: RoundingMode;
}

/** Wire JSON shape — parse via rounding-mode.parser.ts at ingress. */
export interface WireRoundingModeVocabulary {
  readonly mode: string;
}

export function isRoundingMode(value: string): value is RoundingMode {
  return (ROUNDING_MODES as readonly string[]).includes(value);
}
