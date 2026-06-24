import { describe, expect, it } from "vitest";

import {
  toAccountId,
  toFiscalPeriodId,
  toJournalEntryId,
  toLedgerAccountCode,
} from "../index.js";

describe("accounting id boundary branding", () => {
  it("brands required accounting identifiers", () => {
    expect(toAccountId("acct-1")).toBe("acct-1");
    expect(toJournalEntryId("je-1")).toBe("je-1");
    expect(toFiscalPeriodId("fp-2026-01")).toBe("fp-2026-01");
    expect(toLedgerAccountCode("1100")).toBe("1100");
  });

  it("rejects blank identifier values", () => {
    expect(() => toAccountId("   ")).toThrow(/accountId is required/i);
    expect(() => toJournalEntryId("")).toThrow(/journalEntryId is required/i);
    expect(() => toFiscalPeriodId("  ")).toThrow(/fiscalPeriodId is required/i);
    expect(() => toLedgerAccountCode("")).toThrow(
      /ledgerAccountCode is required/i
    );
  });

  it("accepts already-branded values without re-validation failure", () => {
    const accountId = toAccountId("acct-branded");
    expect(toAccountId(accountId)).toBe("acct-branded");
  });
});
