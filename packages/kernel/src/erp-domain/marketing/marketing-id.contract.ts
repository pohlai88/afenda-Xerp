import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";
import { brandTrimRequired } from "../_internal/domain-id-brand.helpers.js";

export type MarketingCampaignId = Brand<string, "MarketingCampaignId">;

export function brandMarketingCampaignId(
  value: string | MarketingCampaignId
): MarketingCampaignId {
  return brandTrimRequired(value, "marketingCampaignId") as MarketingCampaignId;
}

export function toMarketingCampaignId(value: MarketingCampaignId): string {
  return unbrand(value);
}

export type AudienceSegmentId = Brand<string, "AudienceSegmentId">;

export function brandAudienceSegmentId(
  value: string | AudienceSegmentId
): AudienceSegmentId {
  return brandTrimRequired(value, "audienceSegmentId") as AudienceSegmentId;
}

export function toAudienceSegmentId(value: AudienceSegmentId): string {
  return unbrand(value);
}

export type ContentVariantId = Brand<string, "ContentVariantId">;

export function brandContentVariantId(
  value: string | ContentVariantId
): ContentVariantId {
  return brandTrimRequired(value, "contentVariantId") as ContentVariantId;
}

export function toContentVariantId(value: ContentVariantId): string {
  return unbrand(value);
}
