/** Fiscal period lifecycle states — vocabulary only, no period arithmetic. */
export const FISCAL_PERIOD_STATES = [
  "not_opened",
  "open",
  "closed",
  "locked",
  "adjusting",
] as const;

export type FiscalPeriodState = (typeof FISCAL_PERIOD_STATES)[number];

export function isFiscalPeriodState(value: string): value is FiscalPeriodState {
  return (FISCAL_PERIOD_STATES as readonly string[]).includes(value);
}
