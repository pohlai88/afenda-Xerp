import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type ProductionOrderId = Brand<string, "ProductionOrderId">;

export function brandProductionOrderId(
  value: string | ProductionOrderId
): ProductionOrderId {
  return brandTrimRequired(value, "productionOrderId") as ProductionOrderId;
}

export function toProductionOrderId(value: ProductionOrderId): string {
  return unbrand(value);
}

export type RoutingId = Brand<string, "RoutingId">;

export function brandRoutingId(value: string | RoutingId): RoutingId {
  return brandTrimRequired(value, "routingId") as RoutingId;
}

export function toRoutingId(value: RoutingId): string {
  return unbrand(value);
}

export type ProductionRunId = Brand<string, "ProductionRunId">;

export function brandProductionRunId(
  value: string | ProductionRunId
): ProductionRunId {
  return brandTrimRequired(value, "productionRunId") as ProductionRunId;
}

export function toProductionRunId(value: ProductionRunId): string {
  return unbrand(value);
}
