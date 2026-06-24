/**
 * Accounting permission vocabulary — documents domains/actions registered in PERMISSION_REGISTRY.
 * Registry authority remains @afenda/permissions; this is documentation parity only.
 */
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

const FISCAL_PERIOD_ACTION_PREFIX = "fiscal_period";

/** Maps nested registry domain + action to `{domain}.{action}` permission key wire form. */
export function toAccountingPermissionKey(
  domain: AccountingPermissionDomain,
  action: AccountingPermissionAction
): string {
  const actionSegment =
    domain === "fiscalPeriod"
      ? `${FISCAL_PERIOD_ACTION_PREFIX}_${action}`
      : `${domain}_${action}`;

  return `accounting.${actionSegment}`;
}

/** Flat list of permission keys expected in PERMISSION_REGISTRY.accounting. */
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
