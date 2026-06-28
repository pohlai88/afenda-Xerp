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

export type JobRequisitionId = Brand<string, "JobRequisitionId">;

export function brandJobRequisitionId(
  value: string | JobRequisitionId
): JobRequisitionId {
  return brandTrimRequired(value, "jobRequisitionId") as JobRequisitionId;
}

export function toJobRequisitionId(value: JobRequisitionId): string {
  return unbrand(value);
}

export type OnboardingCaseId = Brand<string, "OnboardingCaseId">;

export function brandOnboardingCaseId(
  value: string | OnboardingCaseId
): OnboardingCaseId {
  return brandTrimRequired(value, "onboardingCaseId") as OnboardingCaseId;
}

export function toOnboardingCaseId(value: OnboardingCaseId): string {
  return unbrand(value);
}

export type PerformanceReviewId = Brand<string, "PerformanceReviewId">;

export function brandPerformanceReviewId(
  value: string | PerformanceReviewId
): PerformanceReviewId {
  return brandTrimRequired(value, "performanceReviewId") as PerformanceReviewId;
}

export function toPerformanceReviewId(value: PerformanceReviewId): string {
  return unbrand(value);
}
