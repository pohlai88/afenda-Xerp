import { unbrand } from "../brand/index.js";
import type { PrimitiveReference } from "./primitive-brand.contract.js";
import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";

export type CurrencyCode = PrimitiveReference<"CurrencyCode">;

const CURRENCY_CODE_PATTERN = /^[A-Z]{3}$/;

export function parseCurrencyCode(value: string): CurrencyCode {
  const trimmed = value.trim();

  rejectIfMisclassifiedId(trimmed, "CurrencyCode");

  const raw = trimmed.toUpperCase();

  if (!CURRENCY_CODE_PATTERN.test(raw)) {
    throw new Error(
      "CurrencyCode must be a 3-letter uppercase ISO-style code."
    );
  }

  return raw as CurrencyCode;
}

export function brandCurrencyCode(
  value: string | CurrencyCode | null | undefined
): CurrencyCode | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  return parseCurrencyCode(value);
}

export function brandRequiredCurrencyCode(
  value: string | CurrencyCode
): CurrencyCode {
  if (typeof value !== "string") {
    return value;
  }

  return parseCurrencyCode(value);
}

export function toCurrencyCode(value: CurrencyCode): string {
  return unbrand(value);
}

export function normalizeCurrencyCodeForWire(
  value: string | CurrencyCode | null | undefined
): string | null {
  if (value == null) {
    return null;
  }

  return typeof value === "string" ? value : toCurrencyCode(value);
}
