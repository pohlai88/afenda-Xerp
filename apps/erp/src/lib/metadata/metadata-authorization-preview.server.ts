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

/**
 * True when metadata runtime was composed for pre-evaluation context-required preview
 * (defer policy + readonly state + verbose diagnostics — B64 production path).
 */
export function isMetadataAuthorizationContextRequiredPreviewContext(
  context: MetadataUiRenderContext
): boolean {
  const policyDecision = context.runtime.policyDecision;

  return (
    context.runtime.state === "readonly" &&
    context.runtime.readonlyMode === true &&
    policyDecision !== undefined &&
    policyDecision.kind === "defer" &&
    policyDecision.reason === "context_required" &&
    context.diagnostics.enabled &&
    context.diagnostics.level === "verbose"
  );
}
