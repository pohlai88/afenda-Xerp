export const CHANNEL_TYPES = [
  "web",
  "mobile",
  "marketplace",
  "social",
] as const;

export type ChannelType = (typeof CHANNEL_TYPES)[number];

export function isChannelType(value: string): value is ChannelType {
  return (CHANNEL_TYPES as readonly string[]).includes(value);
}
