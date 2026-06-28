/**
 * Inventory permission vocabulary — documents domains/actions for PERMISSION_REGISTRY parity.
 */
export const INVENTORY_PERMISSION_DOMAINS = [
  "product",
  "warehouse",
  "stockMovement",
  "stockReservation",
] as const;

export type InventoryPermissionDomain =
  (typeof INVENTORY_PERMISSION_DOMAINS)[number];

export const INVENTORY_PERMISSION_ACTIONS = {
  product: ["read", "manage"] as const,
  warehouse: ["read", "manage"] as const,
  stockMovement: ["read", "post", "cancel"] as const,
  stockReservation: ["read", "reserve", "fulfill", "cancel"] as const,
} as const satisfies Record<InventoryPermissionDomain, readonly string[]>;

export type InventoryPermissionAction<
  TDomain extends InventoryPermissionDomain = InventoryPermissionDomain,
> = (typeof INVENTORY_PERMISSION_ACTIONS)[TDomain][number];

export function toInventoryPermissionKey(
  domain: InventoryPermissionDomain,
  action: InventoryPermissionAction
): string {
  return `inventory.${domain}_${action}`;
}

export const INVENTORY_PERMISSION_KEY_VOCABULARY = [
  toInventoryPermissionKey("product", "read"),
  toInventoryPermissionKey("product", "manage"),
  toInventoryPermissionKey("warehouse", "read"),
  toInventoryPermissionKey("warehouse", "manage"),
  toInventoryPermissionKey("stockMovement", "read"),
  toInventoryPermissionKey("stockMovement", "post"),
  toInventoryPermissionKey("stockMovement", "cancel"),
  toInventoryPermissionKey("stockReservation", "read"),
  toInventoryPermissionKey("stockReservation", "reserve"),
  toInventoryPermissionKey("stockReservation", "fulfill"),
  toInventoryPermissionKey("stockReservation", "cancel"),
] as const;

export type InventoryPermissionKey =
  (typeof INVENTORY_PERMISSION_KEY_VOCABULARY)[number];
