import type { MetadataLayoutProps } from "../contracts/layout-renderer.contract.js";

function joinClassNames(
  ...values: Array<string | false | undefined>
): string | undefined {
  const classNames = values.filter(Boolean);

  return classNames.length > 0 ? classNames.join(" ") : undefined;
}

export function MetadataLayout({
  identity,
  type,
  context,
  slots,
  a11y,
  presentation,
  diagnostics,
}: MetadataLayoutProps) {
  const rootClassName = joinClassNames(
    "metadata-layout",
    presentation?.className,
    presentation?.contained ? "metadata-layout-contained" : undefined,
    presentation?.padded ? "metadata-layout-padded" : undefined
  );

  return (
    <div
      aria-describedby={a11y?.ariaDescribedBy}
      aria-label={a11y?.ariaLabel}
      aria-labelledby={a11y?.ariaLabelledBy}
      className={rootClassName}
      data-metadata-density={context.runtime.density}
      data-metadata-layout={type}
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
        <header
          className={presentation?.regionClassNames?.header}
          data-slot="metadata-layout-header"
        >
          {slots.header}
        </header>
      ) : null}
      {slots.toolbar ? (
        <div
          className={presentation?.regionClassNames?.toolbar}
          data-slot="metadata-layout-toolbar"
        >
          {slots.toolbar}
        </div>
      ) : null}
      <div className="metadata-layout-body" data-slot="metadata-layout-body">
        {slots.aside ? (
          <aside
            className={presentation?.regionClassNames?.aside}
            data-slot="metadata-layout-aside"
          >
            {slots.aside}
          </aside>
        ) : null}
        <main
          className={presentation?.regionClassNames?.content}
          data-slot="metadata-layout-content"
        >
          {slots.content}
        </main>
      </div>
      {slots.footer ? (
        <footer
          className={presentation?.regionClassNames?.footer}
          data-slot="metadata-layout-footer"
        >
          {slots.footer}
        </footer>
      ) : null}
    </div>
  );
}

export type { MetadataLayoutProps } from "../contracts/layout-renderer.contract.js";
