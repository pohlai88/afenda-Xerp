export const METRIC_CATEGORIES = [
  "financial",
  "operational",
  "customer",
  "compliance",
] as const;

export type MetricCategory = (typeof METRIC_CATEGORIES)[number];

export function isMetricCategory(value: string): value is MetricCategory {
  return (METRIC_CATEGORIES as readonly string[]).includes(value);
}
