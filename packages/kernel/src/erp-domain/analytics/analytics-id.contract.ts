import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type AnalyticsQueryId = Brand<string, "AnalyticsQueryId">;

export function brandAnalyticsQueryId(
  value: string | AnalyticsQueryId
): AnalyticsQueryId {
  return brandTrimRequired(value, "analyticsQueryId") as AnalyticsQueryId;
}

export function toAnalyticsQueryId(value: AnalyticsQueryId): string {
  return unbrand(value);
}

export type DashboardDefinitionId = Brand<string, "DashboardDefinitionId">;

export function brandDashboardDefinitionId(
  value: string | DashboardDefinitionId
): DashboardDefinitionId {
  return brandTrimRequired(
    value,
    "dashboardDefinitionId"
  ) as DashboardDefinitionId;
}

export function toDashboardDefinitionId(value: DashboardDefinitionId): string {
  return unbrand(value);
}

export type MetricSnapshotId = Brand<string, "MetricSnapshotId">;

export function brandMetricSnapshotId(
  value: string | MetricSnapshotId
): MetricSnapshotId {
  return brandTrimRequired(value, "metricSnapshotId") as MetricSnapshotId;
}

export function toMetricSnapshotId(value: MetricSnapshotId): string {
  return unbrand(value);
}
