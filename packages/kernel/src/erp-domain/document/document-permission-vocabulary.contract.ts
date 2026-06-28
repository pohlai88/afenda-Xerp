export const DOCUMENT_PERMISSION_DOMAINS = [
  "document",
  "retention",
  "attachment",
] as const;

export type DocumentPermissionDomain =
  (typeof DOCUMENT_PERMISSION_DOMAINS)[number];

export const DOCUMENT_PERMISSION_ACTIONS = {
  document: ["read", "create", "manage"] as const,
  retention: ["read", "manage"] as const,
  attachment: ["read", "create"] as const,
} as const satisfies Record<DocumentPermissionDomain, readonly string[]>;

export type DocumentPermissionAction<
  TDomain extends DocumentPermissionDomain = DocumentPermissionDomain,
> = (typeof DOCUMENT_PERMISSION_ACTIONS)[TDomain][number];

export function toDocumentPermissionKey(
  domain: DocumentPermissionDomain,
  action: DocumentPermissionAction
): string {
  return `document.${domain}_${action}`;
}

export const DOCUMENT_PERMISSION_KEY_VOCABULARY = [
  toDocumentPermissionKey("document", "read"),
  toDocumentPermissionKey("document", "create"),
  toDocumentPermissionKey("document", "manage"),
  toDocumentPermissionKey("retention", "read"),
  toDocumentPermissionKey("retention", "manage"),
  toDocumentPermissionKey("attachment", "read"),
  toDocumentPermissionKey("attachment", "create"),
] as const;

export type DocumentPermissionKey =
  (typeof DOCUMENT_PERMISSION_KEY_VOCABULARY)[number];
