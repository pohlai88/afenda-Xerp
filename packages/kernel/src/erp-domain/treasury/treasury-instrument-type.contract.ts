export const TREASURY_INSTRUMENT_TYPES = [
  "cash",
  "deposit",
  "bond",
  "derivative",
] as const;

export type TreasuryInstrumentType = (typeof TREASURY_INSTRUMENT_TYPES)[number];

export function isTreasuryInstrumentType(
  value: string
): value is TreasuryInstrumentType {
  return (TREASURY_INSTRUMENT_TYPES as readonly string[]).includes(value);
}
