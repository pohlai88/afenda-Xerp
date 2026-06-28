export const QUALITY_NOTIFICATION_PRIORITIES = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export type QualityNotificationPriority =
  (typeof QUALITY_NOTIFICATION_PRIORITIES)[number];

export function isQualityNotificationPriority(
  value: string
): value is QualityNotificationPriority {
  return (QUALITY_NOTIFICATION_PRIORITIES as readonly string[]).includes(value);
}
