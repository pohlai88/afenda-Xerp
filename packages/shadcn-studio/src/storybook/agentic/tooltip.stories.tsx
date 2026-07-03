import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../components-ui/button.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components-ui/tooltip.js";
import { agenticCenteredMetaParameters } from "./agentic-story-parameters.js";

const TooltipDemo = () => (
  <Tooltip>
    <TooltipTrigger render={<Button variant="outline" />}>Help</TooltipTrigger>
    <TooltipContent>
      Operator guidance appears on focus or hover.
    </TooltipContent>
  </Tooltip>
);

const meta = {
  title: "Agentic/Tooltip",
  component: TooltipDemo,
  tags: ["autodocs", "ai-generated"],
  parameters: agenticCenteredMetaParameters,
} satisfies Meta<typeof TooltipDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Tooltip visibility on pointer hover for quick contextual guidance.
 *
 * @summary for hover-based contextual guidance
 */
export const FocusReveal: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /^help$/i });
    await expect(trigger).toBeVisible();
    await userEvent.hover(trigger);

    // Portaled content renders outside canvas; query ownerDocument.body.
    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/operator guidance appears on focus or hover/i)
    ).toBeVisible();
  },
};

/**
 * Tooltip with explicit top placement for dense layouts needing predictable positioning.
 *
 * @summary for fixed top-position tooltip behavior
 */
export const TopPlacement: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Help
      </TooltipTrigger>
      <TooltipContent side="top">
        Operator guidance appears on focus or hover.
      </TooltipContent>
    </Tooltip>
  ),
};

/**
 * Keyboard-only reveal to validate focus-triggered accessibility behavior.
 *
 * @summary for keyboard-focus tooltip visibility checks
 */
export const KeyboardOnly: Story = {
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /^help$/i });
    await expect(trigger).toBeVisible();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/operator guidance appears on focus or hover/i)
    ).toBeVisible();
  },
};
