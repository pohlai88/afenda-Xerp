import type { MetadataDiagnosticsProps } from "../contracts/diagnostics.contract.js";

export function MetadataDiagnosticsPanel({
  context,
  snapshot,
}: MetadataDiagnosticsProps) {
  if (!context.diagnosticsEnabled) {
    return null;
  }

  return (
    <aside
      aria-label="Metadata diagnostics"
      className="metadata-diagnostics-panel"
      data-slot="metadata-diagnostics-panel"
    >
      <h2>Diagnostics</h2>
      <dl>
        {snapshot.surfaceType ? (
          <>
            <dt>Surface</dt>
            <dd>{snapshot.surfaceType}</dd>
          </>
        ) : null}
        {snapshot.layoutType ? (
          <>
            <dt>Layout</dt>
            <dd>{snapshot.layoutType}</dd>
          </>
        ) : null}
        {snapshot.sectionType ? (
          <>
            <dt>Section</dt>
            <dd>{snapshot.sectionType}</dd>
          </>
        ) : null}
        {snapshot.rendererKey ? (
          <>
            <dt>Renderer</dt>
            <dd>{snapshot.rendererKey}</dd>
          </>
        ) : null}
        {snapshot.rendererCapability ? (
          <>
            <dt>Capability</dt>
            <dd>{snapshot.rendererCapability}</dd>
          </>
        ) : null}
        <dt>Runtime state</dt>
        <dd>{snapshot.runtimeState}</dd>
        <dt>Density</dt>
        <dd>{snapshot.densityMode}</dd>
        <dt>Presentation</dt>
        <dd>{snapshot.presentationMode}</dd>
        <dt>Read-only</dt>
        <dd>{snapshot.readonlyMode ? "yes" : "no"}</dd>
        {snapshot.correlationId ? (
          <>
            <dt>Correlation</dt>
            <dd>{snapshot.correlationId}</dd>
          </>
        ) : null}
      </dl>
    </aside>
  );
}

export function MetadataRenderTrace({
  context,
  snapshot,
}: MetadataDiagnosticsProps) {
  if (!context.diagnosticsEnabled) {
    return null;
  }

  return (
    <pre
      className="metadata-render-trace"
      data-slot="metadata-render-trace"
    >{`${snapshot.rendererKey ?? "unknown"} → ${snapshot.sectionType ?? "unknown"}`}</pre>
  );
}

export function MetadataBoundaryWarning({
  context,
  message,
}: MetadataDiagnosticsProps & { readonly message: string }) {
  if (!context.diagnosticsEnabled) {
    return null;
  }

  return (
    <p
      className="metadata-boundary-warning"
      data-slot="metadata-boundary-warning"
      role="note"
    >
      {message}
    </p>
  );
}
