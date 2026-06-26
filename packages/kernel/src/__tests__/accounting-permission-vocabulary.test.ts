import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_PERMISSION_ACTIONS,
  ACCOUNTING_PERMISSION_DOMAINS,
  ACCOUNTING_PERMISSION_KEY_VOCABULARY,
  toAccountingPermissionKey,
} from "../contracts/accounting-domain/index.js";

describe("ACCOUNTING_PERMISSION vocabulary", () => {
  it("declares coa, fiscalPeriod, and journal domains", () => {
    expect(ACCOUNTING_PERMISSION_DOMAINS).toEqual([
      "coa",
      "fiscalPeriod",
      "journal",
    ]);
  });

  it("maps domains and actions to accounting permission key wire form", () => {
    expect(toAccountingPermissionKey("coa", "read")).toBe(
      "accounting.coa_read"
    );
    expect(toAccountingPermissionKey("fiscalPeriod", "close")).toBe(
      "accounting.fiscal_period_close"
    );
    expect(toAccountingPermissionKey("journal", "approve")).toBe(
      "accounting.journal_approve"
    );
  });

  it("lists every domain action combination in the vocabulary", () => {
    const derived = ACCOUNTING_PERMISSION_DOMAINS.flatMap((domain) =>
      ACCOUNTING_PERMISSION_ACTIONS[domain].map((action) =>
        toAccountingPermissionKey(domain, action)
      )
    );

    expect([...ACCOUNTING_PERMISSION_KEY_VOCABULARY].sort()).toEqual(
      derived.sort()
    );
  });
});
