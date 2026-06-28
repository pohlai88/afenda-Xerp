export const JOURNAL_DOCUMENT_TYPES = [
  "standard",
  "adjusting",
  "reversing",
  "opening_balance",
  "accrual",
  "intercompany",
  "consolidation",
] as const;

export type JournalDocumentType = (typeof JOURNAL_DOCUMENT_TYPES)[number];

export function isJournalDocumentType(
  value: string
): value is JournalDocumentType {
  return (JOURNAL_DOCUMENT_TYPES as readonly string[]).includes(value);
}
