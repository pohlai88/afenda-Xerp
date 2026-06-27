import { type Brand, unbrand } from "../brand/brand.contract.js";
import {
  brandTrimOptional,
  brandTrimRequired,
  parsePrimitive,
} from "./primitive-brand.helpers.js";

export type CurrencyCode = Brand<string, "CurrencyCode">;

export function parseCurrencyCode(value: string): CurrencyCode {
  return parsePrimitive<"CurrencyCode">(value, "currencyCode");
}

export function brandCurrencyCode(
  value: string | CurrencyCode | null | undefined
): CurrencyCode | null {
  return brandTrimOptional(value, "currencyCode") as CurrencyCode | null;
}

export function brandRequiredCurrencyCode(
  value: string | CurrencyCode
): CurrencyCode {
  return brandTrimRequired(value, "currencyCode") as CurrencyCode;
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
