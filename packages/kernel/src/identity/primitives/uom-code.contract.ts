import { unbrand } from "../brand/index.js";
import type { PrimitiveReference } from "./primitive-brand.contract.js";
import { rejectIfMisclassifiedId } from "./primitive-brand.helpers.js";

export type UomCode = PrimitiveReference<"UomCode">;

/** Approved UOM code — uppercase alphanumeric, 1–10 characters. */
const UOM_CODE_PATTERN = /^[A-Z0-9]{1,10}$/;

export function parseUomCode(value: string): UomCode {
  const trimmed = value.trim();

  rejectIfMisclassifiedId(trimmed, "UomCode");

  const raw = trimmed.toUpperCase();

  if (!UOM_CODE_PATTERN.test(raw)) {
    throw new Error(
      "UomCode must be an uppercase alphanumeric code up to 10 characters."
    );
  }

  return raw as UomCode;
}

export function brandUomCode(
  value: string | UomCode | null | undefined
): UomCode | null {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  return parseUomCode(value);
}

export function brandRequiredUomCode(value: string | UomCode): UomCode {
  if (typeof value !== "string") {
    return value;
  }

  return parseUomCode(value);
}

export function toUomCode(value: UomCode): string {
  return unbrand(value);
}

export function normalizeUomCodeForWire(
  value: string | UomCode | null | undefined
): string | null {
  if (value == null) {
    return null;
  }

  return typeof value === "string" ? value : toUomCode(value);
}
