import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type ConsolidationRunId = Brand<string, "ConsolidationRunId">;

export function brandConsolidationRunId(
  value: string | ConsolidationRunId
): ConsolidationRunId {
  return brandTrimRequired(value, "consolidationRunId") as ConsolidationRunId;
}

export function toConsolidationRunId(value: ConsolidationRunId): string {
  return unbrand(value);
}

export type EliminationEntryId = Brand<string, "EliminationEntryId">;

export function brandEliminationEntryId(
  value: string | EliminationEntryId
): EliminationEntryId {
  return brandTrimRequired(value, "eliminationEntryId") as EliminationEntryId;
}

export function toEliminationEntryId(value: EliminationEntryId): string {
  return unbrand(value);
}

export type ReportingUnitId = Brand<string, "ReportingUnitId">;

export function brandReportingUnitId(
  value: string | ReportingUnitId
): ReportingUnitId {
  return brandTrimRequired(value, "reportingUnitId") as ReportingUnitId;
}

export function toReportingUnitId(value: ReportingUnitId): string {
  return unbrand(value);
}
