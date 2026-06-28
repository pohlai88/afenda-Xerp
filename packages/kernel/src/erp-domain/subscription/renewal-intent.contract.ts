export const RENEWAL_INTENTS = ["auto", "manual", "opt_out"] as const;

export type RenewalIntent = (typeof RENEWAL_INTENTS)[number];

export function isRenewalIntent(value: string): value is RenewalIntent {
  return (RENEWAL_INTENTS as readonly string[]).includes(value);
}
