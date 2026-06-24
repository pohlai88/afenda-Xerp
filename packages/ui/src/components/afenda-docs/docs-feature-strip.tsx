import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "../badge";

export interface DocsFeatureStripItem {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly tone?: "neutral" | "info" | "success";
}

export type DocsFeatureStripVariant = "bordered" | "plain" | "dense";

export interface DocsFeatureStripProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly items: readonly DocsFeatureStripItem[];
  readonly variant?: DocsFeatureStripVariant;
}

function DocsFeatureIcon({
  icon: Icon,
}: {
  readonly icon: LucideIcon;
}) {
  return (
    <span aria-hidden="true" className="afenda-docs-feature-strip__icon">
      <Icon size={16} strokeWidth={1.75} />
    </span>
  );
}

export function DocsFeatureStrip({
  title,
  subtitle,
  items,
  variant = "bordered",
}: DocsFeatureStripProps): ReactNode {
  return (
    <section
      aria-labelledby="afenda-docs-feature-strip-title"
      className="afenda-docs-feature-strip"
      data-variant={variant}
    >
      <header className="afenda-docs-feature-strip__header">
        <h2
          className="afenda-docs-feature-strip__title"
          id="afenda-docs-feature-strip-title"
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="afenda-docs-feature-strip__subtitle">{subtitle}</p>
        ) : null}
      </header>
      <ul className="afenda-docs-feature-strip__list">
        {items.map((item) => (
          <li key={item.title} className="afenda-docs-feature-strip__item">
            <div className="afenda-docs-feature-strip__item-head">
              <DocsFeatureIcon icon={item.icon} />
              <span className="afenda-docs-feature-strip__item-title">
                {item.title}
              </span>
              {item.tone && item.tone !== "neutral" ? (
                <Badge emphasis="soft" tone={item.tone}>
                  {item.tone === "success" ? "Ready" : "Guide"}
                </Badge>
              ) : null}
            </div>
            <p className="afenda-docs-feature-strip__item-copy">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
