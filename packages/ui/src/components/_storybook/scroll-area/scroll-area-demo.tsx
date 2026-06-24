import type { ReactNode } from "react";
import { ScrollArea } from "../../scroll-area";
import {
  SCROLL_AREA_DEMO_PARAGRAPHS,
  SCROLL_AREA_DEMO_TITLE,
} from "./scroll-area-fixtures";

export interface StorybookScrollAreaDemoProps {
  readonly paragraphs?: readonly string[];
  readonly title?: string;
}

/**
 * Storybook-only scroll area panel — normalized from shadcn-studio scroll-area-01.
 *
 * Phase 3 normalization:
 *   - Zero className on ScrollArea
 *   - Fixed dimensions + border via scroll-area-preview.css on [data-slot="scroll-area"]
 *   - Typography on plain HTML wrappers only
 */
export function StorybookScrollAreaDemo({
  paragraphs = SCROLL_AREA_DEMO_PARAGRAPHS,
  title = SCROLL_AREA_DEMO_TITLE,
}: StorybookScrollAreaDemoProps): ReactNode {
  return (
    <div className="afenda-storybook-scroll-area">
      <ScrollArea>
        <div className="afenda-storybook-scroll-area__content">
          <h4 className="afenda-storybook-scroll-area__title">{title}</h4>
          <div className="afenda-storybook-scroll-area__body">
            {paragraphs.map((paragraph, index) => (
              <p
                className="afenda-storybook-scroll-area__paragraph"
                key={paragraph}
              >
                Paragraph {index + 1}: {paragraph}
              </p>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
