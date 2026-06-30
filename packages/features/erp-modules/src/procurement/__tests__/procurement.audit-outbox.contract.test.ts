import { describe, expect, it } from "vitest";

import {
  PROCUREMENT_AUDIT_OUTBOX_ATTESTATION,
  PROCUREMENT_AUDIT_OUTBOX_CONTRACT,
  PROCUREMENT_AUDIT_OUTBOX_SLICE_ID,
  PROCUREMENT_AUDIT_OUTBOX_STATUS,
  PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS,
  PROCUREMENT_PLANNED_OUTBOX_ENTRIES,
  PROCUREMENT_WIRE_AUDIT_ACTIONS,
} from "../procurement.audit-outbox.contract.js";

describe("procurement.audit-outbox.contract (ERP-PROC-OP-006)", () => {
  it("declares ERP-PROC-OP-006 declared attestation", () => {
    expect(PROCUREMENT_AUDIT_OUTBOX_SLICE_ID).toBe("ERP-PROC-OP-006");
    expect(PROCUREMENT_AUDIT_OUTBOX_STATUS).toBe("declared");
    expect(PROCUREMENT_AUDIT_OUTBOX_ATTESTATION.sliceId).toBe(
      "ERP-PROC-OP-006"
    );
    expect(
      PROCUREMENT_AUDIT_OUTBOX_ATTESTATION.writersProhibitedUntil
    ).toContain("writers");
  });

  it("maps thirteen wire audit actions to module-prefixed namespace", () => {
    expect(PROCUREMENT_WIRE_AUDIT_ACTIONS).toHaveLength(13);
    expect(PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS).toHaveLength(13);

    for (const action of PROCUREMENT_WIRE_AUDIT_ACTIONS) {
      expect(PROCUREMENT_MODULE_PREFIXED_AUDIT_ACTIONS).toContain(
        `procurement.${action}`
      );
    }
  });

  it("declares deferred outbox entries for every module-prefixed audit event", () => {
    expect(PROCUREMENT_PLANNED_OUTBOX_ENTRIES).toHaveLength(13);
    expect(PROCUREMENT_AUDIT_OUTBOX_CONTRACT.auditWriterStatus).toBe(
      "deferred"
    );
    expect(PROCUREMENT_AUDIT_OUTBOX_CONTRACT.outboxWriterStatus).toBe(
      "deferred"
    );

    for (const entry of PROCUREMENT_PLANNED_OUTBOX_ENTRIES) {
      expect(entry.requirement).toBe("deferred");
      expect(entry.event.startsWith("procurement.")).toBe(true);
    }
  });
});
