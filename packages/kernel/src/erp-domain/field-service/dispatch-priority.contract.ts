export const DISPATCH_PRIORITIES = [
  "routine",
  "same_day",
  "emergency",
] as const;

export type DispatchPriority = (typeof DISPATCH_PRIORITIES)[number];

export function isDispatchPriority(value: string): value is DispatchPriority {
  return (DISPATCH_PRIORITIES as readonly string[]).includes(value);
}
