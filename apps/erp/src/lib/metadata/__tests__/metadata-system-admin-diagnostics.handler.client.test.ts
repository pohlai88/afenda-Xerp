import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/metadata/metadata-system-admin-diagnostics.action", () => ({
  refreshSystemAdminDiagnosticsMetadataAction: vi.fn(async () => ({
    ok: true,
    data: {
      checkedAt: "2026-06-28T12:00:00.000Z",
      runMode: "full" as const,
    },
  })),
}));

import { refreshSystemAdminDiagnosticsMetadataAction } from "@/lib/metadata/metadata-system-admin-diagnostics.action";
import { createSystemAdminDiagnosticsMetadataActionHandler } from "@/lib/metadata/metadata-system-admin-diagnostics.handler.client";

describe("createSystemAdminDiagnosticsMetadataActionHandler", () => {
  it("routes refresh-readiness-gate through the metadata adapter action", async () => {
    const handler = createSystemAdminDiagnosticsMetadataActionHandler();

    const result = await handler(
      {
        key: "refresh-readiness-gate",
        label: "Run full delegated gate check",
        kind: "button",
        visibility: "visible",
      },
      { source: "erp.system-admin.diagnostics.preview" }
    );

    expect(refreshSystemAdminDiagnosticsMetadataAction).toHaveBeenCalledWith(
      {}
    );
    expect(result).toEqual({
      ok: true,
      actionKey: "refresh-readiness-gate",
      message:
        "Full delegated gate check completed (2026-06-28T12:00:00.000Z).",
    });
  });
});
