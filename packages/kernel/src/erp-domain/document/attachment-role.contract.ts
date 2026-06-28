export const ATTACHMENT_ROLES = ["supporting", "primary", "signature"] as const;

export type AttachmentRole = (typeof ATTACHMENT_ROLES)[number];

export function isAttachmentRole(value: string): value is AttachmentRole {
  return (ATTACHMENT_ROLES as readonly string[]).includes(value);
}
