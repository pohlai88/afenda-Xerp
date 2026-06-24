import type { ReactNode } from "react";
import type { DocsCodePanelProps } from "./docs-block.types";

export function DocsCodePanel({
  title,
  code,
  language = "typescript",
  variant = "panel",
}: DocsCodePanelProps): ReactNode {
  return (
    <figure className="afenda-docs-code-panel" data-variant={variant}>
      {title ? (
        <figcaption className="afenda-docs-code-panel__title">
          {title}
        </figcaption>
      ) : null}
      <pre className="afenda-docs-code-panel__pre">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </figure>
  );
}

export type {
  DocsCodePanelProps,
  DocsCodePanelVariant,
} from "./docs-block.types";
