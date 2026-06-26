import { describe, expect, it } from "vitest";

import { PERMISSION_REGISTRY } from "../grants/permission.contract.js";

/**
 * Keep aligned with kernel ACCOUNTING_PERMISSION_KEY_VOCABULARY
 * (`@afenda/kernel/accounting-domain`). No cross-package import.
 */
const EXPECTED_ACCOUNTING_PERMISSION_KEYS = [
  "accounting.coa_read",
  "accounting.coa_manage",
  "accounting.fiscal_period_read",
  "accounting.fiscal_period_manage",
  "accounting.fiscal_period_close",
  "accounting.journal_read",
  "accounting.journal_post",
  "accounting.journal_approve",
  "accounting.journal_reverse",
] as const;

describe("accounting permission registry parity", () => {
  it("registers coa, fiscalPeriod, and journal domains", () => {
    expect(PERMISSION_REGISTRY.accounting.coa.read).toBe("accounting.coa_read");
    expect(PERMISSION_REGISTRY.accounting.coa.manage).toBe(
      "accounting.coa_manage"
    );
    expect(PERMISSION_REGISTRY.accounting.fiscalPeriod.read).toBe(
      "accounting.fiscal_period_read"
    );
    expect(PERMISSION_REGISTRY.accounting.fiscalPeriod.manage).toBe(
      "accounting.fiscal_period_manage"
    );
    expect(PERMISSION_REGISTRY.accounting.fiscalPeriod.close).toBe(
      "accounting.fiscal_period_close"
    );
    expect(PERMISSION_REGISTRY.accounting.journal.read).toBe(
      "accounting.journal_read"
    );
    expect(PERMISSION_REGISTRY.accounting.journal.post).toBe(
      "accounting.journal_post"
    );
    expect(PERMISSION_REGISTRY.accounting.journal.approve).toBe(
      "accounting.journal_approve"
    );
    expect(PERMISSION_REGISTRY.accounting.journal.reverse).toBe(
      "accounting.journal_reverse"
    );
  });

  it("covers every vocabulary permission key", () => {
    const registered = new Set<string>([
      PERMISSION_REGISTRY.accounting.coa.read,
      PERMISSION_REGISTRY.accounting.coa.manage,
      PERMISSION_REGISTRY.accounting.fiscalPeriod.read,
      PERMISSION_REGISTRY.accounting.fiscalPeriod.manage,
      PERMISSION_REGISTRY.accounting.fiscalPeriod.close,
      PERMISSION_REGISTRY.accounting.journal.read,
      PERMISSION_REGISTRY.accounting.journal.post,
      PERMISSION_REGISTRY.accounting.journal.approve,
      PERMISSION_REGISTRY.accounting.journal.reverse,
    ]);

    expect([...registered].sort()).toEqual(
      [...EXPECTED_ACCOUNTING_PERMISSION_KEYS].sort()
    );
  });
});
