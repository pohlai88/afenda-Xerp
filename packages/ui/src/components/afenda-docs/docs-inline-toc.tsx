import type { ReactNode } from "react";

export interface DocsInlineTocItem {
  readonly title: string;
  readonly url: string;
  readonly depth: number;
}

export type DocsInlineTocVariant = "card" | "rail" | "minimal";

export interface DocsInlineTocProps {
  readonly title?: string;
  readonly items: readonly DocsInlineTocItem[];
  readonly variant?: DocsInlineTocVariant;
}

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
            key={item.url}
            className="afenda-docs-inline-toc__item"
            data-depth={item.depth}
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
