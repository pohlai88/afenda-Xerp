import type { MetadataSectionProps } from "../contracts/section.contract.js";
import { joinClassNames } from "../rendering/join-class-names.js";
import {
  resolveMetadataUiDensityAttribute,
  resolveMetadataUiGovernedClassName,
} from "../wiring/governance.js";

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
  const isReadonly =
    state?.readonly === true || context.runtime.readonlyMode === true;

  const rootClassName = joinClassNames(
    resolveMetadataUiGovernedClassName("section", {
      structuralClassNames: [
        "metadata-container",
        "metadata-section",
        presentation?.className,
        presentation?.chrome
          ? `metadata-section-${presentation.chrome}`
          : undefined,
        presentation?.padded === true ? "metadata-section-padded" : undefined,
        visibility === "disabled" ? "metadata-section-disabled" : undefined,
        visibility === "collapsed" ? "metadata-section-collapsed" : undefined,
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
    structuralClassNames: ["metadata-section-header"],
    density: context.runtime.density,
  });
  const actionsClassName = resolveMetadataUiGovernedClassName("action-bar", {
    structuralClassNames: ["metadata-section-actions"],
    density: context.runtime.density,
  });
  const contentClassName = joinClassNames("metadata-section-content");
  const footerClassName = joinClassNames("metadata-section-footer");

  const headerContent =
    slots.header ??
    (identity.title || identity.description ? (
      <>
        {identity.title ? (
          <h2 className="metadata-section-title" id={titleId}>
            {identity.title}
          </h2>
        ) : null}
        {identity.description ? (
          <p className="metadata-section-description">{identity.description}</p>
        ) : null}
      </>
    ) : null);

  return (
    <section
      aria-describedby={a11y?.ariaDescribedBy}
      aria-label={a11y?.ariaLabel}
      aria-labelledby={a11y?.ariaLabelledBy ?? titleId}
      className={rootClassName}
      data-metadata-density={resolveMetadataUiDensityAttribute(
        context.runtime.density
      )}
      data-metadata-hydration={context.environment.hydration}
      data-metadata-readonly={isReadonly ? "true" : "false"}
      data-metadata-runtime-state={context.runtime.state}
      data-metadata-section={type}
      data-metadata-source={context.environment.source}
      data-metadata-visibility={visibility}
      data-section-id={identity.id}
      data-slot="metadata-section"
      id={identity.id}
      {...(diagnostics?.rendererKey
        ? { "data-renderer-key": diagnostics.rendererKey }
        : {})}
      {...(diagnostics?.rendererVersion
        ? { "data-renderer-version": diagnostics.rendererVersion }
        : {})}
      {...(isReadonly && state?.reason
        ? { "data-metadata-readonly-reason": state.reason }
        : {})}
      {...(state?.reason ? { "data-visibility-reason": state.reason } : {})}
    >
      {headerContent ? (
        <header className={headerClassName} data-slot="metadata-section-header">
          {headerContent}
        </header>
      ) : null}
      {slots.actions ? (
        <div className={actionsClassName} data-slot="metadata-section-actions">
          {slots.actions}
        </div>
      ) : null}
      {visibility === "collapsed" ? null : (
        <div className={contentClassName} data-slot="metadata-section-content">
          {slots.content}
        </div>
      )}
      {slots.footer ? (
        <footer className={footerClassName} data-slot="metadata-section-footer">
          {slots.footer}
        </footer>
      ) : null}
    </section>
  );
}

export type { MetadataSectionProps } from "../contracts/section.contract.js";
