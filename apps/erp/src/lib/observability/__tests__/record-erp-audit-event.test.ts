import {
  AuditAdapterMissingError,
  resetAuditEventPersistence,
  writeAuditEvent,
} from "@afenda/observability";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { recordErpAuditEvent } from "@/lib/observability/record-erp-audit-event";

const mockWarn = vi.fn();

vi.mock("@/lib/observability/create-erp-logger", () => ({
  createErpLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: mockWarn,
    error: vi.fn(),
  })),
}));

vi.mock("@afenda/observability", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@afenda/observability")>();

  return {
    ...actual,
    writeAuditEvent: vi.fn(),
  };
});

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

describe("recordErpAuditEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetAuditEventPersistence();
  });

  it("writes audit events when persistence is configured", async () => {
    vi.mocked(writeAuditEvent).mockResolvedValueOnce({
      id: "audit-001",
    });

    await recordErpAuditEvent({
      action: "user.signed_in",
      correlationId: "corr-audit-test",
      module: "auth",
      result: "success",
      targetType: "session",
    });

    expect(writeAuditEvent).toHaveBeenCalledOnce();
  });

  it("falls back to audit.skipped diagnostic warn when adapter is missing", async () => {
    vi.mocked(writeAuditEvent).mockRejectedValueOnce(
      new AuditAdapterMissingError()
    );

    await expect(
      recordErpAuditEvent({
        action: "user.signed_in",
        correlationId: "corr-audit-fallback",
        module: "auth",
        result: "success",
        targetType: "session",
      })
    ).resolves.toBeUndefined();

    expect(writeAuditEvent).toHaveBeenCalledOnce();
    expect(mockWarn).toHaveBeenCalledWith(
      "audit.skipped",
      expect.objectContaining({
        action: "user.signed_in",
        reason: "audit_adapter_missing",
      })
    );
  });

  it("rethrows non-adapter audit failures", async () => {
    vi.mocked(writeAuditEvent).mockRejectedValueOnce(new Error("db unavailable"));

    await expect(
      recordErpAuditEvent({
        action: "user.signed_in",
        correlationId: "corr-audit-error",
        module: "auth",
        result: "failure",
        targetType: "session",
      })
    ).rejects.toThrow("db unavailable");
  });
});
