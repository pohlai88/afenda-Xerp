import { describe, expect, it, vi } from "vitest";

const {
  mockResolveActionOperatingContext,
  mockGuardSystemAdminSection,
  mockSpawnAccountingReadinessGateLiveStatus,
  mockCreatePinoLogger,
} = vi.hoisted(() => ({
  mockResolveActionOperatingContext: vi.fn(),
  mockGuardSystemAdminSection: vi.fn(),
  mockSpawnAccountingReadinessGateLiveStatus: vi.fn(),
  mockCreatePinoLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  })),
}));

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: mockResolveActionOperatingContext,
}));

vi.mock("@/lib/system-admin/guard-system-admin-section.server", () => ({
  guardSystemAdminSection: mockGuardSystemAdminSection,
}));

vi.mock(
  "@/lib/system-admin/spawn-accounting-readiness-gate-live-status.server",
  () => ({
    spawnAccountingReadinessGateLiveStatus:
      mockSpawnAccountingReadinessGateLiveStatus,
  })
);

vi.mock("@/lib/observability/create-request-bound-logger", () => ({
  createRequestBoundErpLogger: vi.fn(async () => mockCreatePinoLogger()),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: vi.fn(async () => undefined),
}));

import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE } from "@/lib/system-admin/accounting-readiness-gate.copy.contract";
import { refreshAccountingReadinessGateFullAction } from "@/lib/system-admin/refresh-accounting-readiness-gate-full.action";

const sampleOperatingContext = {
  actor: { userId: "user_1" },
  correlationId: "corr_1",
  permissionScope: {
    tenantId: "tenant-001",
    companyId: "company-001",
    organizationId: null,
  },
  workspace: {
    tenantId: "tenant-001",
    companyId: "company-001",
    organizationId: null,
    projectId: null,
  },
} as const;

describe("refreshAccountingReadinessGateFullAction", () => {
  it("returns UNAUTHORIZED when operating context cannot be resolved", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        userMessage: "Sign in to continue.",
      },
    });

    await expect(
      refreshAccountingReadinessGateFullAction(null, new FormData())
    ).resolves.toEqual({
      ok: false,
      code: "UNAUTHORIZED",
      userMessage: "Sign in to continue.",
    });
  });

  it("returns FORBIDDEN when diagnostics section access is denied", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: {
        user: { userId: "user_1" },
      },
      operatingContext: sampleOperatingContext,
    });
    mockGuardSystemAdminSection.mockResolvedValueOnce({
      kind: "forbidden",
      permissionKey: "system_admin.diagnostics.read",
      sectionId: "diagnostics",
    });

    await expect(
      refreshAccountingReadinessGateFullAction(null, new FormData())
    ).resolves.toEqual({
      ok: false,
      code: "FORBIDDEN",
      userMessage: ACCOUNTING_READINESS_GATE_REFRESH_FAILURE_MESSAGE,
    });
  });

  it("refreshes readiness gate snapshot when context and section access resolve", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      session: {
        user: { userId: "user_1" },
      },
      operatingContext: sampleOperatingContext,
    });
    mockGuardSystemAdminSection.mockResolvedValueOnce({
      kind: "allowed",
      section: { sectionId: "diagnostics" },
    });
    mockSpawnAccountingReadinessGateLiveStatus.mockReturnValueOnce({
      checkedAt: "2026-06-24T12:00:00.000Z",
    });

    await expect(
      refreshAccountingReadinessGateFullAction(null, new FormData())
    ).resolves.toEqual({
      ok: true,
      data: {
        checkedAt: "2026-06-24T12:00:00.000Z",
        runMode: "full",
      },
    });

    expect(mockGuardSystemAdminSection).toHaveBeenCalledWith({
      sectionId: "diagnostics",
      operatingContext: sampleOperatingContext,
      correlationId: sampleOperatingContext.correlationId,
    });

    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "system_admin.diagnostics.refresh_readiness_gate_full",
        actorUserId: "user_1",
        module: "system_admin",
        result: "success",
        targetType: "accounting_readiness_gate",
      })
    );
  });
});
