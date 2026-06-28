/**
 * Inventory domain audit action vocabulary — observability-compatible strings.
 */
export const INVENTORY_AUDIT_ACTIONS = [
  "product.created",
  "product.updated",
  "product.deactivated",
  "warehouse.created",
  "warehouse.updated",
  "movement.drafted",
  "movement.posted",
  "movement.cancelled",
  "reservation.created",
  "reservation.fulfilled",
  "count.opened",
  "count.closed",
] as const;

export type InventoryAuditAction = (typeof INVENTORY_AUDIT_ACTIONS)[number];

export function isInventoryAuditAction(
  value: string
): value is InventoryAuditAction {
  return (INVENTORY_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseInventoryAuditAction(
  value: string
): InventoryAuditAction | null {
  return isInventoryAuditAction(value) ? value : null;
}
