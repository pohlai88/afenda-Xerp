export const ELIMINATION_TYPES = [
  "investment",
  "intercompany",
  "unrealized",
  "dividend",
] as const;

export type EliminationType = (typeof ELIMINATION_TYPES)[number];

export function isEliminationType(value: string): value is EliminationType {
  return (ELIMINATION_TYPES as readonly string[]).includes(value);
}
