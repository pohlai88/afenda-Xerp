import { createRegistryEntry } from "@afenda/metadata";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { FormSection } from "../sections/list-section.js";

export const formRenderer = createMetadataRendererDefinition({
  identity: {
    key: "metadata-ui.renderer.form.default",
    version: "0.1.0",
    label: "Form Renderer",
  },
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.form.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-form",
  sectionTypes: ["form"],
  diagnostics: {
    namespace: "metadata-ui.renderer.form",
  },
  render(_input, context) {
    return (
      <FormSection
        context={context}
        identity={{ id: "metadata-form", title: "Form" }}
        slots={{ content: null }}
      />
    );
  },
});
