import { setupUser } from "@afenda/testing/react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { toastSuccess, toastError } = vi.hoisted(() => ({
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccess,
    error: toastError,
  },
}));

vi.mock("@/lib/metadata/metadata-workspace-preview.action", () => ({
  refreshMetadataWorkspacePreviewAction: vi.fn(async () => ({
    ok: true,
    data: { refreshedAt: "2026-06-28T12:00:00.000Z" },
  })),
}));

import { MetadataWorkspacePreviewActions } from "@/components/metadata-workspace-preview-actions.client";
import { refreshMetadataWorkspacePreviewAction } from "@/lib/metadata/metadata-workspace-preview.action";
import { resolveMetadataWorkspacePreviewActions } from "@/lib/metadata/metadata-workspace-preview.contract";

describe("MetadataWorkspacePreviewActions interaction", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
    vi.mocked(refreshMetadataWorkspacePreviewAction).mockClear();
    vi.mocked(refreshMetadataWorkspacePreviewAction).mockResolvedValue({
      ok: true,
      data: { refreshedAt: "2026-06-28T12:00:00.000Z" },
    });
  });

  it("clicking Refresh view shows the adapter success toast", async () => {
    const user = setupUser();
    const actions = resolveMetadataWorkspacePreviewActions({
      authorizationDenied: false,
    });

    render(<MetadataWorkspacePreviewActions actions={actions} />);

    await user.click(screen.getByRole("button", { name: "Refresh view" }));

    await waitFor(() => {
      expect(toastSuccess).toHaveBeenCalledWith(
        "Metadata workspace refreshed."
      );
    });
    expect(refreshMetadataWorkspacePreviewAction).toHaveBeenCalledWith({});
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("surfaces forbidden server action failures in error toasts", async () => {
    vi.mocked(refreshMetadataWorkspacePreviewAction).mockResolvedValueOnce({
      ok: false,
      code: "FORBIDDEN",
      userMessage:
        "You do not have permission to refresh this metadata workspace.",
    });

    const user = setupUser();
    const actions = resolveMetadataWorkspacePreviewActions({
      authorizationDenied: false,
    });

    render(<MetadataWorkspacePreviewActions actions={actions} />);

    await user.click(screen.getByRole("button", { name: "Refresh view" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "You do not have permission to refresh this metadata workspace."
      );
    });
  });

  it("does not invoke refresh when the action is disabled", async () => {
    const user = setupUser();
    const actions = resolveMetadataWorkspacePreviewActions({
      authorizationDenied: true,
    });

    render(<MetadataWorkspacePreviewActions actions={actions} />);

    expect(screen.getByRole("button", { name: "Refresh view" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Refresh view" }));

    expect(refreshMetadataWorkspacePreviewAction).not.toHaveBeenCalled();
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(toastError).not.toHaveBeenCalled();
  });
});
