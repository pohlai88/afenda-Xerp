import { createRegistryEntry } from "@afenda/metadata";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { DetailSection } from "../sections/list-section.js";

export const detailRenderer = {
  key: "metadata-ui.renderer.detail.default",
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.detail.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-detail",
  sectionType: "detail",
  priority: 100,
  render(_input, context) {
    return (
      <DetailSection
        context={context}
        id="metadata-detail"
        title="Detail"
      />
    );
  },
} satisfies MetadataRendererDefinition;
