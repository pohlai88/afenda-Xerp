import { describe, expect, it } from "vitest";

import {
  ACCOUNTING_AUDIT_ACTIONS,
  isAccountingAuditAction,
  parseAccountingAuditAction,
} from "../index.js";

describe("ACCOUNTING_AUDIT_ACTIONS vocabulary", () => {
  it("uses observability-compatible module.action dot notation", () => {
    for (const action of ACCOUNTING_AUDIT_ACTIONS) {
      expect(action).toMatch(/^[a-z_]+\.[a-z_]+$/);
    }
  });

  it("includes journal and period actions aligned with observability reserved vocabulary", () => {
    expect(ACCOUNTING_AUDIT_ACTIONS).toContain("journal.posted");
    expect(ACCOUNTING_AUDIT_ACTIONS).toContain("journal.reversed");
    expect(ACCOUNTING_AUDIT_ACTIONS).toContain("period.closed");
    expect(ACCOUNTING_AUDIT_ACTIONS).toContain("period.reopened");
  });

  it("narrows audit action strings at boundaries", () => {
    expect(isAccountingAuditAction("journal.posted")).toBe(true);
    expect(isAccountingAuditAction("ledger.posted")).toBe(false);
    expect(parseAccountingAuditAction("coa.created")).toBe("coa.created");
    expect(parseAccountingAuditAction("invalid")).toBeNull();
  });
});
