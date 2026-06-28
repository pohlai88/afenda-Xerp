export const PAYMENT_RUN_STATUSES = [
  "draft",
  "scheduled",
  "sent",
  "reconciled",
  "cancelled",
] as const;

export type PaymentRunStatus = (typeof PAYMENT_RUN_STATUSES)[number];

export function isPaymentRunStatus(value: string): value is PaymentRunStatus {
  return (PAYMENT_RUN_STATUSES as readonly string[]).includes(value);
}
