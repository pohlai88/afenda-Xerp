import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip.js";

const meta = {
  component: TooltipProvider,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("tooltip"),
  },
} satisfies Meta<typeof TooltipProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger>Approval status</TooltipTrigger>
        <TooltipContent>
          Awaiting finance manager sign-off for PO-1042.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /approval status/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("data-slot", "tooltip-trigger");

    await userEvent.hover(trigger);

    const body = within(canvasElement.ownerDocument.body);
    await expect(
      await body.findByText(/finance manager sign-off for PO-1042/i)
    ).toBeVisible();
  },
};

export const SideBottom: Story = {
  render: () => (
    <TooltipProvider delay={0}>
      <Tooltip>
        <TooltipTrigger>Lead time</TooltipTrigger>
        <TooltipContent side="bottom">
          Standard freight — 5 business days.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};
