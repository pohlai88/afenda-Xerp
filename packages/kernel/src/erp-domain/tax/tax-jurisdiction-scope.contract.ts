export const TAX_JURISDICTION_SCOPES = [
  "domestic",
  "interstate",
  "cross_border",
  "local",
] as const;

export type TaxJurisdictionScope = (typeof TAX_JURISDICTION_SCOPES)[number];

export function isTaxJurisdictionScope(
  value: string
): value is TaxJurisdictionScope {
  return (TAX_JURISDICTION_SCOPES as readonly string[]).includes(value);
}
