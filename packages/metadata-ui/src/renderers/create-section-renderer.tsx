import {
  createRegistryEntry,
  getRendererCapabilityForSectionType,
} from "@afenda/ui-composition";

import { createMetadataRendererDefinition } from "../registry/create-metadata-renderer-definition.js";
import { MetadataUiError } from "../runtime/metadata-ui-error.js";
import {
  type CreateSectionRendererInput,
  DEFAULT_SECTION_RENDERER_OWNER_PACKAGE,
  DEFAULT_SECTION_RENDERER_VERSION,
} from "./section-renderer.contract.js";

function createDefaultRendererKey(
  sectionType: CreateSectionRendererInput["sectionType"]
) {
  return `metadata-ui.renderer.${sectionType}.default`;
}

export function createSectionRenderer(input: CreateSectionRendererInput) {
  const capability = getRendererCapabilityForSectionType(input.sectionType);

  if (capability === undefined) {
    throw new MetadataUiError(
      `No governed renderer capability exists for section type "${input.sectionType}".`
    );
  }

  const rendererKey = createDefaultRendererKey(input.sectionType);
  const SectionComponent = input.SectionComponent;

  return createMetadataRendererDefinition({
    identity: {
      key: rendererKey,
      version: DEFAULT_SECTION_RENDERER_VERSION,
      label: input.label,
    },
    registry: createRegistryEntry({
      authority: "renderer",
      id: rendererKey,
      lifecycle: "active",
      version: DEFAULT_SECTION_RENDERER_VERSION,
      ownerPackage: DEFAULT_SECTION_RENDERER_OWNER_PACKAGE,
    }),
    capability,
    sectionTypes: [input.sectionType],
    diagnostics: {
      namespace: `metadata-ui.renderer.${input.sectionType}`,
    },
    render(_value, context) {
      return (
        <SectionComponent
          context={context}
          identity={input.defaultIdentity}
          slots={{ content: null }}
        />
      );
    },
  });
}
