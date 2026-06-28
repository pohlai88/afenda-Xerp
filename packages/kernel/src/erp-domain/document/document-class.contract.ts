export const DOCUMENT_CLASSES = [
  "invoice",
  "receipt",
  "contract",
  "certificate",
] as const;

export type DocumentClass = (typeof DOCUMENT_CLASSES)[number];

export function isDocumentClass(value: string): value is DocumentClass {
  return (DOCUMENT_CLASSES as readonly string[]).includes(value);
}
