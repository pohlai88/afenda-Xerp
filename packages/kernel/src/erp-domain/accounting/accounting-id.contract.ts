import type { Brand } from "../../identity/brand/index.js";
import { unbrand } from "../../identity/brand/index.js";

function brandTrimRequired<T extends string>(
  value: string | Brand<string, T>,
  label: string
): Brand<string, T> {
  const raw = typeof value === "string" ? value : (value as string);

  if (!raw.trim()) {
    throw new Error(`${label} is required.`);
  }

  return raw as Brand<string, T>;
}

export type AccountId = Brand<string, "AccountId">;

export function brandAccountId(value: string | AccountId): AccountId {
  return brandTrimRequired(value, "accountId") as AccountId;
}

export function toAccountId(value: AccountId): string {
  return unbrand(value);
}

export type JournalEntryId = Brand<string, "JournalEntryId">;

export function brandJournalEntryId(
  value: string | JournalEntryId
): JournalEntryId {
  return brandTrimRequired(value, "journalEntryId") as JournalEntryId;
}

export function toJournalEntryId(value: JournalEntryId): string {
  return unbrand(value);
}

/** Forbidden on platform floor — accounting-domain subpath only (PAS-001 §4.1.6). */
export type FiscalCalendarId = Brand<string, "FiscalCalendarId">;

export function brandFiscalCalendarId(
  value: string | FiscalCalendarId
): FiscalCalendarId {
  return brandTrimRequired(value, "fiscalCalendarId") as FiscalCalendarId;
}

export function toFiscalCalendarId(value: FiscalCalendarId): string {
  return unbrand(value);
}

/** Forbidden on platform floor — accounting-domain subpath only (PAS-001 §4.1.6). */
export type FiscalPeriodId = Brand<string, "FiscalPeriodId">;

export function brandFiscalPeriodId(
  value: string | FiscalPeriodId
): FiscalPeriodId {
  return brandTrimRequired(value, "fiscalPeriodId") as FiscalPeriodId;
}

export function toFiscalPeriodId(value: FiscalPeriodId): string {
  return unbrand(value);
}

export type LedgerAccountCode = Brand<string, "LedgerAccountCode">;

export function brandLedgerAccountCode(
  value: string | LedgerAccountCode
): LedgerAccountCode {
  return brandTrimRequired(value, "ledgerAccountCode") as LedgerAccountCode;
}

export function toLedgerAccountCode(value: LedgerAccountCode): string {
  return unbrand(value);
}
