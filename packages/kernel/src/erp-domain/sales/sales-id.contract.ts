import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type SalesOrderId = Brand<string, "SalesOrderId">;

export function brandSalesOrderId(value: string | SalesOrderId): SalesOrderId {
  return brandTrimRequired(value, "salesOrderId") as SalesOrderId;
}

export function toSalesOrderId(value: SalesOrderId): string {
  return unbrand(value);
}

export type QuoteId = Brand<string, "QuoteId">;

export function brandQuoteId(value: string | QuoteId): QuoteId {
  return brandTrimRequired(value, "quoteId") as QuoteId;
}

export function toQuoteId(value: QuoteId): string {
  return unbrand(value);
}

export type DeliveryScheduleId = Brand<string, "DeliveryScheduleId">;

export function brandDeliveryScheduleId(
  value: string | DeliveryScheduleId
): DeliveryScheduleId {
  return brandTrimRequired(value, "deliveryScheduleId") as DeliveryScheduleId;
}

export function toDeliveryScheduleId(value: DeliveryScheduleId): string {
  return unbrand(value);
}
