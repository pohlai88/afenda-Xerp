/** Posting workflow status labels — no balance or amount fields. */
export const POSTING_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "posted",
  "reversed",
  "cancelled",
] as const;

export type PostingStatus = (typeof POSTING_STATUSES)[number];

export function isPostingStatus(value: string): value is PostingStatus {
  return (POSTING_STATUSES as readonly string[]).includes(value);
}
