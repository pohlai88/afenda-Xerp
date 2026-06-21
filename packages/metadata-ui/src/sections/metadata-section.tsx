import type { MetadataSectionProps } from "../contracts/section-renderer.contract.js";

function joinClassNames(
  ...values: Array<string | false | undefined>
): string | undefined {
  const classNames = values.filter(Boolean);

  return classNames.length > 0 ? classNames.join(" ") : undefined;
}

export function MetadataSection({
  identity,
  type,
  context,
  slots,
  state,
  a11y,
  presentation,
  diagnostics,
}: MetadataSectionProps) {
  const visibility = state?.visibility ?? "visible";

  if (visibility === "hidden") {
    return null;
  }

  const titleId = identity.title ? `${identity.id}-title` : undefined;
  const rootClassName = joinClassNames(
    "metadata-section",
    presentation?.className,
    presentation?.chrome ? `metadata-section-${presentation.chrome}` : undefined,
    presentation?.padded ? "metadata-section-padded" : undefined,
    visibility === "disabled" ? "metadata-section-disabled" : undefined,
    visibility === "collapsed" ? "metadata-section-collapsed" : undefined
  );

  const headerContent =
    slots.header ??
    (identity.title || identity.description ? (
      <>
        {identity.title ? <h2 id={titleId}>{identity.title}</h2> : null}
        {identity.description ? <p>{identity.description}</p> : null}
      </>
    ) : null);

  return (
    <section
      aria-describedby={a11y?.ariaDescribedBy}
      aria-label={a11y?.ariaLabel}
      aria-labelledby={a11y?.ariaLabelledBy ?? titleId}
      className={rootClassName}
      data-metadata-readonly={state?.readonly ? "true" : undefined}
      data-metadata-section={type}
      data-metadata-state={context.runtime.state}
      data-metadata-visibility={visibility}
      data-slot="metadata-section"
      id={identity.id}
      {...(diagnostics?.rendererKey
        ? { "data-renderer-key": diagnostics.rendererKey }
        : {})}
      {...(diagnostics?.rendererVersion
        ? { "data-renderer-version": diagnostics.rendererVersion }
        : {})}
      {...(state?.reason ? { "data-visibility-reason": state.reason } : {})}
    >
      {headerContent ? (
        <header className="metadata-section-header" data-slot="metadata-section-header">
          {headerContent}
        </header>
      ) : null}
      {slots.actions ? (
        <div className="metadata-section-actions" data-slot="metadata-section-actions">
          {slots.actions}
        </div>
      ) : null}
      {visibility !== "collapsed" ? (
        <div className="metadata-section-content" data-slot="metadata-section-content">
          {slots.content}
        </div>
      ) : null}
      {slots.footer ? (
        <footer className="metadata-section-footer" data-slot="metadata-section-footer">
          {slots.footer}
        </footer>
      ) : null}
    </section>
  );
}

export type { MetadataSectionProps } from "../contracts/section-renderer.contract.js";
