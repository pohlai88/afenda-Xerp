export const APPROVAL_DECISIONS = [
  "pending",
  "approved",
  "rejected",
  "delegated",
] as const;

export type ApprovalDecision = (typeof APPROVAL_DECISIONS)[number];

export function isApprovalDecision(value: string): value is ApprovalDecision {
  return (APPROVAL_DECISIONS as readonly string[]).includes(value);
}
