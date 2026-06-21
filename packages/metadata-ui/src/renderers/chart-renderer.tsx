import { createRegistryEntry } from "@afenda/metadata";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { ChartSection } from "../sections/list-section.js";

export const chartRenderer = {
  key: "metadata-ui.renderer.chart.default",
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.chart.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-chart",
  sectionType: "chart",
  priority: 100,
  render(_input, context) {
    return (
      <ChartSection
        context={context}
        id="metadata-chart"
        title="Chart"
      />
    );
  },
} satisfies MetadataRendererDefinition;
