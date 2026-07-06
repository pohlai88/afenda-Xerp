import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type CostAllocationRunId = Brand<string, "CostAllocationRunId">;

export function brandCostAllocationRunId(
  value: string | CostAllocationRunId
): CostAllocationRunId {
  return brandTrimRequired(value, "costAllocationRunId") as CostAllocationRunId;
}

export function toCostAllocationRunId(value: CostAllocationRunId): string {
  return unbrand(value);
}

export type ActivityTypeId = Brand<string, "ActivityTypeId">;

export function brandActivityTypeId(
  value: string | ActivityTypeId
): ActivityTypeId {
  return brandTrimRequired(value, "activityTypeId") as ActivityTypeId;
}

export function toActivityTypeId(value: ActivityTypeId): string {
  return unbrand(value);
}

export type ProfitCenterReportId = Brand<string, "ProfitCenterReportId">;

export function brandProfitCenterReportId(
  value: string | ProfitCenterReportId
): ProfitCenterReportId {
  return brandTrimRequired(
    value,
    "profitCenterReportId"
  ) as ProfitCenterReportId;
}

export function toProfitCenterReportId(value: ProfitCenterReportId): string {
  return unbrand(value);
}
