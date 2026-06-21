import type { CreateMetadataRenderContextInput } from "../contracts/render-context.contract.js";
import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";
import { MetadataUiError } from "./metadata-ui-error.js";

export function createMetadataRenderContext(
  input: CreateMetadataRenderContextInput
): MetadataUiRenderContext {
  if (!input.runtime) {
    throw new MetadataUiError("MetadataUiRenderContext requires runtime.");
  }

  return {
    runtime: input.runtime,
    source: input.source,
    diagnosticsEnabled: input.diagnosticsEnabled ?? input.runtime.diagnosticsEnabled,
    strict: input.strict ?? true,
  };
}
