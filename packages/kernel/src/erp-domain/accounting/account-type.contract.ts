export const ACCOUNT_TYPES = [
  "asset",
  "contra_asset",
  "liability",
  "contra_liability",
  "equity",
  "contra_equity",
  "revenue",
  "expense",
  "memo",
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export function isAccountType(value: string): value is AccountType {
  return (ACCOUNT_TYPES as readonly string[]).includes(value);
}
