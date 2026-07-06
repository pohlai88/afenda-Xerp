import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type LeadId = Brand<string, "LeadId">;

export function brandLeadId(value: string | LeadId): LeadId {
  return brandTrimRequired(value, "leadId") as LeadId;
}

export function toLeadId(value: LeadId): string {
  return unbrand(value);
}

export type OpportunityId = Brand<string, "OpportunityId">;

export function brandOpportunityId(
  value: string | OpportunityId
): OpportunityId {
  return brandTrimRequired(value, "opportunityId") as OpportunityId;
}

export function toOpportunityId(value: OpportunityId): string {
  return unbrand(value);
}

export type CampaignTouchpointId = Brand<string, "CampaignTouchpointId">;

export function brandCampaignTouchpointId(
  value: string | CampaignTouchpointId
): CampaignTouchpointId {
  return brandTrimRequired(
    value,
    "campaignTouchpointId"
  ) as CampaignTouchpointId;
}

export function toCampaignTouchpointId(value: CampaignTouchpointId): string {
  return unbrand(value);
}
