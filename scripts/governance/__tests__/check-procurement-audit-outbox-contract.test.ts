import { describe, expect, it } from "vitest";

import { PROCUREMENT_AUDIT_OUTBOX_CONTRACT } from "../../../packages/features/erp-modules/src/procurement/procurement.audit-outbox.contract.ts";
import { checkProcurementAuditOutboxContract } from "../check-procurement-audit-outbox-contract.mts";

describe("check-procurement-audit-outbox-contract gate", () => {
  it("passes on the current repository state", () => {
    const violations = checkProcurementAuditOutboxContract();

    expect(violations).toEqual([]);
  });

  it("declares thirteen deferred audit/outbox entries", () => {
    expect(PROCUREMENT_AUDIT_OUTBOX_CONTRACT.wireAuditActions).toHaveLength(13);
    expect(
      PROCUREMENT_AUDIT_OUTBOX_CONTRACT.modulePrefixedAuditActions
    ).toHaveLength(13);
    expect(PROCUREMENT_AUDIT_OUTBOX_CONTRACT.plannedOutboxEntries).toHaveLength(
      13
    );
    expect(PROCUREMENT_AUDIT_OUTBOX_CONTRACT.auditWriterStatus).toBe(
      "deferred"
    );
    expect(PROCUREMENT_AUDIT_OUTBOX_CONTRACT.outboxWriterStatus).toBe(
      "deferred"
    );
  });
});
