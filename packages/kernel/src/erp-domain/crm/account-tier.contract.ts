export const ACCOUNT_TIERS = ["standard", "key", "strategic"] as const;

export type AccountTier = (typeof ACCOUNT_TIERS)[number];

export function isAccountTier(value: string): value is AccountTier {
  return (ACCOUNT_TIERS as readonly string[]).includes(value);
}
