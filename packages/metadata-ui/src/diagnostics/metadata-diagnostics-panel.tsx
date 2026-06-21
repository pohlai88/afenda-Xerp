import type { MetadataDiagnosticsProps } from "../contracts/diagnostics.contract.js";

export function MetadataDiagnosticsPanel({
  context,
  snapshot,
}: MetadataDiagnosticsProps) {
  if (!context.diagnostics.enabled) {
    return null;
  }

  const { surface, renderer, runtime, presentation } = snapshot;

  return (
    <aside
      aria-label="Metadata diagnostics"
      className="metadata-diagnostics-panel"
      data-slot="metadata-diagnostics-panel"
    >
      <h2>Diagnostics</h2>
      <dl>
        {surface?.surfaceType ? (
          <>
            <dt>Surface</dt>
            <dd>{surface.surfaceType}</dd>
          </>
        ) : null}
        {surface?.layoutType ? (
          <>
            <dt>Layout</dt>
            <dd>{surface.layoutType}</dd>
          </>
        ) : null}
        {surface?.sectionType ? (
          <>
            <dt>Section</dt>
            <dd>{surface.sectionType}</dd>
          </>
        ) : null}
        {renderer?.rendererKey ? (
          <>
            <dt>Renderer</dt>
            <dd>{renderer.rendererKey}</dd>
          </>
        ) : null}
        {renderer?.rendererCapability ? (
          <>
            <dt>Capability</dt>
            <dd>{renderer.rendererCapability}</dd>
          </>
        ) : null}
        {renderer?.rendererVersion ? (
          <>
            <dt>Renderer version</dt>
            <dd>{renderer.rendererVersion}</dd>
          </>
        ) : null}
        <dt>Runtime state</dt>
        <dd>{runtime.runtimeState}</dd>
        <dt>Density</dt>
        <dd>{presentation.densityMode}</dd>
        <dt>Presentation</dt>
        <dd>{presentation.presentationMode}</dd>
        <dt>Read-only</dt>
        <dd>{runtime.readonlyMode ? "yes" : "no"}</dd>
        {runtime.correlationId ? (
          <>
            <dt>Correlation</dt>
            <dd>{runtime.correlationId}</dd>
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
  if (!context.diagnostics.enabled) {
    return null;
  }

  const rendererKey = snapshot.renderer?.rendererKey ?? "unknown";
  const sectionType = snapshot.surface?.sectionType ?? "unknown";

  return (
    <pre
      className="metadata-render-trace"
      data-slot="metadata-render-trace"
    >{`${rendererKey} → ${sectionType}`}</pre>
  );
}

export function MetadataBoundaryWarning({
  context,
  message,
}: MetadataDiagnosticsProps & { readonly message: string }) {
  if (!context.diagnostics.enabled) {
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
