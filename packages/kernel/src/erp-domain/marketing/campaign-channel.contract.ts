export const CAMPAIGN_CHANNELS = [
  "email",
  "sms",
  "social",
  "ads",
  "event",
] as const;

export type CampaignChannel = (typeof CAMPAIGN_CHANNELS)[number];

export function isCampaignChannel(value: string): value is CampaignChannel {
  return (CAMPAIGN_CHANNELS as readonly string[]).includes(value);
}
