import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type MaintenanceOrderId = Brand<string, "MaintenanceOrderId">;

export function brandMaintenanceOrderId(
  value: string | MaintenanceOrderId
): MaintenanceOrderId {
  return brandTrimRequired(value, "maintenanceOrderId") as MaintenanceOrderId;
}

export function toMaintenanceOrderId(value: MaintenanceOrderId): string {
  return unbrand(value);
}

export type WorkRequestId = Brand<string, "WorkRequestId">;

export function brandWorkRequestId(
  value: string | WorkRequestId
): WorkRequestId {
  return brandTrimRequired(value, "workRequestId") as WorkRequestId;
}

export function toWorkRequestId(value: WorkRequestId): string {
  return unbrand(value);
}

export type EquipmentDowntimeId = Brand<string, "EquipmentDowntimeId">;

export function brandEquipmentDowntimeId(
  value: string | EquipmentDowntimeId
): EquipmentDowntimeId {
  return brandTrimRequired(value, "equipmentDowntimeId") as EquipmentDowntimeId;
}

export function toEquipmentDowntimeId(value: EquipmentDowntimeId): string {
  return unbrand(value);
}
