import { unbrand } from "../brand/index.js";
import type { PrimitiveReference } from "./primitive-brand.contract.js";
import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";

export type DateFormat = PrimitiveReference<"DateFormat">;

/** Approved date format tokens — non-empty pattern string. */
const DATE_FORMAT_PATTERN = /^[\w./,\-\s]+$/;

export function parseDateFormat(value: string): DateFormat {
  const raw = value.trim();

  if (!raw) {
    throw new Error("DateFormat is required.");
  }

  rejectIfMisclassifiedId(raw, "DateFormat");

  if (!DATE_FORMAT_PATTERN.test(raw)) {
    throw new Error("DateFormat must be an approved format pattern.");
  }

  return raw as DateFormat;
}

export function brandDateFormat(value: string | DateFormat): DateFormat {
  if (typeof value !== "string") {
    return value;
  }

  return parseDateFormat(value);
}

export function toDateFormat(value: DateFormat): string {
  return unbrand(value);
}

export function normalizeDateFormatForWire(value: string | DateFormat): string {
  return typeof value === "string" ? value : toDateFormat(value);
}
