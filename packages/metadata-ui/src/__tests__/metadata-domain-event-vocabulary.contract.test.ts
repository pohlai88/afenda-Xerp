import { describe, expect, it } from "vitest";

import {
  isMetadataUiRenderRefreshEventName,
  METADATA_UI_RENDER_REFRESH_EVENT_NAMES,
  resolveMetadataUiRenderRefreshHint,
} from "../contracts/metadata-domain-event-vocabulary.contract.js";

describe("metadata domain event vocabulary", () => {
  it("lists governed render refresh event names", () => {
    expect(METADATA_UI_RENDER_REFRESH_EVENT_NAMES).toContain(
      "workspace.dashboard.layout.updated"
    );
  });

  it("narrows known refresh event names", () => {
    expect(
      isMetadataUiRenderRefreshEventName("workspace.dashboard.layout.updated")
    ).toBe(true);
    expect(isMetadataUiRenderRefreshEventName("tenant.updated")).toBe(false);
  });

  it("resolves workspace dashboard layout refresh hints", () => {
    expect(
      resolveMetadataUiRenderRefreshHint("workspace.dashboard.layout.updated")
    ).toEqual({
      eventName: "workspace.dashboard.layout.updated",
      surface: "workspace",
    });
    expect(resolveMetadataUiRenderRefreshHint("unknown.event")).toBeNull();
  });
});
