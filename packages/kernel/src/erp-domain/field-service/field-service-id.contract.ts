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
