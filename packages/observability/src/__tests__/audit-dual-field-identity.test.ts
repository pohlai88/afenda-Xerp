import { describe, expect, it } from "vitest";

import {
  AuditValidationError,
  parseWriteAuditEventInput,
} from "../audit-event.validation.js";

const CANONICAL_TENANT_ID = "tnt_01ARZ3NDEKTSV4RRFFQ69G5FAX";
const CANONICAL_TARGET_ID = "wfl_01ARZ3NDEKTSV4RRFFQ69G5FAV";
const TENANT_PK = "018f9f8c-9f1a-7c2b-9c20-000000000001";
const ENTITY_PK = "018f9f8c-9f1a-7c2b-9c20-000000000002";

const baseInput = {
  actorType: "system" as const,
  module: "execution",
  action: "outbox.batch.completed",
  targetType: "outbox_batch",
  result: "success" as const,
  source: "job" as const,
  correlationId: "corr-001",
};

describe("audit dual-field identity (PAS-001 §4.1.9)", () => {
  it("does not copy canonical targetId or tenantId into metadata PK fields", () => {
    const row = parseWriteAuditEventInput({
      ...baseInput,
      targetId: CANONICAL_TARGET_ID,
      tenantId: CANONICAL_TENANT_ID,
      metadata: { claimed: 1 },
    });

    expect(row.targetId).toBe(CANONICAL_TARGET_ID);
    expect(row.tenantId).toBe(CANONICAL_TENANT_ID);
    expect(row.metadata).toEqual({ claimed: 1 });
    expect(row.metadata["entityPk"]).toBeUndefined();
    expect(row.metadata["tenantPk"]).toBeUndefined();
  });

  it("validates explicit targetPk and tenantPk into metadata", () => {
    const row = parseWriteAuditEventInput({
      ...baseInput,
      targetId: CANONICAL_TARGET_ID,
      tenantId: CANONICAL_TENANT_ID,
      targetPk: ENTITY_PK,
      tenantPk: TENANT_PK,
    });

    expect(row.metadata["entityPk"]).toBe(ENTITY_PK);
    expect(row.metadata["tenantPk"]).toBe(TENANT_PK);
  });

  it("rejects canonical enterprise ID supplied as metadata.entityPk", () => {
    expect(() =>
      parseWriteAuditEventInput({
        ...baseInput,
        metadata: { entityPk: CANONICAL_TARGET_ID },
      })
    ).toThrow(AuditValidationError);
  });

  it("rejects canonical enterprise ID supplied as targetPk", () => {
    expect(() =>
      parseWriteAuditEventInput({
        ...baseInput,
        targetPk: CANONICAL_TARGET_ID,
      })
    ).toThrow(AuditValidationError);
  });

  it("rejects tenant human reference supplied as tenantPk", () => {
    expect(() =>
      parseWriteAuditEventInput({
        ...baseInput,
        tenantPk: "ACME-001",
      })
    ).toThrow(AuditValidationError);
  });

  it("rejects UUID v4 supplied as targetPk", () => {
    expect(() =>
      parseWriteAuditEventInput({
        ...baseInput,
        targetPk: "018f9f8c-9f1a-4c2b-9c20-000000000002",
      })
    ).toThrow(AuditValidationError);
  });

  it("rejects non-UUID garbage supplied as tenantPk", () => {
    expect(() =>
      parseWriteAuditEventInput({
        ...baseInput,
        tenantPk: "internal-row-key",
      })
    ).toThrow(AuditValidationError);
  });

  it("rejects conflicting targetPk and metadata.entityPk", () => {
    expect(() =>
      parseWriteAuditEventInput({
        ...baseInput,
        targetPk: ENTITY_PK,
        metadata: { entityPk: "018f9f8c-9f1a-7c2b-9c20-000000000099" },
      })
    ).toThrow(AuditValidationError);
  });
});
