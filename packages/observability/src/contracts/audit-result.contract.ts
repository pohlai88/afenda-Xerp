export const AUDIT_RESULTS = [
  "success",
  "failure",
  "blocked",
  "denied",
  "pending",
  "approved",
  "rejected",
  "reversed",
] as const;

export type AuditResult = (typeof AUDIT_RESULTS)[number];

export function isAuditResult(value: string): value is AuditResult {
  return AUDIT_RESULTS.includes(value as AuditResult);
}
