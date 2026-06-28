export const ESCALATION_REASONS = [
  "timeout",
  "rejection",
  "policy",
  "manual",
] as const;

export type EscalationReason = (typeof ESCALATION_REASONS)[number];

export function isEscalationReason(value: string): value is EscalationReason {
  return (ESCALATION_REASONS as readonly string[]).includes(value);
}
