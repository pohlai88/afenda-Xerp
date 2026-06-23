import type { MetadataSurfaceProps } from "../contracts/surface.contract.js";
import {
  createMetadataDiagnosticsSnapshot,
  MetadataDiagnosticsPanel,
} from "../diagnostics/index.js";
import { joinClassNames } from "../rendering/join-class-names.js";
import {
  resolveMetadataUiDensityAttribute,
  resolveMetadataUiGovernedClassName,
} from "../wiring/governance.js";
import { MetadataSurfaceActionBar } from "./metadata-surface-actions.js";

export function MetadataSurface({
  identity,
  type,
  context,
  slots,
  breadcrumbs,
  actions,
  state,
  a11y,
  presentation,
  diagnostics,
}: MetadataSurfaceProps) {
  const visibility = state?.visibility ?? "visible";

  if (visibility === "hidden") {
    return null;
  }

  const titleId = identity.title ? `${identity.id}-title` : undefined;
  const isReadonly =
    visibility === "readonly" || context.runtime.readonlyMode === true;

  const rootClassName = joinClassNames(
    resolveMetadataUiGovernedClassName("surface", {
      structuralClassNames: [
        "metadata-container",
        "metadata-surface",
        presentation?.className,
        presentation?.chrome
          ? `metadata-surface-${presentation.chrome}`
          : undefined,
        presentation?.width
          ? `metadata-surface-${presentation.width}`
          : undefined,
        presentation?.padded === true ? "metadata-surface-padded" : undefined,
        visibility === "disabled" ? "metadata-surface-disabled" : undefined,
        isReadonly ? "metadata-surface-readonly" : undefined,
      ],
      density: context.runtime.density,
    }),
    visibility === "disabled"
      ? resolveMetadataUiGovernedClassName("disabled", {
          density: context.runtime.density,
        })
      : undefined,
    isReadonly
      ? resolveMetadataUiGovernedClassName("readonly", {
          density: context.runtime.density,
        })
      : undefined
  );

  const headerClassName = resolveMetadataUiGovernedClassName("section-header", {
    structuralClassNames: ["metadata-surface-header"],
    density: context.runtime.density,
  });
  const toolbarClassName = joinClassNames("metadata-surface-toolbar");
  const bodyClassName = resolveMetadataUiGovernedClassName("layout", {
    structuralClassNames: ["metadata-surface-body"],
    density: context.runtime.density,
  });
  const asideClassName = joinClassNames("metadata-surface-aside");
  const contentClassName = joinClassNames("metadata-surface-content");
  const footerClassName = joinClassNames("metadata-surface-footer");

  const headerContent =
    slots.header ??
    (identity.title || identity.description || breadcrumbs?.length ? (
      <>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="metadata-surface-breadcrumbs">
            <ol>
              {breadcrumbs.map((crumb, index) => {
                const isCurrent = index === breadcrumbs.length - 1;

                return (
                  <li key={crumb.key}>
                    {crumb.href && !isCurrent ? (
                      <a href={crumb.href}>{crumb.label}</a>
                    ) : (
                      <span
                        {...(isCurrent
                          ? { "aria-current": "page" as const }
                          : {})}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
        {identity.title ? (
          <h1 className="metadata-surface-title" id={titleId}>
            {identity.title}
          </h1>
        ) : null}
        {identity.description ? (
          <p className="metadata-surface-description">{identity.description}</p>
        ) : null}
        {state?.loading ? <p role="status">Loading…</p> : null}
        {state?.empty ? <p>No content available.</p> : null}
        {state?.errorMessage ? <p role="alert">{state.errorMessage}</p> : null}
      </>
    ) : null);

  const labelledBy = a11y?.ariaLabelledBy ?? titleId;
  const ariaLabel =
    labelledBy === undefined
      ? (a11y?.ariaLabel ?? identity.title)
      : a11y?.ariaLabel;

  return (
    <section
      aria-describedby={a11y?.ariaDescribedBy}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      className={rootClassName}
      data-metadata-density={resolveMetadataUiDensityAttribute(
        context.runtime.density
      )}
      data-metadata-hydration={context.environment.hydration}
      data-metadata-readonly={isReadonly ? "true" : "false"}
      data-metadata-runtime-state={context.runtime.state}
      data-metadata-source={context.environment.source}
      data-metadata-state={context.runtime.state}
      data-metadata-surface={type}
      data-metadata-visibility={visibility}
      data-slot="metadata-surface"
      data-surface-id={identity.id}
      id={identity.id}
      {...(diagnostics?.layoutRendererKey
        ? { "data-layout-renderer-key": diagnostics.layoutRendererKey }
        : {})}
      {...(diagnostics?.surfaceRendererKey
        ? { "data-surface-renderer-key": diagnostics.surfaceRendererKey }
        : {})}
      {...(isReadonly && state?.reason
        ? { "data-metadata-readonly-reason": state.reason }
        : {})}
      {...(state?.reason ? { "data-visibility-reason": state.reason } : {})}
    >
      {headerContent ? (
        <header className={headerClassName} data-slot="metadata-surface-header">
          {headerContent}
        </header>
      ) : null}
      {actions && actions.length > 0 ? (
        <MetadataSurfaceActionBar actions={actions} context={context} />
      ) : null}
      {slots.toolbar ? (
        <div className={toolbarClassName} data-slot="metadata-surface-toolbar">
          {slots.toolbar}
        </div>
      ) : null}
      <div className={bodyClassName} data-slot="metadata-surface-body">
        {slots.aside ? (
          <aside className={asideClassName} data-slot="metadata-surface-aside">
            {slots.aside}
          </aside>
        ) : null}
        <main className={contentClassName} data-slot="metadata-surface-content">
          {slots.content}
        </main>
      </div>
      {slots.footer ? (
        <footer className={footerClassName} data-slot="metadata-surface-footer">
          {slots.footer}
        </footer>
      ) : null}
      {context.diagnostics.enabled ? (
        <MetadataDiagnosticsPanel
          context={context}
          snapshot={createMetadataDiagnosticsSnapshot(context, {
            surface: { surfaceType: type },
            renderer: {
              ...(diagnostics?.surfaceRendererKey
                ? { rendererKey: diagnostics.surfaceRendererKey }
                : {}),
            },
          })}
        />
      ) : null}
    </section>
  );
}

export type { MetadataSurfaceProps } from "../contracts/surface.contract.js";
