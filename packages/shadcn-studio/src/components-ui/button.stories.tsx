import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { buttonStoryArgTypes } from "../storybook/colocated-argtypes.js";
import { Button } from "./button.js";

const meta = {
  component: Button,
  tags: ["autodocs", "lab-smoke", "colocated"],
  argTypes: buttonStoryArgTypes,
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("button"),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  args: {
    children: "Order now",
    type: "button",
    onClick: fn(),
  },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: /order now/i });
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("data-slot", "button");
    await userEvent.click(button);
    await expect(button).toHaveFocus();
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Outline: Story = {
  args: {
    children: "Cancel",
    type: "button",
    variant: "outline",
    onClick: fn(),
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    type: "button",
    variant: "destructive",
    onClick: fn(),
  },
};

export const CssCheck: Story = {
  args: { children: "Submit", type: "button", variant: "default" },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /submit/i });
    await expect(getComputedStyle(button).fontWeight).toBe("500");
  },
};
