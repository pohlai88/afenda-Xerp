import { describe, expect, it, vi } from "vitest";
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

function createAuditAdapter(writtenRows: AuditEventInsertRow[], id: string) {
  return {
    write(row: AuditEventInsertRow): Promise<WriteAuditEventResult> {
      writtenRows.push(row);
      return Promise.resolve({ id });
    },
  };
}

describe("withAuditEvidence", () => {
  it("returns operation value and audit ID on success", async () => {
    const writtenRows: AuditEventInsertRow[] = [];
    const adapter = createAuditAdapter(writtenRows, "audit-success-001");

    const { value, auditId } = await withAuditEvidence(
      baseEvidence,
      () => Promise.resolve({ id: "mem-001", name: "Engineering" }),
      adapter
    );

    expect(value).toEqual({ id: "mem-001", name: "Engineering" });
    expect(auditId).toBe("audit-success-001");
    expect(writtenRows).toHaveLength(1);
    expect(writtenRows[0]).toMatchObject({
      result: "success",
      module: "membership",
      action: "membership.create",
      correlationId: "corr-evidence-001",
    });
  });

  it("writes failure audit and re-throws on error", async () => {
    const writtenRows: AuditEventInsertRow[] = [];
    const adapter = createAuditAdapter(writtenRows, "audit-failure-001");
    const thrownError = new Error("Duplicate membership");

    await expect(
      withAuditEvidence(
        baseEvidence,
        () => Promise.reject(thrownError),
        adapter
      )
    ).rejects.toThrow("Duplicate membership");

    expect(writtenRows).toHaveLength(1);
    expect(writtenRows[0]).toMatchObject({
      result: "failure",
      correlationId: "corr-evidence-001",
    });
  });

  it("captures error code in failure metadata without leaking message", async () => {
    const writtenRows: AuditEventInsertRow[] = [];
    const adapter = createAuditAdapter(writtenRows, "audit-err-code");
    const codedError = Object.assign(new Error("Internal"), {
      code: "ERR_UNIQUE",
    });

    await expect(
      withAuditEvidence(baseEvidence, () => Promise.reject(codedError), adapter)
    ).rejects.toThrow();

    const metadata = writtenRows[0]?.metadata as Record<string, unknown>;
    expect(metadata?.errorCode).toBe("ERR_UNIQUE");
    expect(JSON.stringify(metadata)).not.toContain("Internal");
  });

  it("does not suppress original error when audit write itself fails", async () => {
    const faultyAdapter = {
      write(): Promise<WriteAuditEventResult> {
        return Promise.reject(new Error("Audit DB down"));
      },
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

  it("records actor, tenant/company context, target, and correlationId", async () => {
    const writtenRows: AuditEventInsertRow[] = [];
    const adapter = createAuditAdapter(writtenRows, "audit-full-001");

    await withAuditEvidence(
      {
        ...baseEvidence,
        actorUserId: "user-001",
        tenantId: "tenant-001",
        companyId: "company-001",
        organizationId: "org-001",
        permission: "membership.create",
      },
      () => Promise.resolve("done"),
      adapter
    );

    expect(writtenRows[0]).toMatchObject({
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
    const writtenRows: AuditEventInsertRow[] = [];
    const adapter = createAuditAdapter(writtenRows, "audit-meta-001");

    await withAuditEvidence(
      {
        ...baseEvidence,
        metadata: { sourceModule: "onboarding" },
        successMetadata: { planTier: "enterprise" },
      },
      () => Promise.resolve(null),
      adapter
    );

    const metadata = writtenRows[0]?.metadata as Record<string, unknown>;
    expect(metadata?.sourceModule).toBe("onboarding");
    expect(metadata?.planTier).toBe("enterprise");
  });

  it("rejects sensitive keys in caller successMetadata via validation", async () => {
    const adapter = {
      write: vi.fn().mockResolvedValue({ id: "audit-x" }),
    };

    await expect(
      withAuditEvidence(
        {
          ...baseEvidence,
          metadata: { accessToken: "secret-value" },
        },
        () => Promise.resolve("ok"),
        adapter
      )
    ).rejects.toThrow();
  });
});
