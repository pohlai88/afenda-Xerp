import type { Meta, StoryObj } from "@storybook/react";
import { StoryFrame } from "../story-frame";
import { StorybookTooltipContent } from "./tooltip-content-demo";
import {
  TOOLTIP_CONTENT_BODY,
  TOOLTIP_CONTENT_TITLE,
} from "./tooltip-fixtures";

const meta = {
  title: "Storybook / Tooltip",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * TooltipContent — normalized from shadcn-studio tooltip-07.
 *
 * Patterns applied:
 *   - Icon + title + body inside governed TooltipContent
 *   - max-w-64 + py-3 via portaled :has() CSS
 *   - Zero className on Button / Tooltip primitives
 */
export const TooltipContent: Story = {
  render: () => (
    <StoryFrame width="sm">
      <div className="afenda-docs-preview">
        <StorybookTooltipContent />
      </div>
    </StoryFrame>
  ),
};

/** Tooltip open by default — verify rich content layout without hover. */
export const DefaultOpen: Story = {
  render: () => (
    <StoryFrame width="sm">
      <div className="afenda-docs-preview">
        <StorybookTooltipContent defaultOpen />
      </div>
    </StoryFrame>
  ),
};

/** Long body copy — text-pretty wrapping inside max-width panel. */
export const LongBody: Story = {
  render: () => (
    <StoryFrame width="sm">
      <div className="afenda-docs-preview">
        <StorybookTooltipContent
          body={`${TOOLTIP_CONTENT_BODY} This extra sentence exercises wrapping inside the sixteen-rem content panel.`}
          title={TOOLTIP_CONTENT_TITLE}
        />
      </div>
    </StoryFrame>
  ),
};
