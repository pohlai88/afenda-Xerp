import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "../badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../card";

export interface DocsGuideCardItem {
  readonly badge?: string;
  readonly description: string;
  readonly href: string;
  readonly icon?: LucideIcon;
  readonly title: string;
}

export type DocsGuideCardGridVariant = "grid" | "compact" | "featured";

export interface DocsGuideCardGridProps {
  readonly eyebrow?: string;
  readonly heading?: string;
  readonly items: readonly DocsGuideCardItem[];
  readonly lead?: string;
  readonly variant?: DocsGuideCardGridVariant;
}

function DocsGuideCardIcon({ icon: Icon }: { readonly icon: LucideIcon }) {
  return (
    <span aria-hidden="true" className="afenda-docs-guide-grid__icon">
      <Icon size={18} strokeWidth={1.75} />
    </span>
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
      {(eyebrow ?? heading ?? lead) && (
        <header className="afenda-docs-guide-grid__header">
          {eyebrow ? (
            <p className="afenda-docs-guide-grid__eyebrow">{eyebrow}</p>
          ) : null}
          {heading ? (
            <h2 className="afenda-docs-guide-grid__title">{heading}</h2>
          ) : null}
          {lead ? <p className="afenda-docs-guide-grid__lead">{lead}</p> : null}
        </header>
      )}
      <div className="afenda-docs-guide-grid__cards">
        {items.map((item) => (
          <a
            className="afenda-docs-guide-grid__link"
            href={item.href}
            key={item.href}
            rel="noopener noreferrer"
          >
            <Card radius="lg" shadow="raised">
              <CardHeader>
                <div className="afenda-docs-guide-grid__card-top">
                  {item.icon ? <DocsGuideCardIcon icon={item.icon} /> : null}
                  {item.badge ? (
                    <Badge emphasis="soft" tone="info">
                      {item.badge}
                    </Badge>
                  ) : null}
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>
    </section>
  );
}
