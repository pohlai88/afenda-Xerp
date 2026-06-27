import { describe, expect, it } from "vitest";

import {
  brandAccountId,
  brandFiscalPeriodId,
  brandJournalEntryId,
  brandLedgerAccountCode,
  toAccountId,
  toFiscalPeriodId,
  toJournalEntryId,
  toLedgerAccountCode,
} from "../contracts/accounting-domain/index.js";

describe("accounting id boundary branding", () => {
  it("brands required accounting identifiers", () => {
    expect(toAccountId(brandAccountId("acct-1"))).toBe("acct-1");
    expect(toJournalEntryId(brandJournalEntryId("je-1"))).toBe("je-1");
    expect(toFiscalPeriodId(brandFiscalPeriodId("fp-2026-01"))).toBe(
      "fp-2026-01"
    );
    expect(toLedgerAccountCode(brandLedgerAccountCode("1100"))).toBe("1100");
  });

  it("rejects blank identifier values", () => {
    expect(() => brandAccountId("   ")).toThrow(/accountId is required/i);
    expect(() => brandJournalEntryId("")).toThrow(
      /journalEntryId is required/i
    );
    expect(() => brandFiscalPeriodId("  ")).toThrow(
      /fiscalPeriodId is required/i
    );
    expect(() => brandLedgerAccountCode("")).toThrow(
      /ledgerAccountCode is required/i
    );
  });

  it("accepts already-branded values without re-validation failure", () => {
    const accountId = brandAccountId("acct-branded");
    expect(toAccountId(accountId)).toBe("acct-branded");
  });
});
