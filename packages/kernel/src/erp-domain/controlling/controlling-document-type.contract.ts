export const CONTROLLING_DOCUMENT_TYPES = [
  "plan",
  "actual",
  "forecast",
  "variance",
] as const;

export type ControllingDocumentType =
  (typeof CONTROLLING_DOCUMENT_TYPES)[number];

export function isControllingDocumentType(
  value: string
): value is ControllingDocumentType {
  return (CONTROLLING_DOCUMENT_TYPES as readonly string[]).includes(value);
}
