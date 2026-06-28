import { AppErrors } from "@afenda/kernel";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockResolveActionOperatingContext, mockExecuteRefreshGate } =
  vi.hoisted(() => ({
    mockResolveActionOperatingContext: vi.fn(),
    mockExecuteRefreshGate: vi.fn(),
  }));

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: mockResolveActionOperatingContext,
}));

vi.mock(
  "@/lib/system-admin/execute-refresh-accounting-readiness-gate-full.server",
  () => ({
    executeRefreshAccountingReadinessGateFull: mockExecuteRefreshGate,
  })
);

vi.mock("@/lib/observability/create-request-bound-logger", () => ({
  createRequestBoundErpLogger: vi.fn(async () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  })),
}));

import { refreshSystemAdminDiagnosticsMetadataAction } from "../metadata-system-admin-diagnostics.action.js";

const operatingContext = {
  actor: { userId: "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV" },
  correlationId: "cor_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenant: { tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV" },
} as const;

describe("refreshSystemAdminDiagnosticsMetadataAction", () => {
  beforeEach(() => {
    mockResolveActionOperatingContext.mockReset();
    mockExecuteRefreshGate.mockReset();
  });

  it("delegates to the shared readiness gate executor after resolving context once", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      operatingContext,
      session: { user: { userId: operatingContext.actor.userId } },
    });
    mockExecuteRefreshGate.mockResolvedValueOnce({
      ok: true,
      data: {
        checkedAt: "2026-06-28T12:00:00.000Z",
        runMode: "full" as const,
      },
    });

    const result = await refreshSystemAdminDiagnosticsMetadataAction({});

    expect(mockExecuteRefreshGate).toHaveBeenCalledWith({
      operatingContext,
    });
    expect(result).toEqual({
      ok: true,
      data: {
        checkedAt: "2026-06-28T12:00:00.000Z",
        runMode: "full",
      },
    });
  });

  it("rejects invalid input through protected action parsing", async () => {
    const result = await refreshSystemAdminDiagnosticsMetadataAction({
      unexpected: true,
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw AppErrors.internal("Expected validation failure.");
    }
    expect(result.code).toBe("VALIDATION_ERROR");
    expect(mockExecuteRefreshGate).not.toHaveBeenCalled();
    expect(mockResolveActionOperatingContext).not.toHaveBeenCalled();
  });
});
