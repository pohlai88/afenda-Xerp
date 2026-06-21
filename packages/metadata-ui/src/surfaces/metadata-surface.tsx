import type { MetadataSurfaceProps } from "../contracts/surface-renderer.contract.js";
import { createMetadataDiagnosticsSnapshot } from "../diagnostics/create-metadata-diagnostics-snapshot.js";
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
      {context.diagnostics.enabled ? (
        <MetadataDiagnosticsPanel
          context={context}
          snapshot={createMetadataDiagnosticsSnapshot(context, {
            surface: { surfaceType: type },
          })}
        />
      ) : null}
    </section>
  );
}
