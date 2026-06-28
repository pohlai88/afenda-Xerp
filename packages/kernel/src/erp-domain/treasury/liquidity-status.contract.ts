export const LIQUIDITY_STATUSES = [
  "surplus",
  "balanced",
  "deficit",
  "blocked",
] as const;

export type LiquidityStatus = (typeof LIQUIDITY_STATUSES)[number];

export function isLiquidityStatus(value: string): value is LiquidityStatus {
  return (LIQUIDITY_STATUSES as readonly string[]).includes(value);
}
