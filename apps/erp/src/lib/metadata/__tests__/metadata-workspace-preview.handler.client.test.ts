import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/metadata/metadata-workspace-preview.action", () => ({
  refreshMetadataWorkspacePreviewAction: vi.fn(async () => ({
    ok: true,
    data: { refreshedAt: "2026-06-28T12:00:00.000Z" },
  })),
}));

import { refreshMetadataWorkspacePreviewAction } from "@/lib/metadata/metadata-workspace-preview.action";
import { createMetadataWorkspacePreviewActionHandler } from "@/lib/metadata/metadata-workspace-preview.handler.client";

describe("createMetadataWorkspacePreviewActionHandler", () => {
  it("routes refresh-workspace-preview through the server action adapter", async () => {
    const handler = createMetadataWorkspacePreviewActionHandler();

    const result = await handler(
      {
        key: "refresh-workspace-preview",
        label: "Refresh view",
        kind: "button",
        visibility: "visible",
      },
      { source: "erp.metadata-workspace.preview" }
    );

    expect(refreshMetadataWorkspacePreviewAction).toHaveBeenCalledWith({});
    expect(result).toEqual({
      ok: true,
      actionKey: "refresh-workspace-preview",
      message: "Metadata workspace refreshed.",
    });
  });
});
