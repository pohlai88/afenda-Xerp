import { createRegistryEntry } from "@afenda/metadata";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { FormSection } from "../sections/list-section.js";

export const formRenderer = {
  key: "metadata-ui.renderer.form.default",
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.form.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-form",
  sectionType: "form",
  priority: 100,
  render(_input, context) {
    return (
      <FormSection
        context={context}
        id="metadata-form"
        title="Form"
      />
    );
  },
} satisfies MetadataRendererDefinition;
