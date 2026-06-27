import { unbrand } from "../brand/brand.contract.js";
import type { PrimitiveReference } from "./primitive-brand.contract.js";
import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";

export type TimezoneId = PrimitiveReference<"TimezoneId">;

export function parseTimezoneId(value: string): TimezoneId {
  const raw = value.trim();

  if (!raw) {
    throw new Error("timezoneId is required.");
  }

  rejectIfMisclassifiedId(raw, "TimezoneId");

  if (/^[+-]/.test(raw)) {
    throw new Error("TimezoneId must not be a UTC offset.");
  }

  // Structural IANA check only — full platform timezone validation is deferred.
  if (!raw.includes("/") && raw !== "UTC") {
    throw new Error("TimezoneId must be an IANA-style timezone ID.");
  }

  return raw as TimezoneId;
}

export function brandTimezoneId(value: string | TimezoneId): TimezoneId {
  if (typeof value !== "string") {
    return value;
  }

  return parseTimezoneId(value);
}

export function toTimezoneId(value: TimezoneId): string {
  return unbrand(value);
}

export function normalizeTimezoneIdForWire(value: string | TimezoneId): string {
  return typeof value === "string" ? value : toTimezoneId(value);
}
