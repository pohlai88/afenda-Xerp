import { type Brand, unbrand } from "../brand/brand.contract.js";
import {
  brandTrimRequired,
  parsePrimitive,
} from "./primitive-brand.helpers.js";

export type LocaleCode = Brand<string, "LocaleCode">;

export function parseLocaleCode(value: string): LocaleCode {
  return parsePrimitive<"LocaleCode">(value, "localeCode");
}

export function brandLocaleCode(value: string | LocaleCode): LocaleCode {
  return brandTrimRequired(value, "localeCode") as LocaleCode;
}

export function toLocaleCode(value: LocaleCode): string {
  return unbrand(value);
}

export function normalizeLocaleCodeForWire(value: string | LocaleCode): string {
  return typeof value === "string" ? value : toLocaleCode(value);
}
