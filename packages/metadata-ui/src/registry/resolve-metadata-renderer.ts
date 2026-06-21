import { RENDERER_COMPATIBILITY_RULES } from "@afenda/metadata";

import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import type { MetadataRendererResolveInput } from "./metadata-renderer-registry.types.js";

function isRendererSupported(
  renderer: MetadataRendererDefinition,
  input: MetadataRendererResolveInput
): boolean {
  const supportResult = renderer.supports?.(input.input, input.context);

  return supportResult?.supported ?? true;
}

function isRendererLifecycleAllowed(
  renderer: MetadataRendererDefinition,
  context: MetadataRendererResolveInput["context"]
): boolean {
  const { lifecycle } = renderer.governance;

  if (lifecycle === "disabled") {
    return false;
  }

  if (
    lifecycle === "experimental" &&
    !context.policy.allowExperimentalRenderers
  ) {
    return false;
  }

  if (
    lifecycle === "deprecated" &&
    !context.policy.allowDeprecatedRenderers
  ) {
    return false;
  }

  return true;
}

function isRendererEnvironmentAllowed(
  renderer: MetadataRendererDefinition,
  context: MetadataRendererResolveInput["context"]
): boolean {
  const { source } = context.environment;
  const policy = renderer.policy;

  if (source === "server" && !policy.supportsServerRender) {
    return false;
  }

  if (source === "client" && !policy.supportsClientRender) {
    return false;
  }

  if (source === "static-preview" && !policy.supportsStaticPreview) {
    return false;
  }

  return true;
}

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
        renderer.governance.sectionTypes.includes(sectionType) &&
        renderer.governance.capability === capability
    )
    .filter((renderer) => isRendererLifecycleAllowed(renderer, context))
    .filter((renderer) => isRendererEnvironmentAllowed(renderer, context))
    .filter((renderer) => isRendererSupported(renderer, input))
    .sort(
      (left, right) =>
        right.governance.priority - left.governance.priority
    );

  return candidates[0];
}
