import { describe, expect, it } from "vitest";

import {
  createSectionRenderer,
  defaultMetadataRenderers,
  listRenderer,
} from "../renderers/index.js";
import { ListSection } from "../sections/index.js";

describe("default section renderers", () => {
  it("registers all governed default section renderers", () => {
    expect(defaultMetadataRenderers).toHaveLength(7);
    expect(listRenderer.identity.key).toBe("metadata-ui.renderer.list.default");
    expect(listRenderer.governance.capability).toBe("render-list");
    expect(listRenderer.governance.sectionTypes).toEqual(["list"]);
    expect(listRenderer.diagnostics?.namespace).toBe(
      "metadata-ui.renderer.list"
    );
  });

  it("creates custom section renderers with governed capability lookup", () => {
    const customListRenderer = createSectionRenderer({
      sectionType: "list",
      label: "Custom List Renderer",
      defaultIdentity: { id: "custom-list", title: "Custom List" },
      SectionComponent: ListSection,
    });

    expect(customListRenderer.identity.key).toBe(
      "metadata-ui.renderer.list.default"
    );
    expect(customListRenderer.governance.capability).toBe("render-list");
  });
});
