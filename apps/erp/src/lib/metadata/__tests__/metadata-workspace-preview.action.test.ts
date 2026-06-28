import { describe, expect, it, vi } from "vitest";

const { mockResolveActionOperatingContext, mockResolveMetadataAuthorization } =
  vi.hoisted(() => ({
    mockResolveActionOperatingContext: vi.fn(),
    mockResolveMetadataAuthorization: vi.fn(),
  }));

vi.mock("@/lib/server-actions/resolve-action-operating-context.server", () => ({
  resolveActionOperatingContext: mockResolveActionOperatingContext,
}));

vi.mock("@/lib/metadata/resolve-metadata-authorization.server", () => ({
  resolveMetadataAuthorizationFromOperatingContext:
    mockResolveMetadataAuthorization,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/server-actions/record-action-audit", () => ({
  recordActionAudit: vi.fn(async () => undefined),
}));

vi.mock("@/lib/observability/create-request-bound-logger", () => ({
  createRequestBoundErpLogger: vi.fn(async () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  })),
}));

import { revalidatePath } from "next/cache";
import { refreshMetadataWorkspacePreviewAction } from "@/lib/metadata/metadata-workspace-preview.action";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";

const operatingContext = {
  actor: { userId: "usr_01ARZ3NDEKTSV4RRFFQ69G5FAV" },
  correlationId: "cor_01ARZ3NDEKTSV4RRFFQ69G5FAV",
  tenant: { tenantId: "ten_01ARZ3NDEKTSV4RRFFQ69G5FAV" },
} as const;

describe("refreshMetadataWorkspacePreviewAction", () => {
  it("revalidates the metadata workspace route when authorization allows", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      operatingContext,
      session: { user: { userId: operatingContext.actor.userId } },
    });
    mockResolveMetadataAuthorization.mockResolvedValueOnce({
      policyDecision: { kind: "allow" },
      permissionKeys: ["workspace.dashboard.read"],
      permissionModelDescriptors: [],
    });

    const result = await refreshMetadataWorkspacePreviewAction({});

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.refreshedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
    expect(revalidatePath).toHaveBeenCalledWith("/metadata-workspace");
    expect(recordActionAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "metadata.workspace.preview.refresh",
        result: "success",
      })
    );
  });

  it("returns forbidden when metadata authorization denies", async () => {
    mockResolveActionOperatingContext.mockResolvedValueOnce({
      ok: true,
      operatingContext,
      session: { user: { userId: operatingContext.actor.userId } },
    });
    mockResolveMetadataAuthorization.mockResolvedValueOnce({
      policyDecision: { kind: "deny", reason: "forbidden" },
      permissionKeys: [],
      permissionModelDescriptors: [],
    });

    const result = await refreshMetadataWorkspacePreviewAction({});

    expect(result).toEqual({
      ok: false,
      code: "FORBIDDEN",
      userMessage:
        "You do not have permission to refresh this metadata workspace.",
    });
  });
});
