import { createRegistryEntry } from "@afenda/metadata";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { ActionSection } from "../sections/list-section.js";

export const actionRenderer = createMetadataRendererDefinition({
  identity: {
    key: "metadata-ui.renderer.action.default",
    version: "0.1.0",
    label: "Action Renderer",
  },
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.action.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-action",
  sectionTypes: ["action"],
  diagnostics: {
    namespace: "metadata-ui.renderer.action",
  },
  render(_input, context) {
    return (
      <ActionSection
        context={context}
        identity={{ id: "metadata-action", title: "Actions" }}
        slots={{ content: null }}
      />
    );
  },
});
