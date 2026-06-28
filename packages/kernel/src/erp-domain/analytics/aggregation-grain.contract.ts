export const AGGREGATION_GRAINS = [
  "hour",
  "day",
  "week",
  "month",
  "quarter",
] as const;

export type AggregationGrain = (typeof AGGREGATION_GRAINS)[number];

export function isAggregationGrain(value: string): value is AggregationGrain {
  return (AGGREGATION_GRAINS as readonly string[]).includes(value);
}
