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
    <TooltipContent>Operator guidance appears on focus or hover.</TooltipContent>
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

export const FocusReveal: Story = {
  tags: ["lab-smoke"],
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /^help$/i });
    await expect(trigger).toBeVisible();
    await userEvent.hover(trigger);

    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/operator guidance appears on focus or hover/i)
    ).toBeVisible();
  },
};
