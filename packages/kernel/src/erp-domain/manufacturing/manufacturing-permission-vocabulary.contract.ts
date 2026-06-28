export const MANUFACTURING_PERMISSION_DOMAINS = [
  "productionOrder",
  "routing",
  "shopFloor",
] as const;

export type ManufacturingPermissionDomain =
  (typeof MANUFACTURING_PERMISSION_DOMAINS)[number];

export const MANUFACTURING_PERMISSION_ACTIONS = {
  productionOrder: ["read", "create", "approve", "cancel"] as const,
  routing: ["read", "manage"] as const,
  shopFloor: ["read", "create", "close"] as const,
} as const satisfies Record<ManufacturingPermissionDomain, readonly string[]>;

export type ManufacturingPermissionAction<
  TDomain extends ManufacturingPermissionDomain = ManufacturingPermissionDomain,
> = (typeof MANUFACTURING_PERMISSION_ACTIONS)[TDomain][number];

export function toManufacturingPermissionKey(
  domain: ManufacturingPermissionDomain,
  action: ManufacturingPermissionAction
): string {
  return `manufacturing.${domain}_${action}`;
}

export const MANUFACTURING_PERMISSION_KEY_VOCABULARY = [
  toManufacturingPermissionKey("productionOrder", "read"),
  toManufacturingPermissionKey("productionOrder", "create"),
  toManufacturingPermissionKey("productionOrder", "approve"),
  toManufacturingPermissionKey("productionOrder", "cancel"),
  toManufacturingPermissionKey("routing", "read"),
  toManufacturingPermissionKey("routing", "manage"),
  toManufacturingPermissionKey("shopFloor", "read"),
  toManufacturingPermissionKey("shopFloor", "create"),
  toManufacturingPermissionKey("shopFloor", "close"),
] as const;

export type ManufacturingPermissionKey =
  (typeof MANUFACTURING_PERMISSION_KEY_VOCABULARY)[number];
