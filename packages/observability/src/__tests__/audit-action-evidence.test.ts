import { describe, expect, it, vi } from "vitest";
import { AuditAdapterMissingError } from "../audit.writer.js";
import { withAuditEvidence } from "../audit-action-evidence.js";
import type {
  AuditEventInsertRow,
  WriteAuditEventResult,
} from "../contracts/audit-event.contract.js";

const baseEvidence = {
  correlationId: "corr-evidence-001",
  actorType: "user" as const,
  actorId: "user-001",
  module: "membership",
  action: "membership.create",
  targetType: "membership",
  targetId: "mem-001",
  source: "api" as const,
};

function makeAdapter(rows: AuditEventInsertRow[] = []) {
  return {
    write: (row: AuditEventInsertRow): Promise<WriteAuditEventResult> => {
      rows.push(row);
      return Promise.resolve({ id: `audit-${rows.length}` });
    },
  };
}

describe("withAuditEvidence — success path", () => {
  it("returns operation value and audit ID", async () => {
    const rows: AuditEventInsertRow[] = [];
    const { value, auditId } = await withAuditEvidence(
      baseEvidence,
      async () => ({ id: "mem-001", name: "Engineering" }),
      makeAdapter(rows)
    );

    expect(value).toEqual({ id: "mem-001", name: "Engineering" });
    expect(auditId).toBe("audit-1");
    expect(rows[0]).toMatchObject({
      result: "success",
      module: "membership",
      action: "membership.create",
      correlationId: "corr-evidence-001",
    });
  });

  it("records actor, tenant/company context, target, and correlationId", async () => {
    const rows: AuditEventInsertRow[] = [];

    await withAuditEvidence(
      {
        ...baseEvidence,
        actorUserId: "user-001",
        tenantId: "tenant-001",
        companyId: "company-001",
        organizationId: "org-001",
        permission: "membership.create",
      },
      async () => "done",
      makeAdapter(rows)
    );

    expect(rows[0]).toMatchObject({
      actorId: "user-001",
      actorUserId: "user-001",
      tenantId: "tenant-001",
      companyId: "company-001",
      organizationId: "org-001",
      permission: "membership.create",
      result: "success",
      correlationId: "corr-evidence-001",
    });
  });

  it("merges successMetadata with caller metadata", async () => {
    const rows: AuditEventInsertRow[] = [];

    await withAuditEvidence(
      {
        ...baseEvidence,
        metadata: { sourceModule: "onboarding" },
        successMetadata: { planTier: "enterprise" },
      },
      async () => null,
      makeAdapter(rows)
    );

    const metadata = rows[0]?.metadata as Record<string, unknown>;
    expect(metadata?.["sourceModule"]).toBe("onboarding");
    expect(metadata?.["planTier"]).toBe("enterprise");
  });
});

describe("withAuditEvidence — failure path", () => {
  it("writes failure audit and re-throws original error", async () => {
    const rows: AuditEventInsertRow[] = [];

    await expect(
      withAuditEvidence(
        baseEvidence,
        () => Promise.reject(new Error("Duplicate membership")),
        makeAdapter(rows)
      )
    ).rejects.toThrow("Duplicate membership");

    expect(rows[0]).toMatchObject({
      result: "failure",
      correlationId: "corr-evidence-001",
    });
  });

  it("captures error code in failure metadata without leaking message", async () => {
    const rows: AuditEventInsertRow[] = [];
    const codedError = Object.assign(new Error("Internal"), {
      code: "ERR_UNIQUE",
    });

    await expect(
      withAuditEvidence(
        baseEvidence,
        () => Promise.reject(codedError),
        makeAdapter(rows)
      )
    ).rejects.toThrow();

    const metadata = rows[0]?.metadata as Record<string, unknown>;
    expect(metadata?.["errorCode"]).toBe("ERR_UNIQUE");
    expect(JSON.stringify(metadata)).not.toContain("Internal");
  });
});

describe("withAuditEvidence — adapter missing", () => {
  it("non-critical: silently skips audit and returns auditId empty string", async () => {
    const { value, auditId } = await withAuditEvidence(
      { ...baseEvidence, critical: false },
      async () => "result",
      null
    );

    expect(value).toBe("result");
    expect(auditId).toBe("");
  });

  it("critical: fails closed with AuditAdapterMissingError when adapter is null", async () => {
    await expect(
      withAuditEvidence(
        { ...baseEvidence, critical: true },
        async () => "result",
        null
      )
    ).rejects.toThrow(AuditAdapterMissingError);
  });

  it("critical: fails closed even when operation succeeded", async () => {
    let operationRan = false;

    await expect(
      withAuditEvidence(
        { ...baseEvidence, critical: true },
        () => {
          operationRan = true;
          return Promise.resolve("ok");
        },
        null
      )
    ).rejects.toBeInstanceOf(AuditAdapterMissingError);

    expect(operationRan).toBe(true);
  });

  it("critical: does not fail closed for infrastructure errors (DB down)", async () => {
    const faultyAdapter = {
      write: (): Promise<WriteAuditEventResult> =>
        Promise.reject(new Error("DB connection refused")),
    };

    const { value, auditId } = await withAuditEvidence(
      { ...baseEvidence, critical: true },
      async () => "operation-ok",
      faultyAdapter
    );

    expect(value).toBe("operation-ok");
    expect(auditId).toBe("");
  });
});

describe("withAuditEvidence — security validation", () => {
  it("rejects sensitive keys in metadata (AuditValidationError re-thrown)", async () => {
    await expect(
      withAuditEvidence(
        { ...baseEvidence, metadata: { accessToken: "secret-value" } },
        async () => "ok",
        makeAdapter()
      )
    ).rejects.toThrow();
  });

  it("does not suppress original operation error when audit write also fails", async () => {
    const faultyAdapter = {
      write: vi.fn().mockRejectedValue(new Error("Audit DB down")),
    };

    const originalError = new Error("Business logic failed");

    await expect(
      withAuditEvidence(
        baseEvidence,
        () => Promise.reject(originalError),
        faultyAdapter
      )
    ).rejects.toThrow("Business logic failed");
  });
});
