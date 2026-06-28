export const FULFILLMENT_EVENT_TYPES = [
  "pick",
  "pack",
  "ship",
  "deliver",
  "return",
] as const;

export type FulfillmentEventType = (typeof FULFILLMENT_EVENT_TYPES)[number];

export function isFulfillmentEventType(
  value: string
): value is FulfillmentEventType {
  return (FULFILLMENT_EVENT_TYPES as readonly string[]).includes(value);
}
