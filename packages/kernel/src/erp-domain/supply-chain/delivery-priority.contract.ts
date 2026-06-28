export const DELIVERY_PRIORITIES = [
  "standard",
  "express",
  "same_day",
  "deferred",
] as const;

export type DeliveryPriority = (typeof DELIVERY_PRIORITIES)[number];

export function isDeliveryPriority(value: string): value is DeliveryPriority {
  return (DELIVERY_PRIORITIES as readonly string[]).includes(value);
}
