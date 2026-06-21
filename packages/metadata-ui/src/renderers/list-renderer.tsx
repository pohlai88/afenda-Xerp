import { createRegistryEntry } from "@afenda/metadata";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { ListSection } from "../sections/list-section.js";

export const listRenderer = createMetadataRendererDefinition({
  identity: {
    key: "metadata-ui.renderer.list.default",
    version: "0.1.0",
    label: "List Renderer",
  },
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.list.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-list",
  sectionTypes: ["list"],
  diagnostics: {
    namespace: "metadata-ui.renderer.list",
  },
  render(_input, context) {
    return (
      <ListSection
        context={context}
        identity={{ id: "metadata-list", title: "List" }}
        slots={{ content: null }}
      />
    );
  },
});
