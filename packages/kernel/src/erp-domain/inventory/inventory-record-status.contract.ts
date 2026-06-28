export const INVENTORY_RECORD_STATUSES = [
  "active",
  "blocked",
  "quarantine",
  "discontinued",
] as const;

export type InventoryRecordStatus = (typeof INVENTORY_RECORD_STATUSES)[number];

export function isInventoryRecordStatus(
  value: string
): value is InventoryRecordStatus {
  return (INVENTORY_RECORD_STATUSES as readonly string[]).includes(value);
}
