export const DOCUMENT_AUDIT_ACTIONS = [
  "document.archived",
  "document.purged",
  "retention.applied",
  "attachment.linked",
] as const;

export type DocumentAuditAction = (typeof DOCUMENT_AUDIT_ACTIONS)[number];

export function isDocumentAuditAction(
  value: string
): value is DocumentAuditAction {
  return (DOCUMENT_AUDIT_ACTIONS as readonly string[]).includes(value);
}

export function parseDocumentAuditAction(
  value: string
): DocumentAuditAction | null {
  return isDocumentAuditAction(value) ? value : null;
}
