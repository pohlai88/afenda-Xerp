export const SUPPLY_CHAIN_AUDIT_ACTIONS = [
  "shipment.dispatched",
  "shipment.delivered",
  "leg.started",
  "exception.recorded",
] as const;

export type SupplyChainAuditAction =
  (typeof SUPPLY_CHAIN_AUDIT_ACTIONS)[number];

export function isSupplyChainAuditAction(
  value: string
): value is SupplyChainAuditAction {
  return (SUPPLY_CHAIN_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseSupplyChainAuditAction(
  value: string
): SupplyChainAuditAction | null {
  return isSupplyChainAuditAction(value) ? value : null;
}
