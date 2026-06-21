import { createRegistryEntry } from "@afenda/metadata";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { StatSection } from "../sections/list-section.js";

export const statRenderer = createMetadataRendererDefinition({
  identity: {
    key: "metadata-ui.renderer.stat.default",
    version: "0.1.0",
    label: "Stat Renderer",
  },
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.stat.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-stat",
  sectionTypes: ["stat"],
  diagnostics: {
    namespace: "metadata-ui.renderer.stat",
  },
  render(_input, context) {
    return (
      <StatSection
        context={context}
        identity={{ id: "metadata-stat", title: "Stat" }}
        slots={{ content: null }}
      />
    );
  },
});
