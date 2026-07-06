import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type QualityInspectionId = Brand<string, "QualityInspectionId">;

export function brandQualityInspectionId(
  value: string | QualityInspectionId
): QualityInspectionId {
  return brandTrimRequired(value, "qualityInspectionId") as QualityInspectionId;
}

export function toQualityInspectionId(value: QualityInspectionId): string {
  return unbrand(value);
}

export type QualityNotificationId = Brand<string, "QualityNotificationId">;

export function brandQualityNotificationId(
  value: string | QualityNotificationId
): QualityNotificationId {
  return brandTrimRequired(
    value,
    "qualityNotificationId"
  ) as QualityNotificationId;
}

export function toQualityNotificationId(value: QualityNotificationId): string {
  return unbrand(value);
}

export type SampleLotId = Brand<string, "SampleLotId">;

export function brandSampleLotId(value: string | SampleLotId): SampleLotId {
  return brandTrimRequired(value, "sampleLotId") as SampleLotId;
}

export function toSampleLotId(value: SampleLotId): string {
  return unbrand(value);
}
