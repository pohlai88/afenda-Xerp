import { describe, expect, it } from "vitest";

import { resolveMetadataWorkspacePreviewHumanReferenceRows } from "../resolve-metadata-workspace-preview-human-reference.server.js";

describe("resolve-metadata-workspace-preview-human-reference.server", () => {
  it("parses live registry fixtures at the ERP boundary", () => {
    expect(resolveMetadataWorkspacePreviewHumanReferenceRows()).toEqual([
      {
        scopeLabel: "SKU",
        column: "sku",
        wireValue: "LETTUCE-ROMAINE-001",
      },
      {
        scopeLabel: "Warehouse Code",
        column: "warehouse_code",
        wireValue: "WH-KL-01",
      },
    ]);
  });
});
