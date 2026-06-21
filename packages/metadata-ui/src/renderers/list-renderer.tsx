import { createRegistryEntry } from "@afenda/metadata";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { ListSection } from "../sections/list-section.js";

export const listRenderer = {
  key: "metadata-ui.renderer.list.default",
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.list.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-list",
  sectionType: "list",
  priority: 100,
  render(_input, context) {
    return (
      <ListSection
        context={context}
        id="metadata-list"
        title="List"
      />
    );
  },
} satisfies MetadataRendererDefinition;
