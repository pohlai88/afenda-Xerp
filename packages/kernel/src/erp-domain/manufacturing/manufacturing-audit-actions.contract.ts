export const MANUFACTURING_AUDIT_ACTIONS = [
  "order.released",
  "order.completed",
  "scrap.recorded",
  "yield.recorded",
] as const;

export type ManufacturingAuditAction =
  (typeof MANUFACTURING_AUDIT_ACTIONS)[number];

export function isManufacturingAuditAction(
  value: string
): value is ManufacturingAuditAction {
  return (MANUFACTURING_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseManufacturingAuditAction(
  value: string
): ManufacturingAuditAction | null {
  return isManufacturingAuditAction(value) ? value : null;
}
