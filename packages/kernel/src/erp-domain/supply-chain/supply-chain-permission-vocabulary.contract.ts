export const SUPPLY_CHAIN_PERMISSION_DOMAINS = [
  "shipment",
  "deliveryRun",
  "transport",
] as const;

export type SupplyChainPermissionDomain =
  (typeof SUPPLY_CHAIN_PERMISSION_DOMAINS)[number];

export const SUPPLY_CHAIN_PERMISSION_ACTIONS = {
  shipment: ["read", "create", "send", "cancel"] as const,
  deliveryRun: ["read", "manage"] as const,
  transport: ["read", "manage"] as const,
} as const satisfies Record<SupplyChainPermissionDomain, readonly string[]>;

export type SupplyChainPermissionAction<
  TDomain extends SupplyChainPermissionDomain = SupplyChainPermissionDomain,
> = (typeof SUPPLY_CHAIN_PERMISSION_ACTIONS)[TDomain][number];

export function toSupplyChainPermissionKey(
  domain: SupplyChainPermissionDomain,
  action: SupplyChainPermissionAction
): string {
  return `supply-chain.${domain}_${action}`;
}

export const SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY = [
  toSupplyChainPermissionKey("shipment", "read"),
  toSupplyChainPermissionKey("shipment", "create"),
  toSupplyChainPermissionKey("shipment", "send"),
  toSupplyChainPermissionKey("shipment", "cancel"),
  toSupplyChainPermissionKey("deliveryRun", "read"),
  toSupplyChainPermissionKey("deliveryRun", "manage"),
  toSupplyChainPermissionKey("transport", "read"),
  toSupplyChainPermissionKey("transport", "manage"),
] as const;

export type SupplyChainPermissionKey =
  (typeof SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY)[number];
