import { createRegistryEntry } from "@afenda/metadata";
import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import { AuditSection } from "../sections/list-section.js";

export const auditRenderer = {
  key: "metadata-ui.renderer.audit.default",
  registry: createRegistryEntry({
    authority: "renderer",
    id: "metadata-ui.renderer.audit.default",
    lifecycle: "active",
    version: "0.1.0",
    ownerPackage: "@afenda/metadata-ui",
  }),
  capability: "render-audit",
  sectionType: "audit",
  priority: 100,
  render(_input, context) {
    return (
      <AuditSection
        context={context}
        id="metadata-audit"
        title="Audit"
      />
    );
  },
} satisfies MetadataRendererDefinition;
