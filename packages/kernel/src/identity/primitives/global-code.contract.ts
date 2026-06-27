import { type Brand, unbrand } from "../brand/brand.contract.js";
import {
  brandTrimOptional,
  brandTrimRequired,
  parsePrimitive,
} from "./primitive-brand.helpers.js";

export type TimezoneId = Brand<string, "TimezoneId">;
export type DateFormat = Brand<string, "DateFormat">;
export type NumberFormat = Brand<string, "NumberFormat">;
export type CountryCode = Brand<string, "CountryCode">;
export type UomCode = Brand<string, "UomCode">;

export function parseTimezoneId(value: string): TimezoneId {
  return parsePrimitive<"TimezoneId">(value, "timezoneId");
}

export function parseDateFormat(value: string): DateFormat {
  return parsePrimitive<"DateFormat">(value, "dateFormat");
}

export function parseNumberFormat(value: string): NumberFormat {
  return parsePrimitive<"NumberFormat">(value, "numberFormat");
}

export function parseCountryCode(value: string): CountryCode {
  return parsePrimitive<"CountryCode">(value, "countryCode");
}

export function parseUomCode(value: string): UomCode {
  return parsePrimitive<"UomCode">(value, "uomCode");
}

export function brandTimezoneId(value: string | TimezoneId): TimezoneId {
  return brandTrimRequired(value, "timezoneId") as TimezoneId;
}

export function brandDateFormat(value: string | DateFormat): DateFormat {
  return brandTrimRequired(value, "dateFormat") as DateFormat;
}

export function brandNumberFormat(value: string | NumberFormat): NumberFormat {
  return brandTrimRequired(value, "numberFormat") as NumberFormat;
}

export function brandCountryCode(
  value: string | CountryCode | null | undefined
): CountryCode | null {
  return brandTrimOptional(value, "countryCode") as CountryCode | null;
}

export function brandRequiredCountryCode(
  value: string | CountryCode
): CountryCode {
  return brandTrimRequired(value, "countryCode") as CountryCode;
}

export function brandUomCode(
  value: string | UomCode | null | undefined
): UomCode | null {
  return brandTrimOptional(value, "uomCode") as UomCode | null;
}

export function brandRequiredUomCode(value: string | UomCode): UomCode {
  return brandTrimRequired(value, "uomCode") as UomCode;
}

export function toTimezoneId(value: TimezoneId): string {
  return unbrand(value);
}

export function toDateFormat(value: DateFormat): string {
  return unbrand(value);
}

export function toNumberFormat(value: NumberFormat): string {
  return unbrand(value);
}

export function toCountryCode(value: CountryCode): string {
  return unbrand(value);
}

export function toUomCode(value: UomCode): string {
  return unbrand(value);
}

export function normalizeTimezoneIdForWire(value: string | TimezoneId): string {
  return typeof value === "string" ? value : toTimezoneId(value);
}

export function normalizeDateFormatForWire(value: string | DateFormat): string {
  return typeof value === "string" ? value : toDateFormat(value);
}

export function normalizeNumberFormatForWire(
  value: string | NumberFormat
): string {
  return typeof value === "string" ? value : toNumberFormat(value);
}

export function normalizeCountryCodeForWire(
  value: string | CountryCode | null | undefined
): string | null {
  if (value == null) {
    return null;
  }
  return typeof value === "string" ? value : toCountryCode(value);
}

export function normalizeUomCodeForWire(
  value: string | UomCode | null | undefined
): string | null {
  if (value == null) {
    return null;
  }
  return typeof value === "string" ? value : toUomCode(value);
}
