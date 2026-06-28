export const TAX_AUDIT_ACTIONS = [
  "declaration.filed",
  "declaration.accepted",
  "withholding.calculated",
  "rate.updated",
] as const;

export type TaxAuditAction = (typeof TAX_AUDIT_ACTIONS)[number];

export function isTaxAuditAction(value: string): value is TaxAuditAction {
  return (TAX_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseTaxAuditAction(value: string): TaxAuditAction | null {
  return isTaxAuditAction(value) ? value : null;
}
