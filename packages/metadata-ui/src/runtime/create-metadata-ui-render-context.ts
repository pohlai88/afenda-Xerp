import type {
  CreateMetadataUiRenderContextInput,
  MetadataUiHydrationMode,
  MetadataUiRenderContext,
  MetadataUiRenderSource,
} from "../contracts/render-context.contract.js";
import { MetadataUiError } from "./metadata-ui-error.js";

export function getDefaultMetadataUiHydrationMode(
  source: MetadataUiRenderSource
): MetadataUiHydrationMode {
  switch (source) {
    case "client":
      return "full";

    case "server":
    case "static-preview":
      return "none";
  }
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
      ...(input.diagnosticsNamespace !== undefined
        ? { namespace: input.diagnosticsNamespace }
        : {}),
    },
  };
}

/** @deprecated Use createMetadataUiRenderContext */
export const createMetadataRenderContext = createMetadataUiRenderContext;
