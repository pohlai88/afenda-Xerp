import { createRegistryEntry } from "@afenda/metadata";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { ActionSection } from "../sections/list-section.js";

export const actionRenderer = {
  key: "metadata-ui.renderer.action.default",
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.action.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-action",
  sectionType: "action",
  priority: 100,
  render(_input, context) {
    return (
      <ActionSection
        context={context}
        id="metadata-action"
        title="Actions"
      />
    );
  },
} satisfies MetadataRendererDefinition;
