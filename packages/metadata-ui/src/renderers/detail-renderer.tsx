import { createRegistryEntry } from "@afenda/metadata";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { DetailSection } from "../sections/list-section.js";

export const detailRenderer = createMetadataRendererDefinition({
  identity: {
    key: "metadata-ui.renderer.detail.default",
    version: "0.1.0",
    label: "Detail Renderer",
  },
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.detail.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-detail",
  sectionTypes: ["detail"],
  diagnostics: {
    namespace: "metadata-ui.renderer.detail",
  },
  render(_input, context) {
    return (
      <DetailSection
        context={context}
        identity={{ id: "metadata-detail", title: "Detail" }}
        slots={{ content: null }}
      />
    );
  },
});
