import type { EntitlementScope } from "./shared.contract";

export type UsageLimitKey =
  | "users.max"
  | "companies.max"
  | "organizations.max"
  | "api.calls.daily"
  | "storage.gb.max"
  | "ai.tokens.monthly"
  | "einvoice.volume.monthly"
  | "automation.runs.monthly";

export type UsageLimitPeriod = "instant" | "daily" | "monthly" | "annual";

export interface UsageLimitContract {
  readonly key: UsageLimitKey;
  readonly maximum: number;
  readonly period: UsageLimitPeriod;
  readonly scope: EntitlementScope;
  readonly unit: string;
  readonly used: number;
}

export const requiredUsageLimitKeys = [
  "users.max",
  "companies.max",
  "organizations.max",
  "api.calls.daily",
  "storage.gb.max",
  "ai.tokens.monthly",
  "einvoice.volume.monthly",
  "automation.runs.monthly",
] as const satisfies readonly UsageLimitKey[];
