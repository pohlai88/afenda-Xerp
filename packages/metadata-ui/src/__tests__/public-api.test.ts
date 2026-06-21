import { describe, expect, it } from "vitest";

import * as client from "../client.js";
import * as root from "../index.js";
import * as server from "../server.js";

describe("metadata-ui public API", () => {
  it("exports shared contracts and runtime helpers from index", () => {
    expect(root.PACKAGE_NAME).toBe("@afenda/metadata-ui");
    expect(root.metadataUiContract.packageName).toBe("@afenda/metadata-ui");
    expect(typeof root.createMetadataRendererRegistry).toBe("function");
    expect(typeof root.resolveMetadataRenderer).toBe("function");
    expect(typeof root.createMetadataDiagnosticsSnapshot).toBe("function");
  });

  it("keeps diagnostics UI on the client entry only", () => {
    expect(typeof client.MetadataDiagnosticsPanel).toBe("function");
    expect(typeof client.MetadataRenderTrace).toBe("function");
    expect(typeof client.MetadataBoundaryWarning).toBe("function");
    expect("MetadataDiagnosticsPanel" in root).toBe(false);
    expect("MetadataDiagnosticsPanel" in server).toBe(false);
  });

  it("exports client renderers, interactive components, and fixtures", () => {
    expect(typeof client.MetadataActionBar).toBe("function");
    expect(typeof client.TabsLayout).toBe("function");
    expect(typeof client.WizardLayout).toBe("function");
    expect(typeof client.listRenderer).toBe("object");
    expect(client.samplePageSurfaceFixture.type).toBe("page");
    expect(client.sampleLoadingStateFixture.state).toBe("loading");
  });

  it("exports server-safe composition components without client action UI", () => {
    expect(typeof server.MetadataPageSurface).toBe("function");
    expect(typeof server.MetadataLayout).toBe("function");
    expect(typeof server.TabsLayout).toBe("function");
    expect(typeof server.WizardLayout).toBe("function");
    expect(typeof server.ListSection).toBe("function");
    expect(typeof server.MetadataLoadingState).toBe("function");
    expect(typeof server.MetadataState).toBe("function");
    expect("MetadataActionBar" in server).toBe(false);
  });

  it("re-exports shared kernel symbols through client and server entries", () => {
    expect(client.PACKAGE_NAME).toBe("@afenda/metadata-ui");
    expect(server.PACKAGE_NAME).toBe("@afenda/metadata-ui");
    expect(typeof client.resolveMetadataRenderer).toBe("function");
    expect(typeof server.createMetadataUiRenderContext).toBe("function");
    expect(client.sampleRenderContext.runtime.state).toBe("ready");
    expect(server.sampleRenderContext.runtime.state).toBe("ready");
  });
});
