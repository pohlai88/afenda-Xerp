import type { MetadataUiRenderContext } from "@afenda/metadata-ui/server";

/**
 * True when metadata runtime was composed for evaluated authorization denial preview
 * (forbidden state + verbose diagnostics — B61/B62 production path).
 */
export function isMetadataAuthorizationDenialPreviewContext(
  context: MetadataUiRenderContext
): boolean {
  return (
    context.runtime.state === "forbidden" &&
    context.runtime.readonlyMode === true &&
    context.diagnostics.enabled &&
    context.diagnostics.level === "verbose"
  );
}
