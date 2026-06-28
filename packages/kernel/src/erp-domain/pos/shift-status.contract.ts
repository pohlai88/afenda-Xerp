export const SHIFT_STATUSES = ["open", "closing", "closed"] as const;

export type ShiftStatus = (typeof SHIFT_STATUSES)[number];

export function isShiftStatus(value: string): value is ShiftStatus {
  return (SHIFT_STATUSES as readonly string[]).includes(value);
}
