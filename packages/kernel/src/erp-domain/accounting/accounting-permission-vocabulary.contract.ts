export const ACCOUNTING_PERMISSION_DOMAINS = [
  "coa",
  "fiscalPeriod",
  "journal",
] as const;

export type AccountingPermissionDomain =
  (typeof ACCOUNTING_PERMISSION_DOMAINS)[number];

export const ACCOUNTING_PERMISSION_ACTIONS = {
  coa: ["read", "manage"] as const,
  fiscalPeriod: ["read", "manage", "close"] as const,
  journal: ["read", "post", "approve", "reverse"] as const,
} as const satisfies Record<AccountingPermissionDomain, readonly string[]>;

export type AccountingPermissionAction<
  TDomain extends AccountingPermissionDomain = AccountingPermissionDomain,
> = (typeof ACCOUNTING_PERMISSION_ACTIONS)[TDomain][number];

export function toAccountingPermissionKey(
  domain: AccountingPermissionDomain,
  action: AccountingPermissionAction
): string {
  const actionSegment =
    domain === "fiscalPeriod"
      ? `fiscal_period_${action}`
      : `${domain}_${action}`;
  return `accounting.${actionSegment}`;
}

export const ACCOUNTING_PERMISSION_KEY_VOCABULARY = [
  toAccountingPermissionKey("coa", "read"),
  toAccountingPermissionKey("coa", "manage"),
  toAccountingPermissionKey("fiscalPeriod", "read"),
  toAccountingPermissionKey("fiscalPeriod", "manage"),
  toAccountingPermissionKey("fiscalPeriod", "close"),
  toAccountingPermissionKey("journal", "read"),
  toAccountingPermissionKey("journal", "post"),
  toAccountingPermissionKey("journal", "approve"),
  toAccountingPermissionKey("journal", "reverse"),
] as const;

export type AccountingPermissionKey =
  (typeof ACCOUNTING_PERMISSION_KEY_VOCABULARY)[number];
