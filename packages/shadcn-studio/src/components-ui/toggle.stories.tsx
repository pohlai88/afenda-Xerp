import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { toggleStoryArgTypes } from "../storybook/colocated-argtypes.js";
import { Toggle } from "./toggle.js";

const meta = {
  component: Toggle,
  tags: ["autodocs", "lab-smoke", "colocated"],
  argTypes: toggleStoryArgTypes,
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("toggle"),
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  args: {
    children: "Tax inclusive",
    type: "button",
    "aria-label": "Show tax-inclusive amounts",
    onPressedChange: fn(),
  },
  play: async ({ args, canvas }) => {
    const control = canvas.getByRole("button", {
      name: /show tax-inclusive amounts/i,
    });
    await expect(control).toBeVisible();
    await expect(control).toHaveAttribute("data-slot", "toggle");
    await expect(control).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(control);
    await expect(control).toHaveAttribute("aria-pressed", "true");
    await expect(args.onPressedChange).toHaveBeenCalled();
  },
};

export const Outline: Story = {
  args: {
    children: "Compact",
    type: "button",
    "aria-label": "Compact density",
    variant: "outline",
    onPressedChange: fn(),
  },
};
