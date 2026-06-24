import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  limit: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
}));

vi.mock("@afenda/database", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/database")>();

  return {
    ...actual,
    getDb: () => ({
      select: dbMocks.select,
    }),
  };
});

import {
  listRecentAuditEvents,
  mapAuditEventRow,
} from "../list-recent-audit-events.server";

const SAMPLE_CREATED_AT = new Date("2026-06-24T10:15:30.000Z");

describe("mapAuditEventRow (TIP-013 Slice 3)", () => {
  it("maps database row fields to serializable admin audit event row", () => {
    const row = mapAuditEventRow({
      id: "audit-001",
      action: "system_admin.section.access_denied",
      module: "system_admin",
      targetType: "system_admin_section",
      targetId: "users",
      result: "denied",
      correlationId: "corr-audit-001",
      createdAt: SAMPLE_CREATED_AT,
    });

    expect(row).toEqual({
      id: "audit-001",
      action: "system_admin.section.access_denied",
      module: "system_admin",
      targetType: "system_admin_section",
      targetId: "users",
      result: "denied",
      correlationId: "corr-audit-001",
      createdAt: "2026-06-24T10:15:30.000Z",
    });
  });

  it("preserves null targetId", () => {
    const row = mapAuditEventRow({
      id: "audit-002",
      action: "workspace.dashboard.read",
      module: "workspace",
      targetType: "dashboard",
      targetId: null,
      result: "success",
      correlationId: "corr-audit-002",
      createdAt: SAMPLE_CREATED_AT,
    });

    expect(row.targetId).toBeNull();
    expect(row.result).toBe("success");
  });
});

describe("listRecentAuditEvents (TIP-013 Slice 3)", () => {
  beforeEach(() => {
    dbMocks.select.mockReset();
    dbMocks.from.mockReset();
    dbMocks.where.mockReset();
    dbMocks.orderBy.mockReset();
    dbMocks.limit.mockReset();

    dbMocks.select.mockReturnValue({
      from: dbMocks.from,
    });
    dbMocks.from.mockReturnValue({
      where: dbMocks.where,
    });
    dbMocks.where.mockReturnValue({
      orderBy: dbMocks.orderBy,
    });
    dbMocks.orderBy.mockReturnValue({
      limit: dbMocks.limit,
    });
    dbMocks.limit.mockResolvedValue([
      {
        id: "audit-001",
        action: "system_admin.section.access_denied",
        module: "system_admin",
        targetType: "system_admin_section",
        targetId: "users",
        result: "denied",
        correlationId: "corr-audit-001",
        createdAt: SAMPLE_CREATED_AT,
      },
    ]);
  });

  it("queries tenant-scoped audit events with default limit", async () => {
    const events = await listRecentAuditEvents({
      tenantId: "tenant-001",
    });

    expect(dbMocks.limit).toHaveBeenCalledWith(50);
    expect(events).toHaveLength(1);
    expect(events[0]?.id).toBe("audit-001");
    expect(events[0]?.createdAt).toBe("2026-06-24T10:15:30.000Z");
  });

  it("honors custom limit", async () => {
    await listRecentAuditEvents({
      tenantId: "tenant-001",
      limit: 10,
    });

    expect(dbMocks.limit).toHaveBeenCalledWith(10);
  });
});
