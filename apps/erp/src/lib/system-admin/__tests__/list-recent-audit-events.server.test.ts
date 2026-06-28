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
const CURSOR_CREATED_AT = new Date("2026-06-24T09:00:00.000Z");

const SAMPLE_ROW = {
  id: "audit-001",
  action: "system_admin.section.access_denied",
  module: "system_admin",
  targetType: "system_admin_section",
  targetId: "users",
  result: "denied" as const,
  correlationId: "corr-audit-001",
  createdAt: SAMPLE_CREATED_AT,
};

function wireDefaultQueryChain(): void {
  dbMocks.select.mockReturnValue({
    from: dbMocks.from,
  });
  dbMocks.from.mockReturnValue({
    where: dbMocks.where,
  });
  dbMocks.where.mockReturnValue({
    orderBy: dbMocks.orderBy,
    limit: dbMocks.limit,
  });
  dbMocks.orderBy.mockReturnValue({
    limit: dbMocks.limit,
  });
}

describe("mapAuditEventRow (Foundation phase 13 Slice 3)", () => {
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

describe("listRecentAuditEvents (Foundation phase 13 Slice 3)", () => {
  beforeEach(() => {
    dbMocks.select.mockReset();
    dbMocks.from.mockReset();
    dbMocks.where.mockReset();
    dbMocks.orderBy.mockReset();
    dbMocks.limit.mockReset();
    wireDefaultQueryChain();
    dbMocks.limit.mockResolvedValue([SAMPLE_ROW]);
  });

  it("queries tenant-scoped audit events with default limit", async () => {
    const result = await listRecentAuditEvents({
      tenantId: "tenant-001",
    });

    expect(dbMocks.limit).toHaveBeenCalledWith(51);
    expect(result.events).toHaveLength(1);
    expect(result.events[0]?.id).toBe("audit-001");
    expect(result.events[0]?.createdAt).toBe("2026-06-24T10:15:30.000Z");
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it("honors custom limit and computes hasMore with nextCursor", async () => {
    dbMocks.limit.mockResolvedValue([
      SAMPLE_ROW,
      {
        ...SAMPLE_ROW,
        id: "audit-002",
      },
    ]);

    const result = await listRecentAuditEvents({
      tenantId: "tenant-001",
      limit: 1,
    });

    expect(dbMocks.limit).toHaveBeenCalledWith(2);
    expect(result.events).toHaveLength(1);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).toBe("audit-001");
  });

  it("applies cursor filter after resolving cursor row", async () => {
    dbMocks.limit
      .mockResolvedValueOnce([
        {
          ...SAMPLE_ROW,
          id: "audit-cursor",
          createdAt: CURSOR_CREATED_AT,
        },
      ])
      .mockResolvedValueOnce([SAMPLE_ROW]);

    const result = await listRecentAuditEvents({
      tenantId: "tenant-001",
      cursor: "audit-cursor",
      limit: 20,
    });

    expect(dbMocks.limit).toHaveBeenNthCalledWith(1, 1);
    expect(dbMocks.limit).toHaveBeenNthCalledWith(2, 21);
    expect(result.events).toHaveLength(1);
    expect(result.hasMore).toBe(false);
  });

  it("returns empty page when cursor does not resolve for tenant", async () => {
    dbMocks.limit.mockResolvedValueOnce([]);

    const result = await listRecentAuditEvents({
      tenantId: "tenant-001",
      cursor: "missing-cursor",
      limit: 20,
    });

    expect(result).toEqual({
      events: [],
      hasMore: false,
      nextCursor: null,
    });
    expect(dbMocks.limit).toHaveBeenCalledTimes(1);
  });
});
