import { assertWireRequiredText } from "./wire-text.assert.js";

/** Format guard only — not calendar-validity. Promote to date primitive when needed. */
export const ISO_CALENDAR_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function assertIsoCalendarDateOrNull(
  value: string | null,
  label: string
): void {
  if (value === null) {
    return;
  }

  if (!ISO_CALENDAR_DATE_PATTERN.test(value)) {
    throw new Error(
      `${label} must be an ISO calendar date in YYYY-MM-DD format.`
    );
  }
}

export function assertWireIsoCalendarDate(value: string, label: string): void {
  assertWireRequiredText(value, label);

  if (!ISO_CALENDAR_DATE_PATTERN.test(value)) {
    throw new Error(
      `${label} must be an ISO calendar date in YYYY-MM-DD format.`
    );
  }
}
