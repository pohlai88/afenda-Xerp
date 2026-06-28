export const DOCUMENT_LIFECYCLE_STATUSES = [
  "draft",
  "active",
  "archived",
  "purged",
] as const;

export type DocumentLifecycleStatus =
  (typeof DOCUMENT_LIFECYCLE_STATUSES)[number];

export function isDocumentLifecycleStatus(
  value: string
): value is DocumentLifecycleStatus {
  return (DOCUMENT_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}
