import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "./popover.js";

const meta = {
  component: Popover,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("popover"),
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  render: () => (
    <Popover>
      <PopoverTrigger>Filter vendors</PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Vendor filters</PopoverTitle>
          <PopoverDescription>
            Refine the procurement list by region, payment terms, and approval
            tier.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("button", { name: /filter vendors/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("data-slot", "popover-trigger");

    await userEvent.click(trigger);

    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/vendor filters/i)).toBeVisible();
    await expect(body.getByText(/approval tier/i)).toBeVisible();
  },
};

export const Compact: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>Quick actions</PopoverTrigger>
      <PopoverContent className="w-56">
        <PopoverHeader>
          <PopoverTitle>PO-1042 actions</PopoverTitle>
          <PopoverDescription>
            Approve, hold, or route for review.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};
