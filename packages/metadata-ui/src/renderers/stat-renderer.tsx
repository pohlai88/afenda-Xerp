import { createRegistryEntry } from "@afenda/metadata";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { StatSection } from "../sections/list-section.js";

export const statRenderer = {
  key: "metadata-ui.renderer.stat.default",
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.stat.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-stat",
  sectionType: "stat",
  priority: 100,
  render(_input, context) {
    return (
      <StatSection
        context={context}
        id="metadata-stat"
        title="Stat"
      />
    );
  },
} satisfies MetadataRendererDefinition;
