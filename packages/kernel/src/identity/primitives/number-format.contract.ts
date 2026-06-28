import { unbrand } from "../brand/index.js";
import type { PrimitiveReference } from "./primitive-brand.contract.js";
import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";

export type NumberFormat = PrimitiveReference<"NumberFormat">;

/** Approved number format tokens — non-empty pattern string. */
const NUMBER_FORMAT_PATTERN = /^[#0.,\-\s]+$/;

export function parseNumberFormat(value: string): NumberFormat {
  const raw = value.trim();

  if (!raw) {
    throw new Error("NumberFormat is required.");
  }

  rejectIfMisclassifiedId(raw, "NumberFormat");

  if (!NUMBER_FORMAT_PATTERN.test(raw)) {
    throw new Error("NumberFormat must be an approved format pattern.");
  }

  return raw as NumberFormat;
}

export function brandNumberFormat(value: string | NumberFormat): NumberFormat {
  if (typeof value !== "string") {
    return value;
  }

  return parseNumberFormat(value);
}

export function toNumberFormat(value: NumberFormat): string {
  return unbrand(value);
}

export function normalizeNumberFormatForWire(
  value: string | NumberFormat
): string {
  return typeof value === "string" ? value : toNumberFormat(value);
}
