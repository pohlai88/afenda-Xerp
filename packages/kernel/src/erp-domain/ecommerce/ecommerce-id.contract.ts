import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

/**
 * Domain-scoped branded IDs (PAS-001B Rule 2).
 * CustomerId and ProductId remain under kernel business-reference authority.
 */

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

export type WebCartId = Brand<string, "WebCartId">;
export type CheckoutSessionId = Brand<string, "CheckoutSessionId">;
export type WebOrderId = Brand<string, "WebOrderId">;

export function brandWebCartId(value: string | WebCartId): WebCartId {
  return brandTrimRequired(value, "webCartId") as WebCartId;
}

export function brandCheckoutSessionId(
  value: string | CheckoutSessionId
): CheckoutSessionId {
  return brandTrimRequired(value, "checkoutSessionId") as CheckoutSessionId;
}

export function brandWebOrderId(value: string | WebOrderId): WebOrderId {
  return brandTrimRequired(value, "webOrderId") as WebOrderId;
}

export function toWebCartId(value: WebCartId): string {
  return unbrand(value);
}

export function toCheckoutSessionId(value: CheckoutSessionId): string {
  return unbrand(value);
}

export function toWebOrderId(value: WebOrderId): string {
  return unbrand(value);
}
