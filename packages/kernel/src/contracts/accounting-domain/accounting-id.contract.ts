/**
 * Branded accounting identifiers — brand at trust boundaries only.
 * Wire formats use plain strings for JSON serialization.
 */
import { type Brand, brandRequiredId } from "@afenda/kernel";

export type AccountId = Brand<string, "AccountId">;
export type JournalEntryId = Brand<string, "JournalEntryId">;
export type FiscalPeriodId = Brand<string, "FiscalPeriodId">;
export type LedgerAccountCode = Brand<string, "LedgerAccountCode">;

export function toAccountId(value: string | AccountId): AccountId {
  return brandRequiredId(value, "accountId") as AccountId;
}

export function toJournalEntryId(
  value: string | JournalEntryId
): JournalEntryId {
  return brandRequiredId(value, "journalEntryId") as JournalEntryId;
}

export function toFiscalPeriodId(
  value: string | FiscalPeriodId
): FiscalPeriodId {
  return brandRequiredId(value, "fiscalPeriodId") as FiscalPeriodId;
}

export function toLedgerAccountCode(
  value: string | LedgerAccountCode
): LedgerAccountCode {
  return brandRequiredId(value, "ledgerAccountCode") as LedgerAccountCode;
}
