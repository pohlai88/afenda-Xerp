export const MANUFACTURING_ORDER_TYPES = [
  "standard",
  "rework",
  "prototype",
  "disassembly",
] as const;

export type ManufacturingOrderType = (typeof MANUFACTURING_ORDER_TYPES)[number];

export function isManufacturingOrderType(
  value: string
): value is ManufacturingOrderType {
  return (MANUFACTURING_ORDER_TYPES as readonly string[]).includes(value);
}
