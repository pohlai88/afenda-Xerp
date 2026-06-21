import type { MetadataSurfaceProps } from "../contracts/surface-renderer.contract.js";
import { MetadataDiagnosticsPanel } from "../diagnostics/metadata-diagnostics-panel.js";

export function MetadataSurface({
  id,
  type,
  title,
  description,
  context,
  children,
}: MetadataSurfaceProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="metadata-surface"
      data-metadata-surface={type}
      data-slot="metadata-surface"
    >
      <header className="metadata-surface-header">
        <h1 id={`${id}-title`}>{title}</h1>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="metadata-surface-body">{children}</div>
      {context.diagnosticsEnabled ? (
        <MetadataDiagnosticsPanel
          context={context}
          snapshot={{
            surfaceType: type,
            runtimeState: context.runtime.state,
            densityMode: context.runtime.density,
            presentationMode: context.runtime.presentationMode,
            readonlyMode: context.runtime.readonlyMode,
            diagnosticsEnabled: context.diagnosticsEnabled,
            ...(context.runtime.correlationId
              ? { correlationId: context.runtime.correlationId }
              : {}),
          }}
        />
      ) : null}
    </section>
  );
}
