import type { MetadataActionResult } from "@afenda/metadata-ui";
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

import { notifyMetadataActionResult } from "../metadata-action-result-toast.client.js";

describe("notifyMetadataActionResult", () => {
  beforeEach(() => {
    toastSuccess.mockClear();
    toastError.mockClear();
  });

  it("shows success toast with adapter message", () => {
    const result: MetadataActionResult = {
      ok: true,
      actionKey: "refresh-workspace-preview",
      message: "Metadata workspace refreshed.",
    };

    notifyMetadataActionResult(result);

    expect(toastSuccess).toHaveBeenCalledWith("Metadata workspace refreshed.");
    expect(toastError).not.toHaveBeenCalled();
  });

  it("shows error toast with userMessage on failure", () => {
    const result: MetadataActionResult = {
      ok: false,
      actionKey: "refresh-workspace-preview",
      code: "FORBIDDEN",
      userMessage:
        "You do not have permission to refresh this metadata workspace.",
    };

    notifyMetadataActionResult(result);

    expect(toastError).toHaveBeenCalledWith(
      "You do not have permission to refresh this metadata workspace."
    );
    expect(toastSuccess).not.toHaveBeenCalled();
  });

  it("uses default success copy when message is omitted", () => {
    const result: MetadataActionResult = {
      ok: true,
      actionKey: "refresh-workspace-preview",
    };

    notifyMetadataActionResult(result);

    expect(toastSuccess).toHaveBeenCalledWith("Action completed.");
  });
});
