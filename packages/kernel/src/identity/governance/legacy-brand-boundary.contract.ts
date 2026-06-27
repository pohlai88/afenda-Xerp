/**
 * @deprecated PAS-001 §4.1 — LEGACY ONLY. DO NOT IMPORT.
 *
 * Trim-only brand helpers that **do not** validate canonical enterprise ID
 * prefix or Crockford ULID body. Insufficient for the §4.1 enterprise boundary.
 *
 * **Wrong (prohibited for enterprise IDs):**
 * ```ts
 * const customerId = brandRequiredId<"CustomerId">(input.customerId, "customerId");
 * ```
 *
 * **Correct:**
 * ```ts
 * import { parseCustomerId } from "@afenda/kernel";
 * const customerId = parseCustomerId(input.customerId);
 * ```
 *
 * This module is retained for historical migration reference only.
 * It is intentionally excluded from `identity/index.ts` and `@afenda/kernel` root exports.
 */
import type { Brand } from "../brand/brand.contract.js";

/** @deprecated Use family `parse*` at trust boundaries — not for enterprise IDs. */
export function brandOptionalId<TBrand extends string>(
  value: string | Brand<string, TBrand> | null | undefined,
  label: string
): Brand<string, TBrand> | null {
  if (value == null) {
    return null;
  }

  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, TBrand>;
}

/** @deprecated Use family `parse*` at trust boundaries — not for enterprise IDs. */
export function brandRequiredId<TBrand extends string>(
  value: string | Brand<string, TBrand>,
  label: string
): Brand<string, TBrand> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, TBrand>;
}
