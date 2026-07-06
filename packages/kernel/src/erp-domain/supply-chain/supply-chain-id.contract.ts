import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type ShipmentId = Brand<string, "ShipmentId">;

export function brandShipmentId(value: string | ShipmentId): ShipmentId {
  return brandTrimRequired(value, "shipmentId") as ShipmentId;
}

export function toShipmentId(value: ShipmentId): string {
  return unbrand(value);
}

export type DeliveryRunId = Brand<string, "DeliveryRunId">;

export function brandDeliveryRunId(
  value: string | DeliveryRunId
): DeliveryRunId {
  return brandTrimRequired(value, "deliveryRunId") as DeliveryRunId;
}

export function toDeliveryRunId(value: DeliveryRunId): string {
  return unbrand(value);
}

export type TransportLegId = Brand<string, "TransportLegId">;

export function brandTransportLegId(
  value: string | TransportLegId
): TransportLegId {
  return brandTrimRequired(value, "transportLegId") as TransportLegId;
}

export function toTransportLegId(value: TransportLegId): string {
  return unbrand(value);
}
