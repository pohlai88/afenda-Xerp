"use client";

import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";

export interface DocsAccordionPanelItem {
  readonly content: ReactNode;
  readonly title: string;
}

export type DocsAccordionPanelVariant = "contained" | "separated" | "flush";

/** Trigger icon style — plus-minus matches shadcn/studio accordion-04. */
export type DocsAccordionPanelIconStyle = "chevron" | "plus-minus";

export interface DocsAccordionPanelProps {
  /** Item titles to expand by default. Matches the `title` field. */
  readonly defaultOpenItems?: readonly string[];
  readonly iconStyle?: DocsAccordionPanelIconStyle;
  readonly items: readonly DocsAccordionPanelItem[];
  readonly variant?: DocsAccordionPanelVariant;
}

function AccordionPlusMinusIcon(): ReactNode {
  return (
    <span aria-hidden="true" className="afenda-docs-accordion-panel__plus-icon">
      <PlusIcon />
    </span>
  );
}

export function DocsAccordionPanel({
  items,
  variant = "contained",
  iconStyle = "plus-minus",
  defaultOpenItems,
}: DocsAccordionPanelProps): ReactNode {
  return (
    <div
      className="afenda-docs-accordion-panel"
      data-icon={iconStyle}
      data-variant={variant}
    >
      <Accordion
        type="multiple"
        {...(defaultOpenItems ? { defaultValue: [...defaultOpenItems] } : {})}
      >
        {items.map((item) => (
          <AccordionItem key={item.title} value={item.title}>
            <AccordionTrigger>
              {item.title}
              {iconStyle === "plus-minus" ? <AccordionPlusMinusIcon /> : null}
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
