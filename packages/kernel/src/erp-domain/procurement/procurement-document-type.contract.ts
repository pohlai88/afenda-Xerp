export const PROCUREMENT_DOCUMENT_TYPES = [
  "requisition",
  "rfq",
  "purchase_order",
  "blanket_agreement",
] as const;

export type ProcurementDocumentType =
  (typeof PROCUREMENT_DOCUMENT_TYPES)[number];

export function isProcurementDocumentType(
  value: string
): value is ProcurementDocumentType {
  return (PROCUREMENT_DOCUMENT_TYPES as readonly string[]).includes(value);
}
