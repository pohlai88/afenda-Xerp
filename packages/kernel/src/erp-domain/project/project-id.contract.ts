import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

/**
 * Domain-scoped branded IDs (PAS-001B Rule 2).
 * ProjectId is the ERP domain project entity — not kernel platform ProjectId
 * from operating-context / createProjectId (see project-domain-vocabulary.policy.ts).
 */

export type ProjectId = Brand<string, "ProjectId">;

export function brandProjectId(value: string | ProjectId): ProjectId {
  return brandTrimRequired(value, "projectId") as ProjectId;
}

export function toProjectId(value: ProjectId): string {
  return unbrand(value);
}

export type ProjectTaskId = Brand<string, "ProjectTaskId">;

export function brandProjectTaskId(
  value: string | ProjectTaskId
): ProjectTaskId {
  return brandTrimRequired(value, "projectTaskId") as ProjectTaskId;
}

export function toProjectTaskId(value: ProjectTaskId): string {
  return unbrand(value);
}

export type TimesheetPeriodId = Brand<string, "TimesheetPeriodId">;

export function brandTimesheetPeriodId(
  value: string | TimesheetPeriodId
): TimesheetPeriodId {
  return brandTrimRequired(value, "timesheetPeriodId") as TimesheetPeriodId;
}

export function toTimesheetPeriodId(value: TimesheetPeriodId): string {
  return unbrand(value);
}
