import type { MetadataRendererDefinition } from "../contracts/renderer-definition.contract.js";
import type { MetadataRendererRegistryResolveInput } from "./registry.contract.js";
import { isRendererCapabilityCompatible } from "./renderer-compatibility.js";

function isRendererSupported(
  renderer: MetadataRendererDefinition,
  input: MetadataRendererRegistryResolveInput
): boolean {
  const supportResult = renderer.supports?.(input.input, input.context);

  return supportResult?.supported ?? true;
}

function isRendererLifecycleAllowed(
  renderer: MetadataRendererDefinition,
  context: MetadataRendererRegistryResolveInput["context"]
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
  context: MetadataRendererRegistryResolveInput["context"]
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
  input: MetadataRendererRegistryResolveInput
): MetadataRendererDefinition | undefined {
  const { registry, sectionType, capability, context } = input;

  if (!isRendererCapabilityCompatible(capability, sectionType)) {
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
