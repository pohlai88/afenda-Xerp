import type { ReactNode } from "react";
import type { DocsInlineTocProps } from "./docs-block.types";

export function DocsInlineToc({
  title = "On this page",
  items,
  variant = "card",
}: DocsInlineTocProps): ReactNode {
  return (
    <nav
      aria-label={title}
      className="afenda-docs-inline-toc"
      data-variant={variant}
    >
      <p className="afenda-docs-inline-toc__title">{title}</p>
      <ul className="afenda-docs-inline-toc__list">
        {items.map((item) => (
          <li
            className="afenda-docs-inline-toc__item"
            data-depth={item.depth}
            key={item.url}
          >
            <a className="afenda-docs-inline-toc__link" href={item.url}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export type {
  DocsInlineTocItem,
  DocsInlineTocProps,
  DocsInlineTocVariant,
} from "./docs-block.types";
