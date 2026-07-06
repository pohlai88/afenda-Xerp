import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type SubscriptionId = Brand<string, "SubscriptionId">;

export function brandSubscriptionId(
  value: string | SubscriptionId
): SubscriptionId {
  return brandTrimRequired(value, "subscriptionId") as SubscriptionId;
}

export function toSubscriptionId(value: SubscriptionId): string {
  return unbrand(value);
}

export type BillingCycleRunId = Brand<string, "BillingCycleRunId">;

export function brandBillingCycleRunId(
  value: string | BillingCycleRunId
): BillingCycleRunId {
  return brandTrimRequired(value, "billingCycleRunId") as BillingCycleRunId;
}

export function toBillingCycleRunId(value: BillingCycleRunId): string {
  return unbrand(value);
}

export type RenewalOfferId = Brand<string, "RenewalOfferId">;

export function brandRenewalOfferId(
  value: string | RenewalOfferId
): RenewalOfferId {
  return brandTrimRequired(value, "renewalOfferId") as RenewalOfferId;
}

export function toRenewalOfferId(value: RenewalOfferId): string {
  return unbrand(value);
}
