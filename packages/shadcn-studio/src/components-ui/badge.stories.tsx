import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "storybook/test";

import {
  shadcnStudioChromaticSmokeParameters,
  shadcnStudioPrimitiveFigmaDesignFromEnv,
} from "../storybook/story-parameters.js";
import { Badge } from "./badge.js";

const meta = {
  component: Badge,
  tags: ["autodocs", "lab-smoke", "colocated"],
  parameters: {
    ...shadcnStudioPrimitiveFigmaDesignFromEnv("badge"),
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  tags: ["a11y-smoke"],
  ...shadcnStudioChromaticSmokeParameters,
  args: { children: "Approved" },
  play: async ({ canvas }) => {
    const badge = canvas.getByText("Approved");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveAttribute("data-slot", "badge");
  },
};

export const Secondary: Story = {
  args: { children: "Draft", variant: "secondary" },
};

export const Outline: Story = {
  args: { children: "Beta", variant: "outline" },
};
