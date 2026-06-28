export const DISPOSITION_CODES = [
  "accept",
  "reject",
  "rework",
  "scrap",
  "use_as_is",
] as const;

export type DispositionCode = (typeof DISPOSITION_CODES)[number];

export function isDispositionCode(value: string): value is DispositionCode {
  return (DISPOSITION_CODES as readonly string[]).includes(value);
}
