import { describe, expect, it } from "vitest";

import * as client from "../client.js";
import * as root from "../index.js";
import * as server from "../server.js";

describe("metadata-ui public API", () => {
  it("exports shared contracts from index", () => {
    expect(root.PACKAGE_NAME).toBe("@afenda/metadata-ui");
    expect(root.metadataUiContract.packageName).toBe("@afenda/metadata-ui");
    expect(typeof root.createMetadataRendererRegistry).toBe("function");
    expect(typeof root.resolveMetadataRenderer).toBe("function");
  });

  it("exports client renderers and interactive components", () => {
    expect(typeof client.MetadataActionBar).toBe("function");
    expect(typeof client.TabsLayout).toBe("function");
    expect(typeof client.listRenderer).toBe("object");
  });

  it("exports server-safe surfaces and layouts", () => {
    expect(typeof server.MetadataPageSurface).toBe("function");
    expect(typeof server.ListSection).toBe("function");
    expect(typeof server.MetadataLoadingState).toBe("function");
  });
});
