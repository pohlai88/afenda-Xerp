import type {
  CreateMetadataUiRenderContextInput,
  MetadataUiHydrationMode,
  MetadataUiRenderContext,
  MetadataUiRenderSource,
} from "../contracts/render-context.contract.js";
import { MetadataUiError } from "./metadata-ui-error.js";
import { DEFAULT_METADATA_UI_HYDRATION_BY_SOURCE } from "./runtime.contract.js";

export function getDefaultMetadataUiHydrationMode(
  source: MetadataUiRenderSource
): MetadataUiHydrationMode {
  return DEFAULT_METADATA_UI_HYDRATION_BY_SOURCE[source];
}

export function createMetadataUiRenderContext(
  input: CreateMetadataUiRenderContextInput
): MetadataUiRenderContext {
  if (!input.runtime) {
    throw new MetadataUiError("MetadataUiRenderContext requires runtime.");
  }

  const diagnosticsLevel = input.diagnosticsLevel ?? "off";
  const hydration =
    input.hydration ?? getDefaultMetadataUiHydrationMode(input.source);

  return {
    runtime: input.runtime,
    environment: {
      source: input.source,
      hydration,
      interactive: input.source === "client",
    },
    policy: {
      strict: input.strict ?? false,
      diagnosticsLevel,
      allowExperimentalRenderers: input.allowExperimentalRenderers ?? false,
      allowDeprecatedRenderers: input.allowDeprecatedRenderers ?? false,
    },
    diagnostics: {
      enabled: diagnosticsLevel !== "off",
      level: diagnosticsLevel,
      ...(input.diagnosticsNamespace === undefined
        ? {}
        : { namespace: input.diagnosticsNamespace }),
    },
  };
}

/** @deprecated Use createMetadataUiRenderContext */
export const createMetadataRenderContext = createMetadataUiRenderContext;
