export const TAX_DOCUMENT_STATUSES = [
  "draft",
  "filed",
  "accepted",
  "rejected",
  "amended",
] as const;

export type TaxDocumentStatus = (typeof TAX_DOCUMENT_STATUSES)[number];

export function isTaxDocumentStatus(value: string): value is TaxDocumentStatus {
  return (TAX_DOCUMENT_STATUSES as readonly string[]).includes(value);
}
