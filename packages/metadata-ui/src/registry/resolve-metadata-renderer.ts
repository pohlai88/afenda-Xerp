import { RENDERER_COMPATIBILITY_RULES } from "@afenda/metadata";

import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import type { MetadataRendererResolveInput } from "./metadata-renderer-registry.types.js";

export function resolveMetadataRenderer(
  input: MetadataRendererResolveInput
): MetadataRendererDefinition | undefined {
  const { registry, sectionType, capability, context } = input;

  const compatible = RENDERER_COMPATIBILITY_RULES.some(
    (rule) =>
      rule.capability === capability && rule.sectionType === sectionType
  );

  if (!compatible) {
    return undefined;
  }

  const candidates = registry
    .entries()
    .filter(
      (renderer) =>
        renderer.sectionType === sectionType &&
        renderer.capability === capability
    )
    .filter((renderer) => renderer.supports?.(input.input, context) ?? true)
    .sort((left, right) => right.priority - left.priority);

  return candidates[0];
}
