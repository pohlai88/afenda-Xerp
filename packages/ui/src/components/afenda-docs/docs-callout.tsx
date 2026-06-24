import type { ReactNode } from "react";

export type DocsCalloutTone = "note" | "info" | "warn";

export type DocsCalloutVariant = "rail" | "soft" | "banner";

export interface DocsCalloutProps {
  readonly title?: string;
  readonly tone?: DocsCalloutTone;
  readonly variant?: DocsCalloutVariant;
  readonly children: ReactNode;
}

export function DocsCallout({
  title,
  tone = "note",
  variant = "rail",
  children,
}: DocsCalloutProps): ReactNode {
  return (
    <aside
      className="afenda-docs-callout"
      data-tone={tone}
      data-variant={variant}
      role="note"
    >
      {title ? (
        <p className="afenda-docs-callout__title">{title}</p>
      ) : null}
      <div className="afenda-docs-callout__body">{children}</div>
    </aside>
  );
}
