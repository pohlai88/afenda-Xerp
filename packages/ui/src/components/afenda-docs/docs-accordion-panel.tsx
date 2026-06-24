"use client";

import type { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";

export interface DocsAccordionPanelItem {
  readonly title: string;
  readonly content: ReactNode;
}

export type DocsAccordionPanelVariant = "contained" | "separated" | "flush";

export interface DocsAccordionPanelProps {
  readonly items: readonly DocsAccordionPanelItem[];
  readonly variant?: DocsAccordionPanelVariant;
}

export function DocsAccordionPanel({
  items,
  variant = "contained",
}: DocsAccordionPanelProps): ReactNode {
  return (
    <div className="afenda-docs-accordion-panel" data-variant={variant}>
      <Accordion type="multiple">
        {items.map((item) => (
          <AccordionItem key={item.title} value={item.title}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
