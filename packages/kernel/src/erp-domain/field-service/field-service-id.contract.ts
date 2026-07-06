import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type FieldWorkOrderId = Brand<string, "FieldWorkOrderId">;

export function brandFieldWorkOrderId(
  value: string | FieldWorkOrderId
): FieldWorkOrderId {
  return brandTrimRequired(value, "fieldWorkOrderId") as FieldWorkOrderId;
}

export function toFieldWorkOrderId(value: FieldWorkOrderId): string {
  return unbrand(value);
}

export type DispatchRunId = Brand<string, "DispatchRunId">;

export function brandDispatchRunId(
  value: string | DispatchRunId
): DispatchRunId {
  return brandTrimRequired(value, "dispatchRunId") as DispatchRunId;
}

export function toDispatchRunId(value: DispatchRunId): string {
  return unbrand(value);
}

export type TechnicianRouteId = Brand<string, "TechnicianRouteId">;

export function brandTechnicianRouteId(
  value: string | TechnicianRouteId
): TechnicianRouteId {
  return brandTrimRequired(value, "technicianRouteId") as TechnicianRouteId;
}

export function toTechnicianRouteId(value: TechnicianRouteId): string {
  return unbrand(value);
}
