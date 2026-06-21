import { createRegistryEntry } from "@afenda/metadata";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { ChartSection } from "../sections/list-section.js";

export const chartRenderer = createMetadataRendererDefinition({
  identity: {
    key: "metadata-ui.renderer.chart.default",
    version: "0.1.0",
    label: "Chart Renderer",
  },
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.chart.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-chart",
  sectionTypes: ["chart"],
  diagnostics: {
    namespace: "metadata-ui.renderer.chart",
  },
  render(_input, context) {
    return (
      <ChartSection
        context={context}
        identity={{ id: "metadata-chart", title: "Chart" }}
        slots={{ content: null }}
      />
    );
  },
});
