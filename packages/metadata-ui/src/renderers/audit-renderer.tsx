import { createRegistryEntry } from "@afenda/metadata";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { AuditSection } from "../sections/list-section.js";

export const auditRenderer = createMetadataRendererDefinition({
  identity: {
    key: "metadata-ui.renderer.audit.default",
    version: "0.1.0",
    label: "Audit Renderer",
  },
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.audit.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-audit",
  sectionTypes: ["audit"],
  diagnostics: {
    namespace: "metadata-ui.renderer.audit",
  },
  render(_input, context) {
    return (
      <AuditSection
        context={context}
        identity={{ id: "metadata-audit", title: "Audit" }}
        slots={{ content: null }}
      />
    );
  },
});
