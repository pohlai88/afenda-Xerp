export const SHOP_FLOOR_EVENT_TYPES = [
  "start",
  "pause",
  "scrap",
  "yield",
  "complete",
] as const;

export type ShopFloorEventType = (typeof SHOP_FLOOR_EVENT_TYPES)[number];

export function isShopFloorEventType(
  value: string
): value is ShopFloorEventType {
  return (SHOP_FLOOR_EVENT_TYPES as readonly string[]).includes(value);
}
