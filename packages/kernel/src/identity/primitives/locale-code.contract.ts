import { unbrand } from "../brand/index.js";
import type { PrimitiveReference } from "./primitive-brand.contract.js";
import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";

export type LocaleCode = PrimitiveReference<"LocaleCode">;

/** Structural BCP47-style locale tag — full platform validation is deferred. */
const LOCALE_CODE_PATTERN = /^[a-z]{2,3}(-[A-Za-z0-9]+)*$/;

export function parseLocaleCode(value: string): LocaleCode {
  const raw = value.trim();

  if (!raw) {
    throw new Error("localeCode is required.");
  }

  rejectIfMisclassifiedId(raw, "LocaleCode");

  if (!LOCALE_CODE_PATTERN.test(raw)) {
    throw new Error("LocaleCode must be a BCP47-style locale tag.");
  }

  return raw as LocaleCode;
}

export function brandLocaleCode(value: string | LocaleCode): LocaleCode {
  if (typeof value !== "string") {
    return value;
  }

  return parseLocaleCode(value);
}

export function toLocaleCode(value: LocaleCode): string {
  return unbrand(value);
}

export function normalizeLocaleCodeForWire(value: string | LocaleCode): string {
  return typeof value === "string" ? value : toLocaleCode(value);
}
