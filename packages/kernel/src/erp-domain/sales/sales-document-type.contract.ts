export const SALES_DOCUMENT_TYPES = [
  "quote",
  "order",
  "contract",
  "return",
] as const;

export type SalesDocumentType = (typeof SALES_DOCUMENT_TYPES)[number];

export function isSalesDocumentType(value: string): value is SalesDocumentType {
  return (SALES_DOCUMENT_TYPES as readonly string[]).includes(value);
}
