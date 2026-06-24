import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type {
  DocsGuideCardGridProps,
  DocsGuideCardItem,
} from "./docs-block.types";

function DocsGuideCardIcon({ icon: Icon }: { readonly icon: LucideIcon }) {
  return (
    <span aria-hidden="true" className="afenda-docs-guide-grid__icon">
      <Icon size={18} strokeWidth={1.75} />
    </span>
  );
}

function DocsGuideCard({
  item,
}: {
  readonly item: DocsGuideCardItem;
}): ReactNode {
  return (
    <a
      className="afenda-docs-guide-grid__link"
      href={item.href}
      rel="noopener noreferrer"
    >
      <article className="afenda-docs-guide-grid__card" data-slot="card">
        <div className="afenda-docs-guide-grid__card-header">
          <div className="afenda-docs-guide-grid__card-top">
            {item.icon ? <DocsGuideCardIcon icon={item.icon} /> : null}
            {item.badge ? (
              <span className="afenda-docs-badge" data-tone="info">
                {item.badge}
              </span>
            ) : null}
          </div>
          <h3 className="afenda-docs-guide-grid__card-title">{item.title}</h3>
          <p className="afenda-docs-guide-grid__card-description">
            {item.description}
          </p>
        </div>
      </article>
    </a>
  );
}

export function DocsGuideCardGrid({
  eyebrow,
  heading,
  lead,
  items,
  variant = "grid",
}: DocsGuideCardGridProps): ReactNode {
  return (
    <section
      aria-label={heading ?? "Documentation guides"}
      className="afenda-docs-guide-grid"
      data-variant={variant}
    >
      {(eyebrow ?? heading ?? lead) ? (
        <header className="afenda-docs-guide-grid__header">
          {eyebrow ? (
            <p className="afenda-docs-guide-grid__eyebrow">{eyebrow}</p>
          ) : null}
          {heading ? (
            <h2 className="afenda-docs-guide-grid__title">{heading}</h2>
          ) : null}
          {lead ? <p className="afenda-docs-guide-grid__lead">{lead}</p> : null}
        </header>
      ) : null}
      <div className="afenda-docs-guide-grid__cards">
        {items.map((item) => (
          <DocsGuideCard item={item} key={item.href} />
        ))}
      </div>
    </section>
  );
}

export type {
  DocsGuideCardGridProps,
  DocsGuideCardGridVariant,
  DocsGuideCardItem,
} from "./docs-block.types";
