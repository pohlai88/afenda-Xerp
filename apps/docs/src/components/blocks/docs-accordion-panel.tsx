import type { ReactNode } from "react";
import type { DocsAccordionPanelProps } from "./docs-block.types";

export function DocsAccordionPanel({
  items,
  variant = "contained",
  defaultOpenItems,
}: DocsAccordionPanelProps): ReactNode {
  const openSet = new Set(defaultOpenItems ?? []);

  return (
    <div className="afenda-docs-accordion-panel" data-variant={variant}>
      {items.map((item) => (
        <details
          className="afenda-docs-accordion-panel__item"
          key={item.title}
          open={openSet.has(item.title)}
        >
          <summary className="afenda-docs-accordion-panel__trigger">
            {item.title}
          </summary>
          <div className="afenda-docs-accordion-panel__content">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}

export type {
  DocsAccordionPanelItem,
  DocsAccordionPanelProps,
  DocsAccordionPanelVariant,
} from "./docs-block.types";
