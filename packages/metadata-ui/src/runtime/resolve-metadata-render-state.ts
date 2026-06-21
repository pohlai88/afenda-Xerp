import type { MetadataUiRenderContext } from "../contracts/render-context.contract.js";

export function resolveMetadataRenderState(
  context: MetadataUiRenderContext
): MetadataUiRenderContext["runtime"]["state"] {
  return context.runtime.state;
}
