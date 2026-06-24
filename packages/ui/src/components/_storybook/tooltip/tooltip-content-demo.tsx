"use client";

import { InfoIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "../../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip";
import {
  TOOLTIP_CONTENT_BODY,
  TOOLTIP_CONTENT_TITLE,
  TOOLTIP_CONTENT_TRIGGER_LABEL,
} from "./tooltip-fixtures";

export interface StorybookTooltipContentProps {
  readonly body?: string;
  readonly defaultOpen?: boolean;
  readonly title?: string;
  readonly triggerLabel?: string;
}

/**
 * Storybook-only rich tooltip content — normalized from shadcn-studio tooltip-07.
 *
 * Phase 3 normalization:
 *   - Zero className on Button, Tooltip, TooltipTrigger, TooltipContent
 *   - Icon + title + body layout in tooltip-preview.css (portaled via :has)
 *   - Button: emphasis="outline" intent="secondary" size="sm"
 */
export function StorybookTooltipContent({
  body = TOOLTIP_CONTENT_BODY,
  defaultOpen,
  title = TOOLTIP_CONTENT_TITLE,
  triggerLabel = TOOLTIP_CONTENT_TRIGGER_LABEL,
}: StorybookTooltipContentProps): ReactNode {
  return (
    <div className="afenda-storybook-tooltip">
      <Tooltip {...(defaultOpen ? { defaultOpen: true } : {})}>
        <TooltipTrigger asChild>
          <Button emphasis="outline" intent="secondary" size="sm">
            {triggerLabel}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="afenda-storybook-tooltip__body">
            <div className="afenda-storybook-tooltip__header">
              <InfoIcon
                aria-hidden="true"
                className="afenda-storybook-tooltip__icon"
              />
              <p className="afenda-storybook-tooltip__title">{title}</p>
            </div>
            <p className="afenda-storybook-tooltip__description">{body}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
