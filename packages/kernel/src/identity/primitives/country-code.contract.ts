import { unbrand } from "../brand/index.js";
import type { PrimitiveReference } from "./primitive-brand.contract.js";
import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";

export type CountryCode = PrimitiveReference<"CountryCode">;

const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;

export function parseCountryCode(value: string): CountryCode {
  const trimmed = value.trim();

  rejectIfMisclassifiedId(trimmed, "CountryCode");

  const raw = trimmed.toUpperCase();

  if (!COUNTRY_CODE_PATTERN.test(raw)) {
    throw new Error("CountryCode must be a 2-letter uppercase ISO-style code.");
  }

  return raw as CountryCode;
}

export function brandCountryCode(
  value: string | CountryCode | null | undefined
): CountryCode | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  return parseCountryCode(value);
}

export function brandRequiredCountryCode(
  value: string | CountryCode
): CountryCode {
  if (typeof value !== "string") {
    return value;
  }

  return parseCountryCode(value);
}

export function toCountryCode(value: CountryCode): string {
  return unbrand(value);
}

export function normalizeCountryCodeForWire(
  value: string | CountryCode | null | undefined
): string | null {
  if (value == null) {
    return null;
  }

  return typeof value === "string" ? value : toCountryCode(value);
}
