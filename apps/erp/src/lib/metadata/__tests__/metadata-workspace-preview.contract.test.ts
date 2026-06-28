import { describe, expect, it } from "vitest";

import { resolveMetadataWorkspacePreviewActions } from "@/lib/metadata/metadata-workspace-preview.contract";

describe("resolveMetadataWorkspacePreviewActions", () => {
  it("enables refresh when authorization is granted", () => {
    const actions = resolveMetadataWorkspacePreviewActions({
      authorizationDenied: false,
    });
    const refresh = actions.find(
      (action) => action.key === "refresh-workspace-preview"
    );

    expect(refresh?.visibility).toBe("visible");
  });

  it("disables refresh when authorization is denied", () => {
    const actions = resolveMetadataWorkspacePreviewActions({
      authorizationDenied: true,
    });
    const refresh = actions.find(
      (action) => action.key === "refresh-workspace-preview"
    );

    expect(refresh?.visibility).toBe("disabled");
  });
});
