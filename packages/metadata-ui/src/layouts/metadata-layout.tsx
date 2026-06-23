import type { MetadataLayoutProps } from "../contracts/layout.contract.js";
import { joinClassNames } from "../rendering/join-class-names.js";
import {
  resolveMetadataUiDensityAttribute,
  resolveMetadataUiGovernedClassName,
} from "../wiring/governance.js";

export function MetadataLayout({
  identity,
  type,
  context,
  slots,
  a11y,
  presentation,
  diagnostics,
}: MetadataLayoutProps) {
  const rootClassName = resolveMetadataUiGovernedClassName("container", {
    structuralClassNames: [
      "metadata-container",
      "metadata-layout",
      presentation?.className,
      presentation?.contained === true
        ? "metadata-layout-contained"
        : undefined,
      presentation?.padded === true ? "metadata-layout-padded" : undefined,
    ],
    density: context.runtime.density,
  });

  const bodyClassName = resolveMetadataUiGovernedClassName("layout", {
    structuralClassNames: [
      "metadata-layout-body",
      presentation?.regionClassNames?.body,
    ],
    density: context.runtime.density,
  });

  const headerClassName = resolveMetadataUiGovernedClassName("section-header", {
    structuralClassNames: [
      "metadata-layout-header",
      presentation?.regionClassNames?.header,
    ],
    density: context.runtime.density,
  });

  const toolbarClassName = joinClassNames(
    "metadata-layout-toolbar",
    presentation?.regionClassNames?.toolbar
  );

  const asideClassName = joinClassNames(
    "metadata-layout-aside",
    presentation?.regionClassNames?.aside
  );

  const contentClassName = joinClassNames(
    "metadata-layout-content",
    presentation?.regionClassNames?.content
  );

  const footerClassName = joinClassNames(
    "metadata-layout-footer",
    presentation?.regionClassNames?.footer
  );

  return (
    <section
      aria-describedby={a11y?.ariaDescribedBy}
      aria-label={a11y?.ariaLabel}
      aria-labelledby={a11y?.ariaLabelledBy}
      className={rootClassName}
      data-layout-id={identity.id}
      data-metadata-density={resolveMetadataUiDensityAttribute(
        context.runtime.density
      )}
      data-metadata-hydration={context.environment.hydration}
      data-metadata-layout={type}
      data-metadata-readonly={context.runtime.readonlyMode ? "true" : "false"}
      data-metadata-runtime-state={context.runtime.state}
      data-metadata-source={context.environment.source}
      data-slot="metadata-layout"
      id={identity.id}
      {...(diagnostics?.rendererKey
        ? { "data-renderer-key": diagnostics.rendererKey }
        : {})}
      {...(diagnostics?.rendererVersion
        ? { "data-renderer-version": diagnostics.rendererVersion }
        : {})}
      {...(identity.label ? { "data-layout-label": identity.label } : {})}
    >
      {slots.header ? (
        <header className={headerClassName} data-slot="metadata-layout-header">
          {slots.header}
        </header>
      ) : null}

      {slots.toolbar ? (
        <section
          className={toolbarClassName}
          data-slot="metadata-layout-toolbar"
        >
          {slots.toolbar}
        </section>
      ) : null}

      <div className={bodyClassName} data-slot="metadata-layout-body">
        {slots.aside ? (
          <aside className={asideClassName} data-slot="metadata-layout-aside">
            {slots.aside}
          </aside>
        ) : null}

        <div className={contentClassName} data-slot="metadata-layout-content">
          {slots.content}
        </div>
      </div>

      {slots.footer ? (
        <footer className={footerClassName} data-slot="metadata-layout-footer">
          {slots.footer}
        </footer>
      ) : null}
    </section>
  );
}

export type { MetadataLayoutProps } from "../contracts/layout.contract.js";
