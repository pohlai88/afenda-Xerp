import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, T>;
}

export type PriceListId = Brand<string, "PriceListId">;

export function brandPriceListId(value: string | PriceListId): PriceListId {
  return brandTrimRequired(value, "priceListId") as PriceListId;
}

export function toPriceListId(value: PriceListId): string {
  return unbrand(value);
}

export type PriceRuleSetId = Brand<string, "PriceRuleSetId">;

export function brandPriceRuleSetId(
  value: string | PriceRuleSetId
): PriceRuleSetId {
  return brandTrimRequired(value, "priceRuleSetId") as PriceRuleSetId;
}

export function toPriceRuleSetId(value: PriceRuleSetId): string {
  return unbrand(value);
}

export type DiscountApprovalId = Brand<string, "DiscountApprovalId">;

export function brandDiscountApprovalId(
  value: string | DiscountApprovalId
): DiscountApprovalId {
  return brandTrimRequired(value, "discountApprovalId") as DiscountApprovalId;
}

export function toDiscountApprovalId(value: DiscountApprovalId): string {
  return unbrand(value);
}
