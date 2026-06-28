export const SOURCING_METHODS = [
  "catalog",
  "rfq",
  "auction",
  "direct",
] as const;

export type SourcingMethod = (typeof SOURCING_METHODS)[number];

export function isSourcingMethod(value: string): value is SourcingMethod {
  return (SOURCING_METHODS as readonly string[]).includes(value);
}
